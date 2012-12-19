/*global GeoAdmin:true, OpenLayers: true, Ext:true */

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
     *  ``String`` Technical name of layer whose versions should be presented
     */
    layerName: "ch.swisstopo.zeitreihen",

    /** api: config[framesPerSecond]
     *  ``Number`` Maximum number of frames per second to render during fading. Will possibly replaced by a call to window.requestAnimationFrame once the function's API has stabilized across browsers.
     */
    framesPerSecond: 12,
    
    /** api: config[geoAdminRoot]
     * ``String`` Path to GeoAdmin library.
     */
    geoAdminRoot: null,

    /** private: property[fadeTime]
     * ``Number`` Duration of fading timestamps [milliseconds]
     */
    fadeTime: 2000,
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
        playDirection: "forwards",
        fadeTime: 2000
    },

    /** private: property[preloadingDone]
     * ``Boolean`` True when enough frames have been loaded to start the animation
     */
    preloadingDone: false,

    /** private: property[animationTimestampsCache]
     * ``Object`` Holds timestamp of current animation by zeitreihen service request URI
     */
    animationTimestampsCache: {},

    initComponent: function() {
        GeoAdmin.TimeSeries.superclass.initComponent.call(this);
      
        var bind = function(scope, fn) {
           return function () {
              fn.apply(scope, arguments);
           };
        };

        document.addEventListener("keydown",bind(this, function(evt) {
           if (this.state.activeTab == "playTab") {
              if (evt.keyCode == 37) {
                this.stopAnimation();
                 var previousYear = this.animationSlider.getYear() - 1;
                 if (previousYear < this.minYear) {
                     previousYear = this.minYear;
                  }
                  this.showYearInAnimationMode(previousYear);
                  this.animationSlider.setYear(previousYear);
              }
              if (evt.keyCode == 39) {
                  this.stopAnimation();
                  var nextYear =  this.animationSlider.getYear() + 1;
                  if (nextYear > this.maxYear) {
                      nextYear = this.maxYear;
                  }
                  this.showYearInAnimationMode(nextYear);
                  this.animationSlider.setYear(nextYear);
              }
           }
        }), false); 

        // Verify required configuration is done
        if(this.geoAdminRoot === null){
            throw new Error("Set path to GeoAdmin library by defining geoAdminRoot.");
        }
        
        // Make sure state gets restored
        this.initState();

        this.state.fadeTime = this.state.fadeTime ? this.state.fadeTime : this.fadeTime;

        Ext.get(this.contentEl).addClass('timeseriesWidget');

        // Sort timestamp for layer and determine boundaries
        var timestampsAscending = GeoAdmin.layers.layers[this.layerName].timestamp.sort(function(a, b) {
            return a - b;
        });
        // Group consecutive years and retain only latest of each group
        this.timestamps = [];
        var lastYear = null;
        GeoAdmin.TimeSeries.prototype.ArrayPrototypeForEach.call(timestampsAscending, function(timestamp) {
            var year = parseInt(timestamp.substring(0, 4), 10);
            if (lastYear === year) {
                this.timestamps.pop();
            }
            this.timestamps.push(timestamp);
            lastYear = year;
        }, this);

        this.minYear = parseInt(this.timestamps[0].substr(0, 4), 10);
        this.maxYear = parseInt(this.timestamps[this.timestamps.length - 1].substr(0, 4), 10);

        this.initTabs();
        // Bind buttons on animation tab
        Ext.get(this.contentEl).child('.play').on('click', this.playPause, this);
        Ext.get(this.contentEl).child('.backwards').on('click', function() {
            this.showYearInAnimationMode(this.minYear);
            this.animationSlider.setYear(this.minYear);
        }, this);
        Ext.get(this.contentEl).child('.forwards').on('click', function() {
            this.showYearInAnimationMode(this.maxYear);
            this.animationSlider.setYear(this.maxYear);
        }, this);

        var playDirectionHolder = Ext.get('playTab').child('.timeseriesWidget-controls-left');
        // Add handler to each radio element separately because otherwise IE fails to call the handlers
        var playDirectionRadioButtons = playDirectionHolder.query("input[type=radio]");
        for (var i = 0; i < playDirectionRadioButtons.length; i++) {
            Ext.get(playDirectionRadioButtons[i]).on('change', function(event, radio) {
                // Ext does only trigger change event for the radio that gets checked
                this.state.playDirection = radio.value;
                this.saveState();

                if (this.animationState) {
                    // Update offset of animation if already running
                    this.animationState.applyYear(this.animationSlider.getYear(), this.state.playDirection === "backwards", false);
                }
            }, this);
        }
        playDirectionHolder.child('input[value="' + this.state.playDirection + '"]').dom.checked = true;

        /**
         * Gets triggered when enough frames have been loaded to start animation
         */
        this.addEvents('preloadingDone');
        /**
         * Gets triggered repeatedly during preloading and contains a “ratio” property to state the progress
         */
        this.addEvents('preloadingProgress');

        // Update preload progress
        var preloadStatus = this.clearAndGetPreloadStatusIndicator();

        function updatePreloadStatus(e) {
            if (this.map.getZoom() < 6) {
                preloadStatus.setTextContent(OpenLayers.i18n("Your journey through time is being prepared. Thanks for your patience and enjoy the trip!") + " <br> " + Math.round(e.ratio * 100) + " % " + OpenLayers.i18n("done") + "<br>" + OpenLayers.i18n("We recommend to zoom in in order to better visualize the evolution of the maps."));
            } else {
                preloadStatus.setTextContent(OpenLayers.i18n("Your journey through time is being prepared. Thanks for your patience and enjoy the trip!") + " <br> " + Math.round(e.ratio * 100) + " % " + OpenLayers.i18n("done") + "<br>");
            }
        }

        this.on("preloadingProgress", updatePreloadStatus, this);
        this.map.events.register('zoomend', this, this.changeStatusText);

        // Abort animation and preload when shown extent changes (due to zoom or move)
        function handleExtentChanged() {
            this.stopAnimation();
            this.abortPreloading();
            this.discardInvisibleLayers();
            this.preloadingDone = false;
        }

        // Movend is trigger on pan and zoom of the map, thus there is not need to bind to zoomend as well
        this.map.events.register('moveend', this, handleExtentChanged);
        this.map.events.register('click', this, function(e) {
            if (e.which === 1 || button === 0) {
                // Stop animation and preloading on left click
                handleExtentChanged.apply(this);
            }
        });

        // Init status text
        this.changeStatusText(this.map.zoom);
    },

    /** api: method[getState]
     *  :return: ``Object`` Serializable widget state to be used by permalink provider
     */
    getState: function() {
        return {
            state: {
                // Written by handler on tab change
                activeTab: this.state.activeTab,
                animationSlider: this.animationSlider ? this.findTimestampNoLaterThan(this.animationSlider.getYear()) : this.state.animationSlider,
                compareSliderMin: this.compareSliderMin ? this.compareSliderMin.getYear() : this.state.compareSliderMin,
                compareSliderMax: this.compareSliderMax ? this.compareSliderMax.getYear() : this.state.compareSliderMax,
                // Written by handler on slider change
                compareTabOpacitySlider: this.state.compareTabOpacitySlider,
                fadeTime: this.state.fadeTime,
                // Written by handler on slider change
                playDirection: this.state.playDirection
            }
        };
    },

    /** private: method[changeStatusText]
     *  Change the text on the right according to the zoom level
     */
    changeStatusText: function(e) {
        var zoom = typeof e === "number" ? e : e.object.zoom;
        var statusText = document.querySelectorAll('div.text-status');
        var statusText_play = statusText[0];
        var statusText_comp = statusText[1];
        var updateText = function(text) {
            if (typeof(statusText_play.textContent) === "string") {
                statusText_play.textContent = text;
                statusText_comp.textContent = text;
            } else {
                // IE
                statusText_play.innerText = text;
                statusText_comp.innerText = text;
            }
        };
        switch (zoom) {
            case 6:
                updateText(OpenLayers.i18n("National Map") + " 1:100'000");
                break;
            case 7:
                updateText(OpenLayers.i18n("National Map") + " 1:50'000");
                break;
            case 8:
                updateText(OpenLayers.i18n("National Map") + " 1:25'000");
                break;
            default:
                updateText(OpenLayers.i18n("National Map Overview"));
                break;
        }
    },

    /** private: method[clearAndGetPreloadStatusIndicator]
     *  :return: ``HTMLDivElement`` Empty and invisible status indicator.
     */
    clearAndGetPreloadStatusIndicator: function() {
        var selectorResult = Ext.Element.select('.timeseriesWidget-preload-status');
        var preloadStatus;
        if (selectorResult.getCount() === 1) {
            preloadStatus = selectorResult.first();
        } else {
            preloadStatus = Ext.get(document.createElement("div"));
            preloadStatus.appendTo(Ext.get(this.contentEl).parent());
            preloadStatus.addClass('timeseriesWidget-preload-status');
        }

        /**
         * Displays a text in the lower right of the widget
         * @param {String} textContent Text to display
         */
        preloadStatus.setTextContent = function(textContent) {
            this.dom.innerHTML = textContent;
            this.setStyle({
                visibility: "visible"
            });
        };
        preloadStatus.setStyle({
            visibility: "hidden"
        });
        return preloadStatus;
    },

    /**
     * Retrieves layer matching timestamp as given in options. Adds the layer if not yet present.
     */
    addTimeseriesLayer: function(options) {
        var layer = this.getLayerForTimestamp(options.timestamp);
        if (layer === undefined) {
            return this.map.addLayerByName(this.layerName, options);
        } else if (options.hasOwnProperty("opacity")) {
            layer.setOpacity(options.opacity);
            return layer;
        }
    },

    /** private: method[playPause]
     *  Starts or stops the animation
     */
    playPause: function() {
        var timeseriesWidget = this;
        var playButtonImage = Ext.get(this.contentEl).child('.play').dom;

        var preloadStatus = this.clearAndGetPreloadStatusIndicator();

        if (this.animationIsPlaying) {
            // Pause animation
            window.clearInterval(this.animationTimer);
            this.animationTimer = null;
            //console.log("paused by click");
            playButtonImage.src = playButtonImage.src.replace(/pause\.png$/, "play.png");
            playButtonImage.title = OpenLayers.i18n("Play animation (Tooltip)");
            this.animationIsPlaying = false;
            this.abortPreloading();

            // AnimationState is not yet set after preload completes initially,
            // but do only act after preloading is fully complete to prevent moving
            // the animation slider when moving map during preload.
            if (this.animationState && this.preloadingDone) {
                // Show foreground layer only after animation stops
                var foregroundTimestamp = this.animationState.getStateRatio(timeseriesWidget.state.playDirection === "backwards").foreground;
                var layer = this.addTimeseriesLayer({
                    timestamp: foregroundTimestamp,
                    opacity: 1
                });
                GeoAdmin.TimeSeries.prototype.ArrayPrototypeForEach.call(timeseriesWidget.map.layers, function(l) {
                    if (l !== layer && this.isTimeSeriesLayer(l)) {
                        l.setOpacity(0);
                    }
                }, this);
                timeseriesWidget.animationSlider.setYear(parseInt(foregroundTimestamp.substring(0, 4), 10));
                timeseriesWidget.saveState();
            }
        } else {
            // Play / Resume
            if (timeseriesWidget.preloadingDone === false) {
                timeseriesWidget.preloadLayersInSequence();
                // Wait for preloading to finish
                timeseriesWidget.on("preloadingDone", function() {
                    preloadStatus.hide(true);
                    // Clean up timers
                    window.clearInterval(this.animationTimer);
                    this.animationTimer = null;
                    this.animationIsPlaying = false;
                    // Start a new animation
                    timeseriesWidget.playPause();
                });
            } else {
                // Try to start animation
                this.initAnimationState(function(animationState) {
                    timeseriesWidget.animationState = animationState;

                    // Play / Resume
                    timeseriesWidget.animationState.applyYear(timeseriesWidget.animationSlider.getYear(), timeseriesWidget.state.playDirection === "backwards", true);
                    timeseriesWidget.setAnimationTimer();
                });
            }
            playButtonImage.src = playButtonImage.src.replace(/play\.png$/, "pause.png");
            playButtonImage.title = OpenLayers.i18n("Pause animation (Tooltip)");

            timeseriesWidget.animationIsPlaying = true;
        }
    },
    
    /** api: method[getState]
     * Stops the animation. Does not to anything is case animation is not playing.
     */
    stopAnimation: function(){
        if (this.animationIsPlaying) {
            // Stop the animation
            this.playPause();
        }
    },

    /** private: method[setAnimationTimer]
     *  Queues a call to paint the next animation frame
     */
    setAnimationTimer: function() {
        var timeseriesWidget = this;
        if (this.animationTimer === null) {
            this.animationTimer = window.setInterval(function() {
                timeseriesWidget.repaintAnimation();
            }, 1000 / this.framesPerSecond);
        }
    },

    /** private: method[repaintAnimation]
     * :param timestamp: ``String`` Timestamp
     * :return: ``OpenLayers.Layer`` Layer that displays the given timestamp
     */
    getLayerForTimestamp: function(timestamp) {
        var timeseriesWidget = this;
        return GeoAdmin.TimeSeries.prototype.ArrayPrototypeFilter.call(timeseriesWidget.map.layers, function(layer) {
            return timeseriesWidget.isTimeSeriesLayer(layer) && layer.timestamp === timestamp;
        })[0];
    },

    /** private: method[repaintAnimation]
     *  Paints an animation frame.
     */
    repaintAnimation: function() {
        var timeseriesWidget = this;

        /**
         * Pauses the animation and loads the tiles for the given timestamp. Resumes animation once tiles are loaded.
         */
        function stallAnimationLoadLayer(timestamp) {
            // Load layer if not yet there and wait for it to complete loading
            var layer = timeseriesWidget.addTimeseriesLayer({
                timestamp: timestamp,
                opacity: 0
            });

            clearInterval(timeseriesWidget.animationTimer);
            timeseriesWidget.animationTimer = null;
            timeseriesWidget.animationState.pause();
            function resume() {
                layer.events.unregister('loadend', timeseriesWidget, resume);
                if (timeseriesWidget.animationIsPlaying) {
                    layer.setOpacity(0);
                    // Continue with animation, now that all tiles are loaded
                    // Correct animation state to account for the time spent waiting
                    timeseriesWidget.animationState.recordStart();

                    timeseriesWidget.setAnimationTimer();
                }
            }

            layer.events.register('loadend', timeseriesWidget, resume);
        }

        var state = this.animationState.getStateRatio(timeseriesWidget.state.playDirection === "backwards");
        var background = timeseriesWidget.getLayerForTimestamp(state.background);
        if (!background || background.loading) {
            stallAnimationLoadLayer(state.background);
            return;
        }
        var foreground = timeseriesWidget.getLayerForTimestamp(state.foreground);
        if (!foreground || foreground.loading) {
            stallAnimationLoadLayer(state.foreground);
            return;
        }

        // Hide no longer needed layers (DOM tree modifications are deferred until no animation is going on for speed reasons)
        GeoAdmin.TimeSeries.prototype.ArrayPrototypeForEach.call(timeseriesWidget.map.layers, function(layer) {
            if (layer !== foreground && layer !== background && layer.layername === timeseriesWidget.layerName) {
                layer.setOpacity(0);
            }
        });

        if (state.state === "fading") {
            // Fade foreground layer
            foreground.setOpacity(this.easing(state.ratio));
        } else {
            // Make foreground fully opaque since animation is now waiting for the next fade to be due
            foreground.setOpacity(1);
            /*
             * One could get rid of no longer needed layers.
             * Current OpenLayers versions mess up the layers' z-index when any layer is removed unless a base layer is set.
             */
            for (var layerIter = timeseriesWidget.map.layers.length - 1; layerIter >= 0; layerIter--) {
                var layer = timeseriesWidget.map.layers[layerIter];
                if (layer !== foreground && layer !== background && timeseriesWidget.isTimeSeriesLayer(layer)) {
                    timeseriesWidget.map.removeLayer(layer);
                }
            }
        }
        foreground.setZIndex(101);
        background.setOpacity(1);
        background.setZIndex(100);

        // Update slider but only when needed to keep reflows low
        var currentYear = state.year;
        if (this.lastAnimationYearCache !== currentYear) {
            this.animationSlider.setYear(currentYear);
            this.lastAnimationYearCache = currentYear;
            timeseriesWidget.saveState();
        }
    },

    /** private: method[findTimestampNoLaterThan]
     * :param year: ``Number`` Year for which to find data
     * :return: ``string`` Timestamp of latest data that is before or in given year
     */
    findTimestampNoLaterThan: function(year) {
        var candidate = null;
        for (var timestampIter = 0; timestampIter < this.timestamps.length; timestampIter++) {
            var parts = this.timestamps[timestampIter].match(/(\d{4})(\d{2})(\d{2})/);
            var current = new Date(parseInt(parts[1], 10), parseInt(parts[2], 10) - 1, parseInt(parts[3]));
            if (candidate === null || (candidate < current && current.getFullYear() <= year)) {
                candidate = current;
            }
        }
        return String(candidate.getFullYear()) + String(candidate.getMonth() + 1) + String(candidate.getDate());
    },

    /** private: method[getAnimationPeriods]
     * :param onCompletion: ``Function`` Called when available timestamps are known and receives list of timestamps that are to be shown in animation (``Array.<String>``). The list is ``undefined`` however if gathering the available timestamps failed.
     */
    getAnimationPeriods: function(onCompletion) {
        var timeseriesWidget = this;
        var mapCenter = timeseriesWidget.map.getCenter();

        // URI of service providing the animation timestamps
        var requestURI = GeoAdmin.webServicesUrl + "/zeitreihen?scale=" + encodeURIComponent(Math.round(timeseriesWidget.map.getScale())) + "&easting=" + encodeURIComponent(mapCenter.lon) + "&northing=" + encodeURIComponent(mapCenter.lat) + "&cb=geoAdminTimeSeriesGetAnimationPeriodsCallback";

        // See if a request is needed or if the result is already known
        if (timeseriesWidget.animationTimestampsCache.hasOwnProperty(requestURI)) {
            onCompletion(timeseriesWidget.animationTimestampsCache[requestURI]);
        } else {
            var documentHead = document.getElementsByTagName("head")[0];
            var jsonpRequester = document.createElement("script");
            jsonpRequester.type = "text/javascript";
            jsonpRequester.src = requestURI;
            window.geoAdminTimeSeriesGetAnimationPeriodsCallback = function geoAdminTimeSeriesGetAnimationPeriodsCallback(timestamps) {
                // Cache response of zeitreihen service
                timeseriesWidget.animationTimestampsCache = {};
                timeseriesWidget.animationTimestampsCache[requestURI] = timestamps;

                onCompletion(timestamps);
            };
            function discardRequester() {
                documentHead.removeChild(jsonpRequester);
                delete window.geoAdminTimeSeriesGetAnimationPeriodsCallback;
            }

            jsonpRequester.onload = discardRequester;
            jsonpRequester.onerror = function() {
                discardRequester();
                onCompletion();
            };
            documentHead.appendChild(jsonpRequester);
        }
    },

    /** private: method[initAnimationState]
     * Initializes object that manages states of animation
     * :param onCompletion: ``Function`` Called when available timestamps are known and receives animation state model. The model is ``null`` however if gathering the available timestamps failed.
     */
    initAnimationState: function(onCompletion) {
        var fadeTime = this.state.fadeTime ? this.state.fadeTime : this.fadeTime;
        var transitionTime = this.transitionTime;

        this.getAnimationPeriods(function(periods) {
            if (!(periods instanceof Array)) {
                // Report failure to get timestamps of animation
                onCompletion(null);
            } else {
                /*
                 * The state of the animation is derived purely from the time elapsed since animation start.
                 */
                onCompletion(new (function AnimationStates(fadeTime, transitionTime, periods) {
                    var periodsLength = periods.length;
                    var totalAnimationDuration = periodsLength * (transitionTime + fadeTime);

                    var start = new Date().getTime();
                    var pauseStart;
                    this.recordStart = function recordStart() {
                        if (pauseStart === undefined) {
                            start = new Date().getTime();
                        } else {
                            start = start + (new Date().getTime() - pauseStart);
                        }
                    };
                    this.pause = function() {
                        pauseStart = new Date().getTime();
                    };
                    function getTotalOffset() {
                        return new Date().getTime() - start;
                    }

                    /**
                     * @param {boolean} reverse Whether to get state for forwards or backwards playing animation
                     * @return {object}
                     */
                    this.getStateRatio = function getStateRatio(reverse) {
                        if (reverse !== true && reverse !== false) {
                            throw new Error("reverse must be a boolean");
                        }

                        var totalOffset = getTotalOffset();
                        var offset = totalOffset % totalAnimationDuration;
                        if (reverse) {
                            offset = totalAnimationDuration - offset;
                        }

                        var overlayOffset = offset % (fadeTime + transitionTime);
                        var ratio = 0;
                        if (overlayOffset <= transitionTime) {
                            state = "transitioning";
                            if (transitionTime !== 0) {
                                ratio = overlayOffset / transitionTime;
                            }
                        } else {
                            state = "fading";
                            ratio = (overlayOffset - transitionTime) / fadeTime;
                        }

                        var fgIndex = Math.floor(offset / (transitionTime + fadeTime));
                        if (state === "fading") {
                            fgIndex += 1;
                        }
                        var bgIndex = fgIndex - 1;
                        if (reverse && state === "fading") {
                            bgIndex += 1;
                            fgIndex -= 1;
                        }
                        var inEndToStart = false;
                        if (bgIndex >= periodsLength) {
                            bgIndex = 0;
                            inEndToStart = true;
                        }
                        if (fgIndex >= periodsLength) {
                            fgIndex = 0;
                            inEndToStart = true;
                        }

                        var background = periods[bgIndex];
                        var foreground = periods[fgIndex];
                        ratio = reverse ? 1 - ratio : ratio;
                        return {
                            // Timestamp of foreground layer such as 19891231
                            foreground: foreground,
                            // Timestamp of background layer
                            background: background,
                            // Either transitioning or fading
                            state: state,
                            // Progress between foreground and background layer (equals opacity of foreground in case of linear easing)
                            ratio: ratio,
                            // Interpolated year (interpolated in between the visualized timestamps being currently faded)
                            year: (state === "transitioning") ? this.yearFromTimestamp(foreground) : this.interpolateYears(background, foreground, ratio),
                            // indicate if we are between end and start
                            inEndToStart: inEndToStart
                        };
                    };

                    /**
                     * Adjust internally recorded time to match up with given year
                     * @param {Number} targetYear Year that is displayed / State to which to push animation
                     * @param {boolean} reverse
                     */
                    this.applyYear = function applyYear(targetYear, reverse, initialState) {
                        var offset = transitionTime;

                        // Adjust year so that it does not fall outwit animatable range
                        if (targetYear > this.yearFromTimestamp(periods[periods.length - 1])) {
                            targetYear = this.yearFromTimestamp(periods[periods.length - 1]);
                        } else if (targetYear < this.yearFromTimestamp(periods[0])) {
                                targetYear = this.yearFromTimestamp(periods[0]);
                        }
                        var inEndToStart = false;
                        if (initialState === false) {
                            inEndToStart  = this.getStateRatio(reverse?false:true).inEndToStart;
                        }
                        /**
                         * Caculate offset between requested year and year of background timestamp.
                         */
                        function backgroundYearOffset() {
                            var state = this.getStateRatio(reverse);
                            if (state.background === undefined) {
                                return 0;
                            } else {
                                var yearsDifference = Math.abs(this.yearFromTimestamp(state.foreground) - this.yearFromTimestamp(state.background));
                                var timePerYear = fadeTime / yearsDifference;
                                return timePerYear * Math.abs(this.yearFromTimestamp(state.background) - targetYear);
                            }
                        }

                        if (reverse === false) {
                            for (var i = 0; i < periods.length - 1; i++) {
                                var year = this.yearFromTimestamp(periods[i + 1]);
                                if (year < targetYear || inEndToStart) {
                                    offset = offset + fadeTime + transitionTime;
                                }
                            }
                            // Subtracting is to prevent hitting timestamps exactly which would result in ambiguity of fading/transitioning.
                            start = new Date().getTime() - offset - 5;
                            offset = offset + backgroundYearOffset.apply(this);
                        } else {
                            //taking into account fading between end and start in loop
                            offset = offset + fadeTime + transitionTime;
                            for (var i = periods.length - 1; i > 0; i--) {
                                var year = this.yearFromTimestamp(periods[i - 1]);
                                if (targetYear < year || inEndToStart) {
                                    offset = offset + fadeTime + transitionTime;
                                }
                            }
                            start = new Date().getTime() - offset - 5;
                            offset = offset + backgroundYearOffset.apply(this);
                        }
                        start = new Date().getTime() - offset;
                    };

                    this.interpolateYears = function(from, to, ratio) {
                        var fromYear = this.yearFromTimestamp(from);
                        var toYear = this.yearFromTimestamp(to);
                        return Math.round(fromYear + (toYear - fromYear) * ratio);
                    };
                    this.yearFromTimestamp = function(timestamp) {
                        return parseInt(timestamp.substring(0, 4), 10);
                    };
                })(fadeTime, transitionTime, periods));
            }
        });
    },

    /** private: method[getInitialAnimationYear]
     * :return: ``Number`` Default year of animation slider
     */
    getInitialAnimationYear: function() {
        if (this.state.animationSlider) {
            return this.state.animationSlider;
        }
        return 1938;
        //return Math.floor((this.minYear+this.maxYear)/2);
    },

    /** private: method[isTimeSeriesLayer]
     * Checks if a layer is an animation key frame (consists of animation tiles)
     * :return: ``Boolean`` True if layer is a key frame
     */
    isTimeSeriesLayer: function(layer) {
        return layer.name === this.layerName || layer.layername === this.layerName;
    },

    /** private: method[discardInvisibleLayers]
     * Removes unused invisible layers from the map where invisible means either the
     * visibility flag is false or a layer is fully transparent.
     */
    discardInvisibleLayers: function() {
        var compareMin;
        var compareMax;
        if(this.getState().state.activeTab==="compareTab"){
            compareMin = this.getLayerForTimestamp(this.findTimestampNoLaterThan(this.compareSliderMin.getYear()));
            compareMax = this.getLayerForTimestamp(this.findTimestampNoLaterThan(this.compareSliderMax.getYear()));
        }
        GeoAdmin.TimeSeries.prototype.ArrayPrototypeForEach.call(this.map.layers.slice(0), function(layer) {
            if ((layer.opacity === 0 || layer.getVisibility() === false) && this.isTimeSeriesLayer(layer) && layer!==compareMin && layer!==compareMax) {
                this.map.removeLayer(layer);
            }
        }, this);
    },

    /** private: method[preloadLayersInSequence]
     * Sequentially loads upcoming animation layers. The layers are loading in
     * the order in which they appear in the animation such that the next layer
     * is attempted to load after the currently loading layer completed to load.
     * Whether a layer has yet been shown to the user is considered unimportant
     * by the preloading.
     */
    preloadLayersInSequence: function() {
        var timeseriesWidget = this;

        // Preload upcoming frames one after the other
        timeseriesWidget.getAnimationPeriods(function(animationPeriods) {
            var timestamp;
            var year = timeseriesWidget.animationSlider.getYear();
            if (!(animationPeriods instanceof Array)) {
                // Failed to get periods from server, don't proceed with preloading
                return;
            }
            GeoAdmin.TimeSeries.prototype.ArrayPrototypeForEach.call(animationPeriods, function(ts) {
                if (parseInt(ts.substring(0, 4), 10) <= year) {
                    timestamp = ts;
                }
            });

            // Create a clone of the list and sort it so that it contains the timestamps in ascending upcoming order
            animationPeriods = animationPeriods.slice(0).sort();
            for (var i = 0; i < animationPeriods.length; i++) {
                if (parseInt(animationPeriods[i], 10) >= parseInt(timestamp, 10)) {
                    break;
                }
            }
            var beforeTimestamp = animationPeriods.splice(0, i);
            while (beforeTimestamp.length > 0) {
                animationPeriods.push(beforeTimestamp.shift());
            }
            if (timeseriesWidget.state.playDirection === "backwards") {
                animationPeriods.reverse();
            }

            var timestampShown = timeseriesWidget.findTimestampNoLaterThan(year);
            var shownLayer = GeoAdmin.TimeSeries.prototype.ArrayPrototypeFilter.call(timeseriesWidget.map.layers,
                function(layer) {
                    return timeseriesWidget.isTimeSeriesLayer(layer) && (layer.opacity > 0 && layer.getVisibility());// && layer.timestamp===timestampShown;
                }).pop();
            timeseriesWidget.fireEvent("preloadingProgress", {
                ratio: 0
            });
            if (shownLayer.loading) {
                // Preload once currently shown layer is loaded
                shownLayer.events.register("loadend", timeseriesWidget, function() {
                    var indexOfShown = animationPeriods.indexOf(timestamp);
                    var lowPrio = animationPeriods.splice(0, indexOfShown);
                    GeoAdmin.TimeSeries.prototype.ArrayPrototypeForEach.call(lowPrio, function(preloadTimestamp) {
                        animationPeriods.push(preloadTimestamp);
                    });
                    //console.log("animationPeriods: "+animationPeriods);
                    delayedPreload(1);
                });
            } else {
                // Preload immediately because currently shown layer is already loaded
                delayedPreload(1);
            }
            /**
             * Loads tiles for key frame with given index. Triggers loading of
             * next key frame when requested frame is fully loaded.
             */
            function delayedPreload(timestampIndex) {
                if (timestampIndex < animationPeriods.length) {
                    var preloadTimestamp = animationPeriods[timestampIndex];
                    //console.log(timestampIndex+". Preloading "+preloadTimestamp);
                    var layer = timeseriesWidget.addTimeseriesLayer({
                        timestamp: preloadTimestamp,
                        opacity: 0
                    });

                    function markLayerPreloadDone() {
                        layer.events.unregister("loadend", timeseriesWidget, layerPreloaded);
                        timeseriesWidget.abortPreloading = function() {
                        };
                    }

                    function layerPreloaded() {
                        markLayerPreloadDone();
                        timeseriesWidget.fireEvent("preloadingProgress", {
                            ratio: timestampIndex / animationPeriods.length
                        });
                        delayedPreload(timestampIndex + 1);
                    }

                    if (layer.tileQueue.length > 0) {
                        layer.events.register("loadend", timeseriesWidget, layerPreloaded);
                        timeseriesWidget.abortPreloading = markLayerPreloadDone;
                    } else {
                        timeseriesWidget.fireEvent("preloadingProgress", {
                            ratio: timestampIndex / animationPeriods.length
                        });
                        delayedPreload(timestampIndex + 1);
                    }
                } else if (timeseriesWidget.preloadingDone === false) {
                    // Trigger preloadingDone when all frames are loaded
                    timeseriesWidget.preloadingDone = true;
                    timeseriesWidget.fireEvent("preloadingProgress", {
                        ratio: 1
                    });
                    timeseriesWidget.fireEvent("preloadingDone");
                }
            }
        });
    },

    /**
     * Aborts sequential preloading
     */
    abortPreloading: function() {
        // Reference to function is overridden during preloading with reference to appropriate implementation
    },

    /**
     * Stops animation and shows only given year
     */
    showYearInAnimationMode: function(year) {
        var timeseriesWidget = this;
        timeseriesWidget.stopAnimation();
        var timestamp = timeseriesWidget.findTimestampNoLaterThan(year);
        timeseriesWidget.addLayers([timestamp], []);
        timeseriesWidget.getLayerForTimestamp(timestamp).setOpacity(1);
    },

    /** private: method[initTabs]
     * Instantiates tabs, periods within and assigns handlers to elements in tabs
     */
    initTabs: function() {
        var compareTabOpacitySlider = new GeoExt.LayerOpacitySlider({
            renderTo: 'compareTabOpacitySlider',
            width:120,
            aggressive: true,
            value: this.state.compareTabOpacitySlider,
            animate: false
        });
        compareTabOpacitySlider.on('changecomplete', function(event, value) {
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
            items: [
                {
                    title: OpenLayers.i18n('Play'),
                    contentEl: "playTab"
                },
                {
                    title: OpenLayers.i18n('Compare 2 timestamps'),
                    contentEl: "compareTab"
                },
                {
                    title: OpenLayers.i18n('Information about shown maps'),
                    contentEl: "informationTab"
                }
            ]
        });
        var sliderImagePath = this.geoAdminRoot + "TimeSeries/img/";
        var timeseriesWidget = this;

        /**
         * Creates sliders when a tab is first shown
         */
        function initializeSliders(tabs, newlyActiveTab) {
            // Moving sliders does only affect map after a delay because otherwise the DOM would need to be restructured a lot and pointless requests would be initiated
            var sliderChangeDelay = 500;

            function changeAnimationSlider() {
                var year = timeseriesWidget.animationSlider.getYear();
                timeseriesWidget.stopAnimation();
                if (animationSliderPending) {
                    clearTimeout(animationSliderPending);
                }
                animationSliderPending = setTimeout(function() {
                    timeseriesWidget.showYearInAnimationMode(year);
                }, sliderChangeDelay);

                timeseriesWidget.saveState();
            }

            var ignoreYearChange = false;

            function changeAnyCompareSlider() {
                if (ignoreYearChange) {
                    // Ignore changes from adjusting years programmatically
                    return;
                }
                if (compareSliderPending) {
                    clearTimeout(compareSliderPending);
                }

                // Move other slider along (allows pushing a slider by moving the other against it)
                var movedSlider = this;
                var compareSliderMaxYear = timeseriesWidget.compareSliderMax.getYear();
                if (compareSliderMaxYear <= timeseriesWidget.minYear) {
                    timeseriesWidget.compareSliderMax.setYear(timeseriesWidget.minYear + 1);
                    return;
                }
                var compareSliderMinYear = timeseriesWidget.compareSliderMin.getYear();
                if (compareSliderMinYear >= timeseriesWidget.maxYear) {
                    timeseriesWidget.compareSliderMin.setYear(timeseriesWidget.maxYear - 1);
                    return;
                }
                ignoreYearChange = true;
                if (movedSlider === timeseriesWidget.compareSliderMax && compareSliderMinYear >= compareSliderMaxYear) {
                    timeseriesWidget.compareSliderMin.setYear(Math.max(compareSliderMaxYear - 1, timeseriesWidget.minYear));
                }
                if (movedSlider === timeseriesWidget.compareSliderMin && compareSliderMaxYear <= compareSliderMinYear) {
                    timeseriesWidget.compareSliderMax.setYear(Math.min(compareSliderMinYear + 1, timeseriesWidget.maxYear));
                }
                ignoreYearChange = false;

                compareSliderPending = setTimeout(function() {
                    var maxTimestamp = timeseriesWidget.findTimestampNoLaterThan(timeseriesWidget.compareSliderMax.getYear());
                    var minTimestamp = timeseriesWidget.findTimestampNoLaterThan(timeseriesWidget.compareSliderMin.getYear());
                    // Save slider value because it gets changed by replacing layers
                    var originalSliderValue = compareTabOpacitySlider.getValue();
                    timeseriesWidget.addLayers([
                        minTimestamp,
                        maxTimestamp
                    ], []);
                    var minLayer = timeseriesWidget.getLayerForTimestamp(minTimestamp);
                    minLayer.setZIndex(100);
                    minLayer.setOpacity(1);
                    var maxLayer = timeseriesWidget.getLayerForTimestamp(maxTimestamp);
                    maxLayer.setZIndex(101);
                    maxLayer.setOpacity(originalSliderValue / 100);
                    compareTabOpacitySlider.setLayer(maxLayer);
                }, sliderChangeDelay);

                timeseriesWidget.saveState();
            }

            // Create sliders initially
            if (newlyActiveTab.contentEl === "playTab" && playPeriod.sliders.length === 0) {
                var animationSliderPending;
                var compareSliderPending;
                timeseriesWidget.animationSlider = playPeriod.addSlider(sliderImagePath + "slider-middle.png", 37);
                timeseriesWidget.animationSlider.on('userdrag', changeAnimationSlider);
                timeseriesWidget.animationSlider.setYear(timeseriesWidget.getInitialAnimationYear());
                timeseriesWidget.animationSlider.on('yeartyped', changeAnimationSlider);
            }
            if (newlyActiveTab.contentEl === "compareTab" && comparePeriod.sliders.length === 0) {
                // In case animation slider is present and compare range is undefined, guess
                if (playPeriod.sliders.length === 1 && (timeseriesWidget.state.compareSliderMin === null || timeseriesWidget.state.compareSliderMax === null)) {
                    var year = timeseriesWidget.animationSlider.getYear();
                    // Guess suitable slider positions so that displayed range is maximal and one slider position equals the animation slider's position
                    if (Math.abs(timeseriesWidget.minYear - timeseriesWidget.animationSlider.getYear()) > Math.abs(timeseriesWidget.maxYear - year)) {
                        timeseriesWidget.state.compareSliderMin = timeseriesWidget.minYear;
                        timeseriesWidget.state.compareSliderMax = year;
                    } else {
                        timeseriesWidget.state.compareSliderMin = year;
                        timeseriesWidget.state.compareSliderMax = timeseriesWidget.maxYear;
                    }
                }

                timeseriesWidget.compareSliderMax = comparePeriod.addSlider(sliderImagePath + "slider-right.png", 6);
                timeseriesWidget.compareSliderMax.setYear(timeseriesWidget.state.compareSliderMax || timeseriesWidget.maxYear);
                timeseriesWidget.compareSliderMin = comparePeriod.addSlider(sliderImagePath + "slider-left.png", 69);
                timeseriesWidget.compareSliderMin.setYear(timeseriesWidget.state.compareSliderMin || timeseriesWidget.minYear);
                timeseriesWidget.compareSliderMin.on('change', changeAnyCompareSlider, timeseriesWidget.compareSliderMin);
                timeseriesWidget.compareSliderMax.on('change', changeAnyCompareSlider, timeseriesWidget.compareSliderMax);
            }
            if(newlyActiveTab.contentEl === "informationTab" && playPeriod.sliders.length === 0 && comparePeriod.sliders.length === 0) {
                timeseriesWidget.showYearInAnimationMode(timeseriesWidget.state.animationSlider);
            }

            // Restore old view on tab change
            if (newlyActiveTab.contentEl === "playTab") {
                changeAnimationSlider();
            }
            if (newlyActiveTab.contentEl === "compareTab") {
                timeseriesWidget.stopAnimation();
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
    addLayers: function(timestampsToAdd, timestampsToKeep) {
        var timeseriesWidget = this;
        var pendingForDiscard = [];
        var firstAddedLayer;
        // Add layers
        for (var i = 0; i < timestampsToAdd.length; i++) {
            var addedLayer = this.addTimeseriesLayer({
                timestamp: timestampsToAdd[i],
                opacity: 1
            });
            if (firstAddedLayer === undefined) {
                firstAddedLayer = addedLayer;
            }
            timestampsToKeep.push(timestampsToAdd[i]);
        }
        // Mark others for removal
        for (var i = timeseriesWidget.map.layers.length - 1; i >= 0; i--) {
            if (timestampsToKeep.indexOf(timeseriesWidget.map.layers[i].timestamp) === -1) {
                pendingForDiscard.push(timeseriesWidget.map.layers[i]);
            }
        }

        function discard() {
            if (firstAddedLayer) {
                firstAddedLayer.events.unregister('loadend', this, discard);
            }
            GeoAdmin.TimeSeries.prototype.ArrayPrototypeForEach.call(pendingForDiscard, function(layer) {
                if (!(layer instanceof OpenLayers.Layer.Vector) && timeseriesWidget.map.layers.indexOf(layer) >= 0 && layer.layername !== "voidLayer") {
                    timeseriesWidget.map.removeLayer(layer);
                }
            });
        }

        // Remove no longer needed layers as soon as new data is loaded
        if (firstAddedLayer && firstAddedLayer.loading) {
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
    easing: function (p) {
        // Easing based on EaseInOutSine of https://github.com/jquery/jquery-ui/blob/1-8-stable/ui/jquery.effects.core.js#L607
        if (p < 0.5) {
            return (1 - Math.cos(p * Math.PI)) / 2;
        } else {
            return (1 - Math.cos((p * -2 + 2) * Math.PI / 2)) / -2 + 1;
        }
    },
    
    ArrayPrototypeForEach: Array.prototype.forEach || function forEach( callback, thisArg ) {
        var T, k;
    
        if ( this == null ) {
        throw new TypeError( "this is null or not defined" );
        }
    
        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);
    
        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32
    
        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if ( {}.toString.call(callback) !== "[object Function]" ) {
        throw new TypeError( callback + " is not a function" );
        }
    
        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if ( thisArg ) {
        T = thisArg;
        }
    
        // 6. Let k be 0
        k = 0;
    
        // 7. Repeat, while k < len
        while( k < len ) {
    
        var kValue;
    
        // a. Let Pk be ToString(k).
        //   This is implicit for LHS operands of the in operator
        // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
        //   This step can be combined with c
        // c. If kPresent is true, then
        if ( Object.prototype.hasOwnProperty.call(O, k) ) {
    
            // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
            kValue = O[ k ];
    
            // ii. Call the Call internal method of callback with T as the this value and
            // argument list containing kValue, k, and O.
            callback.call( T, kValue, k, O );
        }
        // d. Increase k by 1.
        k++;
        }
        // 8. return undefined
    },
    ArrayPrototypeFilter: Array.prototype.filter || function(fun /*, thisp */) {
        "use strict";
    
        if (this == null)
        throw new TypeError();
    
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun != "function")
        throw new TypeError();
    
        var res = [];
        var thisp = arguments[1];
        for (var i = 0; i < len; i++)
        {
        if (i in t)
        {
            var val = t[i]; // in case fun mutates this
            if (fun.call(thisp, val, i, t))
            res.push(val);
        }
        }
    
        return res;
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
    isMinorPeriod: function(year) {
        return year % 10 === 0;
    },
    /**
     * :param year: ``Number`` Year to check for needing a mark on the axis along with a label
     * :return: ``boolean`` True if year needs marking
     */
    isMajorPeriod: function(year) {
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

    initComponent: function() {
        GeoAdmin.TimeSeries.PeriodDisplay.superclass.initComponent.call(this);

        this.wholePeriod = document.createElement('div');
        this.wholePeriod.className = 'period';
        // Paint years
        for (var year = this.minYear; year <= this.maxYear; year++) {
            var periodYearElement = document.createElement('div');
            if (this.isMinorPeriod(year)) {
                // Mark year on period but without label
                periodYearElement.className = "marked";
            }
            if (year === this.minYear || year === this.maxYear || this.isMajorPeriod(year)) {
                // Show year label
                periodYearElement.title = year;
            }
            if (year === this.maxYear) {
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
    addSlider: function(imageSrc, xOffset) {
        var slider = new GeoAdmin.TimeSeries.YearSlider({
            imageSrc: imageSrc,
            xOffset: xOffset,
            renderTo: this.contentEl
        });

        var startX;
        slider.tracker.onStart = function() {
            startX = slider.getYearIndicatorX();
        };
        var firstYearElement = Ext.get(this.wholePeriod.firstChild);
        var lastYearElement = Ext.get(this.wholePeriod.lastChild);
        var timeseriesWidget = this;
        slider.addEvents("userdrag");
        slider.tracker.onDrag = function() {
            var newX = startX + (-this.getOffset()[0]);
            newX = Math.max(firstYearElement.getX(), newX);
            newX = Math.min(lastYearElement.getX(), newX);
            slider.setYearIndicatorX(newX);
            slider.fireEvent("userdrag");
        };

        // Extend slider API (methods that depend on elements of the painted period)
        var minYear = this.minYear;
        slider.getYear = function() {
            if (firstYearElement.dom.offsetWidth === 0) {
                // Assume slider is invisible as its tab is not shown. Do not use Ext's isVisible because it is buggier.
                // Return cached value
                return slider.input.getValue();
            }
            return Math.round((this.getYearIndicatorX() - firstYearElement.getX()) / firstYearElement.getWidth() + minYear);
        };
        slider.setYear = function(year) {
            this.setYearIndicatorX((year - minYear) * firstYearElement.getWidth() + firstYearElement.getX());
        };
        slider.setYear(minYear + (this.maxYear - minYear) / 2);

        // Raise yeartyped event whenever the user enters a valid year
        slider.addEvents('yeartyped');
        function changeHandler() {
            var yearRaw = slider.input.getValue();
            var year = parseInt(yearRaw, 10);
            if (yearRaw === String(year)) {
                year = Math.min(year, timeseriesWidget.maxYear);
                year = Math.max(year, timeseriesWidget.minYear);
                slider.setYear(year);
                slider.fireEvent("yeartyped", year);
            } else {
                slider.input.addClass("x-form-invalid");
            }
        }

        slider.input.on('change', changeHandler, timeseriesWidget);
        if (slider.input.dom.attachEvent) {
            slider.input.dom.attachEvent('onkeyup', function(e) {
                if (event.keyCode === 13) {
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

    initComponent: function() {
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
    getYearIndicatorX: function() {
        return this.slider.getX() + this.xOffset;
    },
    /** api: method[setYearIndicatorX]
     * :param x: ``Number`` Offset of slider image (horizontal position)
     *
     * Moves the slider and updates the displayed year
     */
    setYearIndicatorX: function(x) {
        this.slider.setX(x - this.xOffset);
        var year = this.getYear();
        this.input.dom.value = year;
        this.input.removeClass("x-form-invalid");
        this.fireEvent('change', year);
    }
});
