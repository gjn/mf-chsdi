/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * WARNING: This part of the API is not yet production ready.
 * Use at own risk until a tested implementation is available (expected December 2012).
 */

/** api: (define)
 *  module = GeoAdmin
 *  class = TimeSeries
 */

/** api: constructor
 *  .. class:: TimeSeries(options)
 *
 *  :param config: ``Object`` options of which layerName should be set
 *
 *  Paints a time axis from minYear to maxYear and allows to add sliders so that years or ranges can be selected.
 */
GeoAdmin.TimeSeries = Ext.extend(Ext.Component, {
    /** api: config[layerName]
     *  ``String`` Name of layer whose versions should be presented
     */
    layerName: "ch.swisstopo.zeitreihen",
    
    /** api: config[framesPerSecond]
     *  ``Number`` Maximum number of frames per second to render during fading. Will possibly replaced by a call to window.requestAnimationFrame once the function's API has stabilized across browsers.
     */
    framesPerSecond: 15,
    
    /** private: property[preloadedFramesRequired]
     * ``Number`` Number of timestamps that are loaded before animation initially starts
     */
    preloadedFramesRequired: 10,
    /** private: property[fadeTime]
     * ``Number`` Duration of fading timestamps [milliseconds]
     */
    fadeTime: 2500,
    /** private: property[transitionTime]
     * ``Number`` Duration of showing a single timestamp as still image in between fades [milliseconds]
     */
    transitionTime: 0,
    /** private: property[minYear]
     *  ``Number`` Earliest year for which the layer is available
     */
    minYear: null,
    /** private: property[maxYear]
     *  ``Number`` Latest year for which the layer is available
     */
    maxYear: null,
    /** private: property[animationIsPlaying]
     *  ``Boolean`` True whist the animation on the play tab is running
     */
    animationIsPlaying: false,
    /** private: property[animationState]
     *  ``AnimationStates`` Object that tracks progress of running animation
     */
    animationState: null,
    /** private: property[animationTimer]
     *  ``Number`` Identifier of timer that trigger rendering of animation frames
     */
    animationTimer: null,
    /** private: property[timestamp]
     *  ``Array.<String>`` Sorted list of layers versions from oldest to most recent
     */
    timestamps: null,
    /** private: property[animationSlider]
     *  ``GeoAdmin.TimeSeries.Slider`` Draggable on period of animation tab
     */
    animationSlider: null,
    /** private: property[compareSliderMin]
     *  ``GeoAdmin.TimeSeries.Slider`` Draggable for early year on period of compare tab
     */
    compareSliderMin: null,
    /** private: property[compareSliderMax]
     *  ``GeoAdmin.TimeSeries.Slider`` Draggable for late year on period of compare tab
     */
    compareSliderMax: null,
    /** private: property[lastAnimationYearCache]
     *  ``Number`` Year that is displayed on screen (year of last painted animation frame). Though the value can always be retrieved querying the animation slider, having the raw number is less costly.
     */
    lastAnimationYearCache: null,
    
    /** private: property[stateId]
     * ``String`` Name of state object for Ext.state.Provider
     */
    stateId: "GeoAdmin.TimeSeries",
    /** private: property[state]
     * ``Object`` Serializable state of widget
     */
    state: {
        activeTab: "playTab",
        animationSlider: null,
        compareSliderMin: null,
        compareSliderMax: null,
        compareTabOpacitySlider: 50,
        playDirection: "forwards"
    },
    
    /** private: property[preloadingDone]
     * ``Boolean`` True when enough frames have been loaded to start the animation
     */
    preloadingDone: false,
    
    initComponent: function(){
        GeoAdmin.TimeSeries.superclass.initComponent.call(this);
        // Make sure state gets restored
        this.initState();
        
        Ext.get(this.contentEl).addClass('timeseriesWidget');
        
        // Sort timestamp for layer and determine boundaries
        var timestampsAscending = GeoAdmin.layers.layers[this.layerName].timestamp.sort(function(a, b){
            return a-b;
        });
        // Group consecutive years and retain only latest of each group
        this.timestamps = [];
        var lastYear = null;
        timestampsAscending.forEach(function(timestamp){
            var year = parseInt(timestamp.substring(0, 4), 10);
            if(lastYear===year){
                this.timestamps.pop();
            }
            this.timestamps.push(timestamp);
            lastYear=year;
        }, this);

        this.minYear = parseInt(this.timestamps[0].substr(0, 4), 10);
        this.maxYear = parseInt(this.timestamps[this.timestamps.length-1].substr(0, 4), 10);
        
        this.initTabs();
        // Bind buttons on animation tab
        Ext.get(this.contentEl).child('.play').on('click', this.playPause, this);
        Ext.get(this.contentEl).child('.backwards').on('click', function(){
            this.animationSlider.setYear(this.minYear);
            this.addLayers([this.findTimestampNoLaterThan(this.minYear)], []);
        }, this);
        Ext.get(this.contentEl).child('.forwards').on('click', function(){
            this.animationSlider.setYear(this.maxYear);
            this.addLayers([this.findTimestampNoLaterThan(this.maxYear)], []);
        }, this);
        
        var playDirectionHolder = Ext.get('playTab').child('.timeseriesWidget-controls-left');
        // Add handler to each radio element separately because otherwise IE fails to call the handlers
        var playDirectionRadioButtons = playDirectionHolder.query("input[type=radio]");
        for(var i=0; i<playDirectionRadioButtons.length; i++){
            Ext.get(playDirectionRadioButtons[i]).on('change', function(event, radio){
                // Ext does only trigger change event for the radio that gets checked
                this.state.playDirection = radio.value;
                this.saveState();
                
                if(this.animationState){
                    // Update offset of animation if already running
                    this.animationState.setYear(this.animationSlider.getYear(), this.state.playDirection==="backwards");
                }
            }, this);
        }
        playDirectionHolder.child('input[value="'+this.state.playDirection+'"]').dom.checked = true;
        
        /**
         * Gets triggered when enough frames have been loaded to start animation
         */
        this.addEvents('preloadingDone');
        
        // Track all loads on all layers
        function layersCurrentlyLoading(){
            for(var i=0; i<map.layers.length; i++){
                if(map.layers[i].loading===true){
                    return true;
                }
            }
            return false;
        }
        var preloadStatusTimer;
        function anyLayerLoadStart(e){
            // Show message that layer is loading when a visible layer starts to load
            if(e.object.opacity>0){
                clearTimeout(preloadStatusTimer);
                var timeseriesWidget = this;
                // Delay message so that no message is shown whilst browser does load from disk cache
                preloadStatusTimer = setTimeout(function(){
                    var preloadStatus = timeseriesWidget.clearAndGetPreloadStatusIndicator();
                    preloadStatus.addClass("timeseriesWidget-preload-status-loading");
                    preloadStatus.setTextContent(OpenLayers.i18n("Loading animation, please wait…"));
                }, 500);
            }
        }
        function anyLayerLoadEnd(){
            // Remove spinner when last layer was loaded
            if(layersCurrentlyLoading()===false){
                clearTimeout(preloadStatusTimer);
                this.clearAndGetPreloadStatusIndicator();
            }
        }
        function anyLayerAdded(e){
            // Monitor loading status of layer
            e.layer.events.register('loadstart', this, anyLayerLoadStart);
            e.layer.events.register('loadend', this, anyLayerLoadEnd);
        }
        function anyLayerRemoved(e){
            // Stop monitoring
            e.layer.events.unregister('loadstart', this, anyLayerLoadStart);
            e.layer.events.unregister('loadend', this, anyLayerLoadEnd);
            
            anyLayerLoadEnd.call(this);
        }
        map.events.register('addlayer', this, anyLayerAdded);
        map.events.register('removelayer', this, anyLayerRemoved);
        map.layers.forEach(function(layer){
            anyLayerAdded.call(this, {
                layer: layer
            });
        }, this);
        
        function handleExtentChanged(){
            if(this.animationIsPlaying){
                // Stop the animation
                this.playPause();
            }
            this.discardInvisibleLayers();
            this.preloadingDone = false;
        }
        map.events.register('moveend', this, handleExtentChanged);
        map.events.register('zoomend', this, handleExtentChanged);
    },
    
    /** api: method[getState]
     *  :return: ``Object`` Serializable widget state to be used by permalink provider
     */
    getState: function(){
        return {
            state: {
                // Written by handler on tab change
                activeTab: this.state.activeTab,
                animationSlider: this.animationSlider ? this.findTimestampNoLaterThan(this.animationSlider.getYear()) : this.state.animationSlider,
                compareSliderMin: this.compareSliderMin ? this.compareSliderMin.getYear() : this.state.compareSliderMin,
                compareSliderMax: this.compareSliderMax ? this.compareSliderMax.getYear() : this.state.compareSliderMax,
                // Written by handler on slider change
                compareTabOpacitySlider: this.state.compareTabOpacitySlider,
                // Written by handler on slider change
                playDirection: this.state.playDirection
            }
        };
    },
    
    /** private: method[clearAndGetPreloadStatusIndicator]
     *  :return: ``HTMLDivElement`` Empty and invisible status indicator.
     */
    clearAndGetPreloadStatusIndicator: function(){
        var preloadStatus = Ext.get(this.contentEl).child('.timeseriesWidget-preload-status');
        /**
         * Displays a text in the lower right of the widget
         * @param {String} textContent Text to display
         */
        preloadStatus.setTextContent = function(textContent){
            if(typeof(this.dom.textContent)==="string"){
                this.dom.textContent = textContent;
            } else {
                // IE
                this.dom.innerText = textContent;
            }
            this.setStyle({
                visibility: "visible"
            });
        }
        preloadStatus.removeClass("timeseriesWidget-preload-status-loading");
        preloadStatus.setStyle({
            visibility: "hidden"
        });
        return preloadStatus;
    },
    
    /** private: method[playPause]
     *  Starts or stops the animation
     */
    playPause: function(){
        var timeseriesWidget = this;
        var playButtonImage = Ext.get(this.contentEl).child('.play').dom;
        
        var preloadStatus = this.clearAndGetPreloadStatusIndicator();
        
        if(this.animationIsPlaying){
            // Pause animation
            window.clearInterval(this.animationTimer);
            this.animationTimer = null;
            //console.log("paused by click");
            playButtonImage.src = playButtonImage.src.replace(/pause\.png$/, "play.png");
            playButtonImage.title = OpenLayers.i18n("Play animation (Tooltip)");
            this.animationIsPlaying = false;
        } else {
            // Play / Resume
            if(timeseriesWidget.preloadingDone===false){
                timeseriesWidget.preloadLayersInSequence();
                // Wait for preloading to finish
                preloadStatus.addClass("timeseriesWidget-preload-status-loading");
                preloadStatus.setTextContent(OpenLayers.i18n("Loading animation, please wait…"));
                timeseriesWidget.on("preloadingDone", function(){
                    preloadStatus.setStyle({
                        visibility: "hidden"
                    });
                    // Clean up timers
                    timeseriesWidget.playPause();
                    // Start a new animation
                    timeseriesWidget.playPause();
                });
            } else {
                // Try to start animation
                this.initAnimationState(function(animationState){
                    if(animationState===null){
                        preloadStatus.setTextContent(OpenLayers.i18n("Failed to load animation"));
                    } else {
                        timeseriesWidget.animationState = animationState;
                        
                        // Play / Resume
                        timeseriesWidget.animationState.setYear(timeseriesWidget.animationSlider.getYear(), timeseriesWidget.state.playDirection==="backwards");
                        timeseriesWidget.setAnimationTimer();
                        //console.log("resumed by click");
                    }
                });
            }
            playButtonImage.src = playButtonImage.src.replace(/play\.png$/, "pause.png");
            playButtonImage.title = OpenLayers.i18n("Pause animation (Tooltip)");
            
            timeseriesWidget.animationIsPlaying = true;
        }
    },
    
    /** private: method[setAnimationTimer]
     *  Queues a call to paint the next animation frame
     */
    setAnimationTimer: function(){
        var timeseriesWidget = this;
        if(this.animationTimer===null){
            this.animationTimer = window.setInterval(function(){
                timeseriesWidget.repaintAnimation();
            }, 1000/this.framesPerSecond);
        }
    },
    
    /** private: method[repaintAnimation]
     * :param timestamp: ``String`` Timestamp
     * :return: ``OpenLayers.Layer`` Layer that displays the given timestamp
     */
    getLayerForTimestamp: function(timestamp){
        var timeseriesWidget = this;
        return map.layers.filter(function(layer){
            return layer.layername===timeseriesWidget.layerName && layer.timestamp===timestamp;
        })[0];
    },
    
    /** private: method[repaintAnimation]
     *  Paints an animation frame.
     */
    repaintAnimation: function(){
        var timeseriesWidget = this;
        
        function getLayer(timestamp){
            return timeseriesWidget.getLayerForTimestamp(timestamp);
        }
        
        var state = this.animationState.getStateRatio(timeseriesWidget.state.playDirection==="backwards");
        var foreground = getLayer(state.foreground);
        if(!foreground || foreground.loading){
            // Load foreground layer if not yet there and wait for it to complete loading
            map.addLayerByName(this.layerName, {
                timestamp: state.foreground,
                //opacity: 0
            });
            foreground = getLayer(state.foreground);
            foreground.setOpacity(0);
            
            clearInterval(this.animationTimer);
            this.animationTimer = null;
            this.animationState.pause();
            function resume(){
                foreground.events.unregister('loadend', this, resume);
                foreground.setOpacity(0);
                // Continue with animation, now that all tiles are loaded
                this.animationState.recordStart();
                if(this.animationIsPlaying){
                    this.repaintAnimation();
                    this.setAnimationTimer();
                    //console.log("resumed because tiles "+state.foreground+" there");
                }
            }
            foreground.events.register('loadend', this, resume);
            return;
        }
  
        var background = getLayer(state.background);
      
        
        // Hide no longer needed layers (DOM tree modifications are deferred until no animation is going on for speed reasons)
        map.layers.forEach(function(layer){
            if(layer!==foreground && layer!==background && layer.layername===timeseriesWidget.layerName){
                layer.setOpacity(0);
            }
        });
        
        if(state.state==="fading"){
            // Fade foreground layer
            foreground.setOpacity(this.easing(state.ratio));
        } else {
            // Make foreground fully opaque since animation is now waiting for the next fade to be due
            foreground.setOpacity(1);
            /*
             * One could get rid of no longer needed layers.
             * Current OpenLayers versions mess up the layers' z-index when any layer is removed unless a base layer is set.
             */
            if(background){
                for(var layerIter=map.layers.length-1; layerIter>=0; layerIter--){
                    var layer = map.layers[layerIter];
                    if(layer!==foreground && layer!==background && layer.layername===timeseriesWidget.layerName){
                        map.removeLayer(layer);
                    }
                }
            }
        }
        foreground.setZIndex(101);
        if(background){
            background.setOpacity(1);
            background.setZIndex(100);
        }
        
        // Update slider but only when needed to keep reflows low
        var currentYear = state.year;
        if(this.lastAnimationYearCache!==currentYear){
            this.animationSlider.setYear(currentYear);
            this.lastAnimationYearCache = currentYear;
        }
    },
    
    /** private: method[findTimestampNoLaterThan]
     * :param year: ``Number`` Year for which to find data
     * :return: ``string`` Timestamp of latest data that is before or in given year
     */
    findTimestampNoLaterThan: function(year){
        var candidate = null;
        for(var timestampIter=0; timestampIter<this.timestamps.length; timestampIter++){
            var parts = this.timestamps[timestampIter].match(/(\d{4})(\d{2})(\d{2})/);
            var current = new Date(parseInt(parts[1], 10), parseInt(parts[2], 10)-1, parseInt(parts[3]));
            if(candidate===null || (candidate<current && current.getFullYear()<=year)){
                candidate = current;
            }
        }
        return String(candidate.getFullYear())+String(candidate.getMonth()+1)+String(candidate.getDate());
    },
    
    /** private: method[getAnimationPeriods]
     * :param onCompletion: ``Function`` Called when available timestamps are known and receives list of timestamps that are to be shown in animation (``Array.<String>``). The list is ``undefined`` however if gathering the available timestamps failed.
     */
    getAnimationPeriods: function(onCompletion){
        var timeseriesWidget = this;
        window.geoAdminTimeSeriesGetAnimationPeriodsCallback = function geoAdminTimeSeriesGetAnimationPeriodsCallback(timestamps){
            var animationSliderTimestamp = timeseriesWidget.animationSlider.getYear()*1e4;
            onCompletion(timestamps);
        };
        var mapCenter = map.getCenter();
        var documentHead = document.getElementsByTagName("head")[0];
        var jsonpRequester = document.createElement("script");
        jsonpRequester.type = "text/javascript";
        // URI of service providing the animation timestamps
        jsonpRequester.src = GeoAdmin.webServicesUrl+"/zeitreihen?scale="+encodeURIComponent(Math.round(map.getScale()))+"&easting="+encodeURIComponent(mapCenter.lon)+"&northing="+encodeURIComponent(mapCenter.lat)+"&cb=geoAdminTimeSeriesGetAnimationPeriodsCallback";
        function discardRequester(){
            documentHead.removeChild(jsonpRequester);
            delete window.geoAdminTimeSeriesGetAnimationPeriodsCallback;
        }
        jsonpRequester.onload = discardRequester;
        jsonpRequester.onerror = function(){
            discardRequester();
            onCompletion();
        };
        documentHead.appendChild(jsonpRequester);
    },
    
    /** private: method[initAnimationState]
     * Initializes object that manages states of animation
     * :param onCompletion: ``Function`` Called when available timestamps are known and receives animation state model. The model is ``null`` however if gathering the available timestamps failed.
     */
    initAnimationState: function(onCompletion){
        var fadeTime = this.fadeTime;
        var transitionTime = this.transitionTime;
        
        this.getAnimationPeriods(function(periods){
            if(!(periods instanceof Array)){
                // Report failure to get timestamps of animation
                onCompletion(null);
            } else {
                /*
                * The state of the animation is derived purely from the time elapsed since animation start.
                */
                onCompletion(new (function AnimationStates(fadeTime, transitionTime, periods){
                    var periodsLength = periods.length;
                    var totalAnimationDuration = periodsLength*transitionTime+(periodsLength-1)*fadeTime;
                    
                    var start = new Date().getTime();
                    var pauseStart;
                    this.recordStart = function recordStart(){
                        if(pauseStart===undefined){
                            start = new Date().getTime();
                        } else {
                            start = start + (new Date().getTime()-pauseStart);
                        }
                    };
                    this.pause = function(){
                        pauseStart = new Date().getTime();
                    };
                    function getTotalOffset(){
                        return new Date().getTime()-start;
                    }
                    /**
                    * @param {boolean} reverse Whether to get state for forwards or backwards playing animation
                    * @return {object}
                    */
                    this.getStateRatio = function getStateRatio(reverse){
                        var totalOffset = getTotalOffset();
                        // Limit offset to period length in case of loops
                        var offset = totalOffset % totalAnimationDuration;
                        var isLastState;
                        if(reverse){
                            offset = totalAnimationDuration - offset;
                            isLastState = totalOffset===0;
                        } else {
                            isLastState = totalOffset>0 && offset===0;
                        }
                        var overlayOffset = offset % (fadeTime+transitionTime);
                        var ratio;
                        if(overlayOffset<=transitionTime){
                            state = "transitioning";
                            ratio = overlayOffset/transitionTime;
                        } else {
                            state = "fading";
                            ratio = (overlayOffset-transitionTime)/fadeTime;
                        }
                        if(isLastState){
                            ratio = 1;
                        }
                        var foreground = isLastState ? periodsLength-1 : Math.floor(offset/(transitionTime+fadeTime)) + (((offset % (transitionTime+fadeTime)) <= transitionTime) ? 0 : 1);
                        state = (offset % (transitionTime+fadeTime)) <= transitionTime ? "transitioning" : "fading";
                        var background = periods[(reverse && state==="fading") ? foreground : (foreground-1)];
                        foreground = periods[(reverse && state==="fading") ? (foreground - 1) : foreground];
                        ratio = reverse ? 1 - ratio : ratio;
                        return {
                            foreground: foreground,
                            background: background,
                            state: state,
                            ratio: ratio,
                            // Interpolated year (interpolated in between the visualized timestamps being currently faded)
                            year: (state==="transitioning") ? this.yearFromTimestamp(foreground) : this.interpolateYears(background, foreground, ratio)
                        };
                    };
                    
                    /**
                    * Adjust internally recorded time to match up with given year
                    * @param {Number} targetYear Year that is displayed / State to which to push animation
                    * @param {boolean} reverse
                    */
                    this.setYear = function setYear(targetYear, reverse){
                        var offset = transitionTime;
                        if(reverse===false){
                            for(var i=0; i<periods.length; i++){
                                var year = this.yearFromTimestamp(periods[i]);
                                if(year<targetYear){
                                    offset = offset + fadeTime + transitionTime;
                                }
                            }
                        } else {
                            for(var i=periods.length-1; i>=0; i--){
                                var year = this.yearFromTimestamp(periods[i]);
                                if(targetYear<year){
                                    offset = offset + fadeTime + transitionTime;
                                }
                            }
                        }
                        start = new Date().getTime()-offset;
                    };
                    
                    this.interpolateYears = function(from, to, ratio){
                        var fromYear = this.yearFromTimestamp(from);
                        var toYear = this.yearFromTimestamp(to);
                        return Math.floor(fromYear + (toYear - fromYear)*ratio);
                    };
                    this.yearFromTimestamp = function(timestamp){
                        return parseInt(timestamp.substring(0, 4), 10);
                    };
                })(fadeTime, transitionTime, periods));
            }
        });
    },
    
    /** private: method[getInitialAnimationYear]
     * :return: ``Number`` Default year of animation slider
     */
    getInitialAnimationYear: function(){
        if(this.state.animationSlider){
            return this.state.animationSlider;
        }
        return 1938;
        //return Math.floor((this.minYear+this.maxYear)/2);
    },
    
    isTimeSeriesLayer: function(layer){
        return layer.name===this.layerName || layer.layername===this.layerName;
    },
    
    discardInvisibleLayers: function(){
        this.map.layers.slice(0).forEach(function(layer){
            if((layer.opacity===0 || layer.getVisibility()===false) && this.isTimeSeriesLayer(layer)){
                this.map.removeLayer(layer);
            }
        }, this);
    },
    
    preloadLayersInSequence: function(){
        var timeseriesWidget = this;
        
        // Preload upcoming frames one after the other
        timeseriesWidget.getAnimationPeriods(function(animationPeriods){
            var timestamp;
            var year = timeseriesWidget.animationSlider.getYear();
            animationPeriods.forEach(function(ts){
                if(parseInt(ts.substring(0,4), 10)<=year){
                    timestamp = ts;
                }
            });
            if(!(animationPeriods instanceof Array)){
                // Failed to get periods from server, don't proceed with preloading
                return;
            }
            
            // Create a clone of the list and sort it so that it contains the timestamps in ascending upcoming order
            animationPeriods = animationPeriods.slice(0).sort();
            for(var i=0; i<animationPeriods.length; i++){
                if(parseInt(animationPeriods[i], 10)>=parseInt(timestamp, 10)){
                    break;
                }
            }
            var beforeTimestamp = animationPeriods.splice(0,i);
            while(beforeTimestamp.length>0){
                animationPeriods.push(beforeTimestamp.shift());
            }
            if(timeseriesWidget.state.playDirection==="backwards"){
                animationPeriods.reverse();
            }
            
            var timestampShown = timeseriesWidget.findTimestampNoLaterThan(year);
            var shownLayer = map.layers.filter(function(layer){
                return timeseriesWidget.isTimeSeriesLayer(layer) && (layer.opacity>0 && layer.getVisibility());// && layer.timestamp===timestampShown;
            }).pop();
            if(shownLayer.loading){
                // Preload once currently shown layer is loaded
                shownLayer.events.register("loadend", timeseriesWidget, function(){
                    var indexOfShown = animationPeriods.indexOf(timestamp);
                    var lowPrio = animationPeriods.splice(0, indexOfShown);
                    lowPrio.forEach(function(preloadTimestamp){
                        animationPeriods.push(preloadTimestamp);
                    });
                    //console.log("animationPeriods: "+animationPeriods);
                    delayedPreload(1);
                });
            } else {
                // Preload immediately because currently shown layer is already loaded
                delayedPreload(1);
            }
            function delayedPreload(timestampIndex){
                if(timestampIndex<animationPeriods.length-1){
                    var preloadTimestamp = animationPeriods[timestampIndex];
                    //console.log(timestampIndex+". Preloading "+preloadTimestamp);
                    var layer = map.addLayerByName(timeseriesWidget.layerName, {
                        timestamp: preloadTimestamp,
                        //opacity: 0
                    });
                    layer.setOpacity(0);
                    function layerPreloaded(){
                        layer.events.unregister("loadend", timeseriesWidget, layerPreloaded);
                        
                        if(timestampIndex===this.preloadedFramesRequired){
                            timeseriesWidget.preloadingDone = true;
                            //console.log("Enough preloading done");
                            timeseriesWidget.fireEvent("preloadingDone");
                        }
                        delayedPreload(timestampIndex + 1);
                    }
                    if(layer.tileQueue.length>0){
                        layer.events.register("loadend", timeseriesWidget, layerPreloaded);
                    } else {
                        delayedPreload(timestampIndex + 1);
                    }
                } else if(timeseriesWidget.preloadingDone===false) {
                    // Trigger preloadingDone when all frame are loaded
                    timeseriesWidget.preloadingDone = true;
                    timeseriesWidget.fireEvent("preloadingDone");
                }
            }
        });
    },
    
    /** private: method[initTabs]
     * Instantiates tabs, periods within and assigns handlers to elements in tabs
     */
    initTabs: function(){
        var compareTabOpacitySlider = new GeoExt.LayerOpacitySlider({
            renderTo: 'compareTabOpacitySlider',
            width:120,
            aggressive: true,
            value: this.state.compareTabOpacitySlider
        });
        compareTabOpacitySlider.on('changecomplete', function(event, value){
            this.state.compareTabOpacitySlider = value;
            this.saveState();
        }, this);
        var playPeriod = new GeoAdmin.TimeSeries.PeriodDisplay({
            minYear: this.minYear,
            maxYear: this.maxYear,
            renderTo: 'playPeriod'
        });
        var comparePeriod = new GeoAdmin.TimeSeries.PeriodDisplay({
            minYear: this.minYear,
            maxYear: this.maxYear,
            renderTo: 'comparePeriod'
        });
        var tabs = new Ext.TabPanel({
            renderTo: this.contentEl,
            activeTab: ["playTab", "compareTab", "informationTab"].indexOf(this.state.activeTab),
            plain: true,
            deferredRender: false,
            items: [{
                title: OpenLayers.i18n('Play'),
                contentEl: "playTab"
            },{
                title: OpenLayers.i18n('Compare 2 timestamps'),
                contentEl: "compareTab"
            }, {
                title: OpenLayers.i18n('Information about shown maps'),
                contentEl: "informationTab"
            }]
        });
        var sliderImagePath = OpenLayers.Util.getImagesLocation()+"../../../../lib/GeoAdmin.ux/TimeSeries/img/";
        var timeseriesWidget = this;
        
        /**
         * Creates sliders when a tab is first shown
         */
        function initializeSliders(tabs, newlyActiveTab){
            // Moving sliders does only affect map after a delay because otherwise the DOM would need to be restructured a lot and pointless requests would be initiated
            var sliderChangeDelay = 500;
            
            function changeAnimationSlider(){
                var year = timeseriesWidget.animationSlider.getYear();
                if(timeseriesWidget.animationIsPlaying){
                    // Stop animation
                    timeseriesWidget.playPause();
                    //console.log("stopped animation because slider drag");
                }
                if(animationSliderPending){
                    clearTimeout(animationSliderPending);
                }
                animationSliderPending = setTimeout(function(){
                    var timestamp = timeseriesWidget.findTimestampNoLaterThan(year)
                    timeseriesWidget.addLayers([timestamp], []);
                    timeseriesWidget.getLayerForTimestamp(timestamp).setOpacity(1);

                    
                }, sliderChangeDelay);
                
                timeseriesWidget.saveState();
            }
            
            var ignoreYearChange = false;
            function changeAnyCompareSlider(){
                if(ignoreYearChange){
                    // Ignore changes from adjusting years programmatically
                    return;
                }
                if(compareSliderPending){
                    clearTimeout(compareSliderPending);
                }
                
                // Move other slider along (allows pushing a slider by moving the other against it)
                var movedSlider = this;
                var compareSliderMaxYear = timeseriesWidget.compareSliderMax.getYear();
                if(compareSliderMaxYear<=timeseriesWidget.minYear){
                    timeseriesWidget.compareSliderMax.setYear(timeseriesWidget.minYear+1);
                    return;
                }
                var compareSliderMinYear = timeseriesWidget.compareSliderMin.getYear();
                if(compareSliderMinYear>=timeseriesWidget.maxYear){
                    timeseriesWidget.compareSliderMin.setYear(timeseriesWidget.maxYear-1);
                    return;
                }
                ignoreYearChange = true;
                if(movedSlider===timeseriesWidget.compareSliderMax && compareSliderMinYear>=compareSliderMaxYear){
                    timeseriesWidget.compareSliderMin.setYear(Math.max(compareSliderMaxYear-1, timeseriesWidget.minYear));
                }
                if(movedSlider===timeseriesWidget.compareSliderMin && compareSliderMaxYear<=compareSliderMinYear){
                    timeseriesWidget.compareSliderMax.setYear(Math.min(compareSliderMinYear+1, timeseriesWidget.maxYear));
                }
                ignoreYearChange = false;
                
                compareSliderPending = setTimeout(function(){
                    var maxTimestamp = timeseriesWidget.findTimestampNoLaterThan(timeseriesWidget.compareSliderMax.getYear());
                    var minTimestamp = timeseriesWidget.findTimestampNoLaterThan(timeseriesWidget.compareSliderMin.getYear())
                    timeseriesWidget.addLayers([
                        minTimestamp,
                        maxTimestamp,
                    ], []);
                    var minLayer = timeseriesWidget.getLayerForTimestamp(minTimestamp);
                    minLayer.setZIndex(100);
                    minLayer.setOpacity(100);
                    var maxLayer = timeseriesWidget.getLayerForTimestamp(maxTimestamp);
                    maxLayer.setZIndex(101);
                    maxLayer.setOpacity(compareTabOpacitySlider.getValue()/100);
                    compareTabOpacitySlider.setLayer(maxLayer);
                }, sliderChangeDelay);
                
                timeseriesWidget.saveState();
            }
            
            // Create sliders initially
            if(newlyActiveTab.contentEl==="playTab" && playPeriod.sliders.length===0){
                var animationSliderPending;
                var compareSliderPending;
                timeseriesWidget.animationSlider = playPeriod.addSlider(sliderImagePath+"slider-middle.png", 37);
                timeseriesWidget.animationSlider.on('userdrag', changeAnimationSlider);
                timeseriesWidget.animationSlider.setYear(timeseriesWidget.getInitialAnimationYear());
                timeseriesWidget.animationSlider.on('yeartyped', changeAnimationSlider);
            }
            if(newlyActiveTab.contentEl==="compareTab" && comparePeriod.sliders.length===0){
                timeseriesWidget.compareSliderMax = comparePeriod.addSlider(sliderImagePath+"slider-right.png", 6);
                timeseriesWidget.compareSliderMax.setYear(timeseriesWidget.state.compareSliderMax || timeseriesWidget.maxYear);
                timeseriesWidget.compareSliderMin = comparePeriod.addSlider(sliderImagePath+"slider-left.png", 69);
                timeseriesWidget.compareSliderMin.setYear(timeseriesWidget.state.compareSliderMin || timeseriesWidget.minYear);
                timeseriesWidget.compareSliderMin.on('change', changeAnyCompareSlider, timeseriesWidget.compareSliderMin);
                timeseriesWidget.compareSliderMax.on('change', changeAnyCompareSlider, timeseriesWidget.compareSliderMax);
            }
            
            // Restore old view on tab change
            if(newlyActiveTab.contentEl==="playTab"){
                changeAnimationSlider();
            }
            if(newlyActiveTab.contentEl==="compareTab"){
                if(timeseriesWidget.animationIsPlaying){
                    // Stop the animation
                    timeseriesWidget.playPause();
                }
                changeAnyCompareSlider();
            }
            
            // Store state
            timeseriesWidget.state.activeTab = newlyActiveTab.contentEl;
            timeseriesWidget.saveState();
        }
        tabs.on('tabchange', initializeSliders);
        initializeSliders(tabs, tabs.getActiveTab());
    },
    
    /** private: method[addLayers]
     * :param timestampsToAdd: ``Array.<string>``
     * :param timestampsToKeep: ``Array.<string>``
     * Adds layers to map and removes other layers
     */
    addLayers: function(timestampsToAdd, timestampsToKeep){
        var pendingForDiscard = [];
        var firstAddedLayer;
        // Add layers
        for(var i=0; i<timestampsToAdd.length; i++){
            var addedLayer = map.addLayerByName(this.layerName, {
                timestamp: timestampsToAdd[i]
            });
            if(firstAddedLayer===undefined){
                firstAddedLayer = addedLayer;
            }
            timestampsToKeep.push(timestampsToAdd[i]);
        }
        // Mark others for removal
        for(var i=map.layers.length-1; i>=0; i--){
            if(timestampsToKeep.indexOf(map.layers[i].timestamp)===-1){
                pendingForDiscard.push(map.layers[i]);
            }
        }
        
        function discard(){
            if(firstAddedLayer){
                firstAddedLayer.events.unregister('loadend', this, discard);
            }
            pendingForDiscard.forEach(function(layer){
                if(!(layer instanceof OpenLayers.Layer.Vector) && map.layers.indexOf(layer)>=0 && layer.layername!=="voidLayer"){
                    map.removeLayer(layer);
                }
            });
        }
        
        // Remove no longer needed layers as soon as new data is loaded
        if(firstAddedLayer && firstAddedLayer.loading){
            firstAddedLayer.events.register('loadend', this, discard);
        } else {
            discard();
        }
    },
    
    /**
     * Calculates the opacity of the overlaying layer during fades.
     * :param p: ``Number`` Fraction of the animation progress (range 0..1)
     * :return: ``Number`` Opacity (range 0=tranparent to 1=opaque)
     */
    easing: function (p){
        // Easing based on EaseInOutSine of https://github.com/jquery/jquery-ui/blob/1-8-stable/ui/jquery.effects.core.js#L607
        if(p<0.5){
            return (1 - Math.cos( p * Math.PI ))/2;
        } else {
            return (1 - Math.cos( (p * -2 + 2) * Math.PI / 2 )) / -2 + 1;
        }
    }
});


/** api: constructor
 *  .. class:: PeriodDisplay(options)
 *
 *  :param config: ``Object`` options which need to contain minYear and maxYear.
 *
 *  Paints a time axis from minYear to maxYear and allows to add sliders so that years or ranges can be selected.
 */
GeoAdmin.TimeSeries.PeriodDisplay = Ext.extend(Ext.BoxComponent, {
    /** api: config[minYear]
     *  ``Number`` Earliest year for which data is available
     */
    minYear: null,
    /** api: config[maxYear]
     *  ``Number`` Most recent year for which data is available
     */
    maxYear: null,
    
    /**
     * :param year: ``Number`` Year to check for needing a small mark on the axis
     * :return: ``boolean`` True if year needs marking
     */
    isMinorPeriod: function(year){
        return year % 10 === 0;
    },
    /**
     * :param year: ``Number`` Year to check for needing a mark on the axis along with a label
     * :return: ``boolean`` True if year needs marking
     */
    isMajorPeriod: function(year){
        return year % 50 === 0;
    },
    
    /** private: property[wholePeriod]
     *  ``HTMLDivElement`` Container for whole period that encompasses years
     */
    wholePeriod: null,
    
    /** private: property[sliders]
     *  ``Array(GeoAdmin.TimeSeries.YearSlider)`` Sliders that can be used to select years
     */
    sliders: null,
    
    initComponent: function(){
        GeoAdmin.TimeSeries.PeriodDisplay.superclass.initComponent.call(this);
        
        this.wholePeriod = document.createElement('div');
        this.wholePeriod.className = 'period';
        // Paint years
        for(var year = this.minYear; year<=this.maxYear; year++){
            var periodYearElement = document.createElement('div');
            if(this.isMinorPeriod(year)){
                // Mark year on period but without label
                periodYearElement.className = "marked";
            }
            if(year===this.minYear || year===this.maxYear|| this.isMajorPeriod(year)){
                // Show year label
                periodYearElement.title = year;
            }
            if(year===this.maxYear){
                // Use class to work around lack of support for :last-child in IE8 */
                periodYearElement.className += " last-child";
            }
            this.wholePeriod.appendChild(periodYearElement);
        }
        
        this.sliders = [];
        
        this.contentEl = Ext.get(document.createElement('div'));
        this.contentEl.appendChild(this.wholePeriod);
    },
    
    /** api: method[addSlider]
     * :param imageSrc: ``string`` Filename
     * :return: ``GeoAdmin.TimeSeries.YearSlider`` Slider including API of getYear and setYear calls
     */
    addSlider: function(imageSrc, xOffset){
        var slider = new GeoAdmin.TimeSeries.YearSlider({
            imageSrc: imageSrc,
            xOffset: xOffset,
            renderTo: this.contentEl
        });
        
        var startX;
        slider.tracker.onStart = function(){
            startX = slider.getYearIndicatorX();
        };
        var firstYearElement = Ext.get(this.wholePeriod.firstChild);
        var lastYearElement = Ext.get(this.wholePeriod.lastChild);
        var timeseriesWidget = this;
        slider.addEvents("userdrag");
        slider.tracker.onDrag = function(){
            var newX = startX+(-this.getOffset()[0]);
            newX = Math.max(firstYearElement.getX(), newX);
            newX = Math.min(lastYearElement.getX(), newX);
            slider.setYearIndicatorX(newX);
            slider.fireEvent("userdrag");
        };
        
        // Extend slider API (methods that depend on elements of the painted period)
        var minYear = this.minYear;
        slider.getYear = function(){
            if(firstYearElement.dom.offsetWidth===0){
                // Assume slider is invisible as its tab is not shown. Do not use Ext's isVisible because it is buggier.
                // Return cached value
                return slider.input.getValue();
            }
            return Math.round((this.getYearIndicatorX()-firstYearElement.getX())/firstYearElement.getWidth()+minYear);
        };
        slider.setYear = function(year){
            this.setYearIndicatorX((year-minYear)*firstYearElement.getWidth()+firstYearElement.getX());
        };
        slider.setYear(minYear+(this.maxYear-minYear)/2);
        
        // Raise yeartyped event whenever the user enters a valid year
        slider.addEvents('yeartyped');
        function changeHandler(){
            var yearRaw = slider.input.getValue();
            var year = parseInt(yearRaw, 10);
            if(yearRaw===String(year) && timeseriesWidget.minYear<=year && timeseriesWidget.maxYear>=year){
                slider.setYear(year);
                slider.fireEvent("yeartyped", year);
            }
        }
        slider.input.on('change', changeHandler, timeseriesWidget);
        if(slider.input.dom.attachEvent){
            slider.input.dom.attachEvent('onkeyup', function(e){
                if(event.keyCode===13){
                    // Simulate change event that other browsers send on enter
                    changeHandler();
                }
            });
        }
        
        this.sliders.push(slider);
        return slider;
    }
});

/** api: constructor
 *  .. class:: YearSlider(options)
 *
 *  :param config: ``Object`` options which need to contain imageSrc (File name of slider background) and xOffset (distance of arrow to left image edge).
 *
 *  Paints a time axis from minYear to maxYear and allows to add sliders so that years or ranges can be selected.
 */
GeoAdmin.TimeSeries.YearSlider = Ext.extend(Ext.Component, {
    /** api: config[imageSrc]
     *  ``string`` File name of slider background / draggable object
     */
    imageSrc: null,
    /** api: config[xOffset]
     *  ``Number`` Distance of arrow to left image edge
     */
    xOffset: null,
    
    slider: null,
    draggable: null,
    input: null,
    tracker: null,
    
    initComponent: function(){
        this.slider = Ext.get(document.createElement('div'));
        this.slider.addClass("timeseriesWidget-slider");
        this.draggable = Ext.get(document.createElement('img'));
        this.draggable.set({
            'src': this.imageSrc,
            // Give explicit size due to bug in IE8
            width: 77,
            height: 29
        });
        this.slider.appendChild(this.draggable);
        this.input = Ext.get(document.createElement('input'));
        this.input.dom.type = "text";
        this.slider.appendChild(this.input);
        
        this.tracker = new Ext.dd.DragTracker({
            el: this.draggable
        });
        
        this.contentEl = this.slider;
        
        this.addEvents('change');
    },
    
    /** api: method[getYearIndicatorX]
     * :return: ``Number`` Offset of slider image (horizontal position)
     */
    getYearIndicatorX: function(){
        return this.slider.getX() + this.xOffset;
    },
    /** api: method[setYearIndicatorX]
     * :param x: ``Number`` Offset of slider image (horizontal position)
     * 
     * Moves the slider and updates the displayed year
     */
    setYearIndicatorX: function(x){
        this.slider.setX(x-this.xOffset);
        var year = this.getYear();
        this.input.dom.value = year;
        this.fireEvent('change', year);
    }
});
