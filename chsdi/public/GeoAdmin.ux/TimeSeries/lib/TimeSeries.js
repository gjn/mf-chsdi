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
    // TODO Change to ch.swisstopo once available
    /** api: config[layerName]
     *  ``String`` Name of layer whose versions should be presented
     */
    layerName: "ch.swisstopo.hiks-siegfried-ta50",
    
    /** api: config[framesPerSecond]
     *  ``Number`` Maximum number of frames per second to render during fading. Will possibly replaced by a call to window.requestAnimationFrame once the function's API has stabilized across browsers.
     */
    framesPerSecond: 30,
    
    
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
    
    // TODO Remove when proof of concept is no longer needed
    easings: null,
    
    initComponent: function(){
        GeoAdmin.TimeSeries.PeriodDisplay.superclass.initComponent.call(this);
        
        this.proofOfConceptInitEasings();
        
        Ext.get(this.contentEl).addClass('timeseriesWidget');
        
        // Sort timestamp for layer and determine boundaries
        this.timestamps = GeoAdmin.layers.layers[this.layerName].timestamp.sort(function(a, b){
            return a-b;
        });
        this.minYear = parseInt(this.timestamps[0].substr(0, 4), 10);
        this.maxYear = parseInt(this.timestamps[this.timestamps.length-1].substr(0, 4), 10);
        
        this.initTabs();
        // Bind buttons on animation tab
        Ext.get(this.contentEl).child('.play').on('click', this.playPause, this);
        Ext.get(this.contentEl).child('.backwards').on('click', function(){
            this.animationSlider.setYear(this.minYear);
        }, this);
        Ext.get(this.contentEl).child('.forwards').on('click', function(){
            this.animationSlider.setYear(this.maxYear);
        }, this);
        
        // Load initial layer and preload a few more
        var preloadAmount = 3;
        var preloadStart = this.timestamps.indexOf(this.findTimestampNoLaterThan(this.getInitialAnimationYear()));
        for(var layerIter=preloadStart; layerIter<Math.min(this.timestamps.length, preloadStart + preloadAmount); layerIter++){
            var layer = map.addLayerByName(this.layerName, {
                timestamp: this.timestamps[layerIter]
            });
            // Keep the first loaded layer visible but hide the layers that are just added for preloading
            if(layerIter>preloadStart){
                layer.setOpacity(0);
            }
        }
    },
    
    /** private: method[playPause]
     *  Starts or stops the animation
     */
    playPause: function(){
        if(this.animationState===null){
            this.initAnimationState();
        }
        if(this.animationIsPlaying){
            // Pause animation
            window.clearInterval(this.animationTimer);
            this.animationTimer = null;
            this.animationState.pause();
        } else {
            // Play / Resume
            //this.animationState.recordStart();
            this.animationState.setPeriod(this.animationSlider.getYear()-this.minYear);
            this.setAnimationTimer();
        }
        this.animationIsPlaying = !this.animationIsPlaying;
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
     *  Paints an animation frame.
     */
    repaintAnimation: function(){
        var layerName = this.layerName;
        var timestamps = this.timestamps;
        
        /**
         * Fetches a reference to the foreground layer (if such exists)
         */
        function getActiveOverlay(period){
            return map.layers.filter(function(layer){
                return layer.layername===layerName && layer.timestamp===timestamps[period];
            })[0];
        }
        
        var state = this.animationState.getStateRatio();
        var activeOverlay = getActiveOverlay(state.period);
        if(state.period===0){
            lastOverlay = getActiveOverlay(timestamps.length-1);
        } else {
            lastOverlay = getActiveOverlay(state.period - 1);
        }
        if(lastOverlay){
            // Make background layer fully opaque (necessary in case frames get skipped) and arrange behind foreground
            lastOverlay.setOpacity(1);
            lastOverlay.setZIndex(100);
        }
        if(activeOverlay===undefined){
            // Load foreground layer in case it is still missing
            console.log("Loading for period", state.period);
            map.addLayerByName(layerName, {
                timestamp: timestamps[state.period]
            });
            // Keep the foreground layer invisible until all tiles are there
            activeOverlay = getActiveOverlay(state.period);
            activeOverlay.setVisibility(false);
            activeOverlay.setOpacity(0);
            // Wait for the layer to load
            clearInterval(this.animationTimer);
            this.animationTimer = null;
            this.animationState.pause();
            console.log('Waiting for tiles');
            function resume(){
                activeOverlay.events.unregister('loadend', this, resume);
                activeOverlay.setVisibility(true);
                console.log('Resuming since tiles there');
                // Continue with animation, now that all tiles are loaded
                this.animationState.recordStart();
                if(this.animationIsPlaying){
                    this.repaintAnimation();
                }
                this.setAnimationTimer();
            }
            activeOverlay.events.register('loadend', this, resume);
        }
        activeOverlay.setZIndex(101);
        // Hide no longer needed layers
        map.layers.forEach(function(layer){
            if(layer!==activeOverlay && layer!==lastOverlay && layer.layername===layerName){
                layer.setOpacity(0);
            }
        });
        
        // TODO Use only final easing after proof of concept is no longer needed
        var selectEasing = document.getElementById("selectEasing");
        // IE8 does not support HTMLSelectElement.value
        var easingName = selectEasing.options[selectEasing.selectedIndex].value;
        if(state.state==="fading"){
            // Fade foreground layer
            activeOverlay.setOpacity(this.easings[easingName](state.ratio));
        } else {
            // Make foreground fully opaque since animation is now waiting for the next fade to be due
            activeOverlay.setOpacity(1);
            // Get rid of no longer needed layers
            if(lastOverlay){
                for(var layerIter=map.layers.length-1; layerIter>=0; layerIter--){
                    if(map.layers[layerIter]!==activeOverlay){
                        map.removeLayer(map.layers[layerIter]);
                    }
                }
                console.log("Removed overlay");
            }
        }
        
        // Update slider but only when needed to keep reflows low
        var currentYear = parseInt(timestamps[state.period].substring(0, 4), 10);
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
    
    /** private: method[initAnimationState]
     * Initializes object that manages states of animation
     */
    initAnimationState: function(){
        // TODO Use final values once proof of concept is no longer needed
        var fadeTime = parseInt(document.getElementById("fadeTime").value, 10);
        var transitionTime = parseInt(document.getElementById("transitionTime").value, 10);
        
        var periods = GeoAdmin.layers.layers[this.layerName].timestamp.length;
        
        /*
         * The state of the animation is derived purely from the time elapsed since animation start.
         */
        this.animationState = new (function AnimationStates(fadeTime, transitionTime, periods){
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
            this.getStateRatio = function getStateRatio(){
                var totalOffset = getTotalOffset();
                var overlayOffset = totalOffset % (fadeTime+transitionTime);
                var state;
                var ratio;
                if(overlayOffset<fadeTime){
                    state = "fading";
                    ratio = overlayOffset/fadeTime;
                } else {
                    state = "transitioning";
                    ratio = (overlayOffset-fadeTime)/transitionTime;
                }
                return {
                    state: state,
                    ratio: ratio,
                    period: Math.floor(totalOffset/(fadeTime+transitionTime)) % periods
                };
            };
            
            this.setPeriod = function setPeriod(period){
                var offset = (fadeTime+transitionTime)*period;
                start = new Date().getTime()-offset;
            };
        })(fadeTime, transitionTime, periods);
    },
    
    /** private: method[getInitialAnimationYear]
     * :return: ``Number`` Default year of animation slider
     */
    getInitialAnimationYear: function(){
        return Math.floor((this.minYear+this.maxYear)/2);
    },
    
    /** private: method[initTabs]
     * Instantiates tabs, periods within and assigns handlers to elements in tabs
     */
    initTabs: function(){
        var compareTabOpacitySlider = new GeoExt.LayerOpacitySlider({
            renderTo: 'compareTabOpacitySlider',
            width:120,
            aggressive: true,
            value: 50
        });
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
            activeTab: 0,
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
        var sliderImagePath = OpenLayers.Util.getImagesLocation()+"../../TimeSeries/img/";
        var timeseriesWidget = this;
        
        /**
         * Creates sliders when a tab is first shown
         */
        function initializeSliders(tabs, newlyActiveTab){
            // Moving sliders does only affect map after a delay because otherwise the DOM would need to be restructured a lot and pointless requests would be initiated
            var sliderChangeDelay = 500;
            
            function changeAnimationSlider(){
                var year = timeseriesWidget.animationSlider.getYear();
                // TODO Should animation be stopped instead?
                if(timeseriesWidget.animationIsPlaying===false){
                    if(animationSliderPending){
                        clearTimeout(animationSliderPending);
                    }
                    animationSliderPending = setTimeout(function(){
                        timeseriesWidget.addLayers([timeseriesWidget.findTimestampNoLaterThan(year)], []);
                    }, sliderChangeDelay);
                }
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
                    timeseriesWidget.addLayers([
                        timeseriesWidget.findTimestampNoLaterThan(timeseriesWidget.compareSliderMin.getYear()),
                        maxTimestamp,
                    ], []);
                    map.layers.forEach(function(layer){
                        if(layer.timestamp===maxTimestamp){
                            // Reuse opacity of foreground layer
                            layer.setOpacity(compareTabOpacitySlider.getValue()/100);
                            compareTabOpacitySlider.setLayer(layer);
                        }
                    });
                }, sliderChangeDelay);
            }
            
            // Create sliders initially
            if(newlyActiveTab.contentEl==="playTab" && playPeriod.sliders.length===0){
                var animationSliderPending;
                var compareSliderPending;
                timeseriesWidget.animationSlider = playPeriod.addSlider(sliderImagePath+"slider-middle.png", 46);
                timeseriesWidget.animationSlider.on('change', changeAnimationSlider);
                timeseriesWidget.animationSlider.setYear(timeseriesWidget.getInitialAnimationYear());
            }
            if(newlyActiveTab.contentEl==="compareTab" && comparePeriod.sliders.length===0){
                timeseriesWidget.compareSliderMax = comparePeriod.addSlider(sliderImagePath+"slider-right.png", 11);
                timeseriesWidget.compareSliderMax.setYear(timeseriesWidget.maxYear);
                timeseriesWidget.compareSliderMin = comparePeriod.addSlider(sliderImagePath+"slider-left.png", 82);
                timeseriesWidget.compareSliderMin.setYear(timeseriesWidget.minYear);
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
                if(map.layers.indexOf(layer)>=0){
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
    
    // TODO Remove when proof of concept is no longer needed
    proofOfConceptInitEasings: function (){
        // Easings based on https://github.com/jquery/jquery-ui/blob/1-8-stable/ui/jquery.effects.core.js#L607
        this.easings = (function(){
            var easings = {
                Linear: function(p){
                    return p;
                }
            };
            var baseEasings = {
                Sine: function ( p ) {
                    return 1 - Math.cos( p * Math.PI / 2 );
                },
                Circ: function ( p ) {
                    return 1 - Math.sqrt( 1 - p * p );
                },
                Elastic: function( p ) {
                    return p === 0 || p === 1 ? p :
                    -Math.pow( 2, 8 * (p - 1) ) * Math.sin( ( (p - 1) * 80 - 7.5 ) * Math.PI / 15 );
                },
                Back: function( p ) {
                    return p * p * ( 3 * p - 2 );
                },
                Bounce: function ( p ) {
                    var pow2,
                    bounce = 4;

                    while ( p < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
                    return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );
                }
            };

            [ "Quad", "Cubic", "Quart", "Quint", "Expo" ].forEach(function( name, i ) {
                baseEasings[ name ] = function( p ) {
                    return Math.pow( p, i + 2 );
                };
            });

            ["Sine", "Circ", "Elastic", "Back", "Bounce", "Quad", "Cubic", "Quart", "Quint", "Expo"].forEach(function(name){
                var easeIn = baseEasings[name];
                easings[ "easeIn" + name ] = easeIn;
                easings[ "easeOut" + name ] = function( p ) {
                    return 1 - easeIn( 1 - p );
                };
                easings[ "easeInOut" + name ] = function( p ) {
                    return p < .5 ?
                    easeIn( p * 2 ) / 2 :
                    easeIn( p * -2 + 2 ) / -2 + 1;
                };
            });
            return easings;
        })();
        var selectEasing = document.getElementById("selectEasing");
        for(var name in this.easings){
            // IE 8 does not support Option constructor
            var option = document.createElement('option');
            option.appendChild(document.createTextNode(name));
            selectEasing.appendChild(option);
        }
        selectEasing.selectedIndex = 3;//"easeInOutSine";
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
        slider.tracker.onDrag = function(){
            var newX = startX+(-this.getOffset()[0]);
            newX = Math.max(firstYearElement.getX(), newX);
            newX = Math.min(lastYearElement.getX(), newX);
            slider.setYearIndicatorX(newX);
        };
        
        // Extend slider API (methods that depend on elements of the painted period)
        var minYear = this.minYear;
        slider.getYear = function(){
            return Math.round((this.getYearIndicatorX()-firstYearElement.getX())/firstYearElement.getWidth()+minYear);
        };
        slider.setYear = function(year){
            this.setYearIndicatorX((year-minYear)*firstYearElement.getWidth()+firstYearElement.getX());
        };
        slider.setYear(minYear+(this.maxYear-minYear)/2);
        
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
            'src': this.imageSrc
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