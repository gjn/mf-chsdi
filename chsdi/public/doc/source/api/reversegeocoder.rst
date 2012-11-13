.. raw:: html

   <script language=javascript type='text/javascript'>

   function hidediv(div, showDiv, hideDiv) {
      document.getElementById(div).style.visibility = 'hidden';
      document.getElementById(div).style.display = 'none';
      document.getElementById(hideDiv).style.visibility = 'hidden';
      document.getElementById(hideDiv).style.display = 'none';
      document.getElementById(showDiv).style.visibility = 'visible';
      document.getElementById(showDiv).style.display = 'block';
   }

   function showdiv(div, showDiv, hideDiv) {
      document.getElementById(div).style.visibility = 'visible';
      document.getElementById(div).style.display = 'block';
      document.getElementById(showDiv).style.visibility = 'hidden';
      document.getElementById(showDiv).style.display = 'none';
      document.getElementById(hideDiv).style.visibility = 'visible';
      document.getElementById(hideDiv).style.display = 'block';
   }
   </script>

Reverse geocoder: identify parcel
---------------------------------

Click in the map and identfy parcels. This demonstration uses the SwissSearch Reverse Geocoding service (`Documentation <//api.geo.admin.ch/main/wsgi/doc/build/services/sdiservices.html#swisssearch-reversegeocoding>`_)

.. raw:: html

   <style>
      .gx-popup {
          width 250px;
          max-width: 250px;
      }
      .gx-popup .x-window-body {
          height: expression( this.scrollHeight > 279 ? "280px" : "auto" ) !important;
          max-height: 280px !important;
          overflow:hidden;
          overflow-y:auto;
          width: 250px;
          margin: 5px;
      }
   </style>

  <body>
     <div id="mymap" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <div id="mysearch" style="width:300px;height:30px;margin:10px;"></div>
  </body>

.. raw:: html

    <a id="showRef2" href="javascript:showdiv('codeBlock2','showRef2','hideRef2')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef2" href="javascript:hidediv('codeBlock2','showRef2','hideRef2')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock2" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">

        function init() {
            OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
                defaultHandlerOptions: {
                    'single': true,
                    'double': false,
                    'pixelTolerance': 0,
                    'stopSingle': false,
                    'stopDouble': false
                },

                initialize: function(options) {
                    this.handlerOptions = OpenLayers.Util.extend(
                            {}, this.defaultHandlerOptions
                    );
                    OpenLayers.Control.prototype.initialize.apply(
                            this, arguments
                    );
                    this.handler = new OpenLayers.Handler.Click(
                            this, {
                                'click': this.trigger
                            }, this.handlerOptions
                    );
                },

                trigger: function(e) {
                    if (popup) {
                        popup.destroy();
                        popup = null;
                    }
                    var lonlat = api.map.getLonLatFromViewPortPx(e.xy);
                    var scriptProtocol = new OpenLayers.Protocol.Script({
                        url: url,
                        params: {
                            services: 'parcel',
                            tolerance: 50,
                            easting: lonlat.lon,
                            northing: lonlat.lat
                        },
                        handleResponse: function(response) {
                            var message,lon,lat;
                            if (response.data.length == 0) {
                                message = "No parcel found. Sorry";
                                lon = lonlat.lon;
                                lat = lonlat.lat;
                            } else {
                                // Find the nearest
                                var shortestDist = 1000;
                                var nearestFeature;
                                for (var i = 0; i < response.data.length; i++) {
                                    var feature = response.data[i];
                                    var dist = Math.sqrt(Math.pow((lonlat.lon - feature.Y), 2) + Math.pow((lonlat.lat - feature.X), 2));
                                    if (shortestDist > dist) {
                                        shortestDist = dist;
                                        nearestFeature = feature;
                                    }
                                }
                                lon = nearestFeature.Y;
                                lat = nearestFeature.X;
                                message = "Parcel " + nearestFeature.name + " in " + nearestFeature.city;
                            }
                            popup = api.showPopup({
                                easting: lon,
                                northing: lat,
                                recenter: "true",
                                html: message
                            });
                        },
                        callbackKey: 'cb',
                        format: new OpenLayers.Format.JSON({
                            nativeJSON: false
                        }),
                        scope: this
                    });
                    scriptProtocol.read();
                }
            });

            if (GeoAdmin.webServicesUrl != null) {
                var url = GeoAdmin.webServicesUrl + "/swisssearch/reversegeocoding";
            }

            var popup;
            var api = new GeoAdmin.API();
            api.createMap({
                div: "mymap",
                layers: 'ch.kantone.cadastralwebmap-farbe',
                easting:561289,
                northing: 185241,
                zoom: 11
            });
            api.createSwissSearchCombo({
                width: 500,
                renderTo: "mysearch"
            });
            var click = new OpenLayers.Control.Click();
            api.map.addControl(click);
            click.activate();
        }
   </script>

   <body onload="init();">
     <div id="mymap" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <div id="mysearch" style="width:300px;height:30px;margin:10px;"></div>
     <script type="text/javascript" src="https://api.geo.admin.ch/loader.js?mode=full"></script>
   </body>

.. raw:: html

    </div>

.. raw:: html

   <script type="text/javascript">

        function init() {
            OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
                defaultHandlerOptions: {
                    'single': true,
                    'double': false,
                    'pixelTolerance': 0,
                    'stopSingle': false,
                    'stopDouble': false
                },

                initialize: function(options) {
                    this.handlerOptions = OpenLayers.Util.extend(
                            {}, this.defaultHandlerOptions
                    );
                    OpenLayers.Control.prototype.initialize.apply(
                            this, arguments
                    );
                    this.handler = new OpenLayers.Handler.Click(
                            this, {
                                'click': this.trigger
                            }, this.handlerOptions
                    );
                },

                trigger: function(e) {
                    if (popup) {
                        popup.destroy();
                        popup = null;
                    }
                    var lonlat = api.map.getLonLatFromViewPortPx(e.xy);
                    var scriptProtocol = new OpenLayers.Protocol.Script({
                        url: url,
                        params: {
                            services: 'parcel',
                            tolerance: 50,
                            easting: lonlat.lon,
                            northing: lonlat.lat
                        },
                        handleResponse: function(response) {
                            var message,lon,lat;
                            if (response.data.length == 0) {
                                message = "No parcel found. Sorry";
                                lon = lonlat.lon;
                                lat = lonlat.lat;
                            } else {
                                // Find the nearest
                                var shortestDist = 1000;
                                var nearestFeature;
                                for (var i = 0; i < response.data.length; i++) {
                                    var feature = response.data[i];
                                    var dist = Math.sqrt(Math.pow((lonlat.lon - feature.Y), 2) + Math.pow((lonlat.lat - feature.X), 2));
                                    if (shortestDist > dist) {
                                        shortestDist = dist;
                                        nearestFeature = feature;
                                    }
                                }
                                lon = nearestFeature.Y;
                                lat = nearestFeature.X;
                                message = "Parcel " + nearestFeature.name + " in " + nearestFeature.city;
                            }
                            popup = api.showPopup({
                                easting: lon,
                                northing: lat,
                                recenter: "true",
                                html: message
                            });
                        },
                        callbackKey: 'cb',
                        format: new OpenLayers.Format.JSON({
                            nativeJSON: false
                        }),
                        scope: this
                    });
                    scriptProtocol.read();
                }
            });

            if (GeoAdmin.webServicesUrl != null) {
                var url = GeoAdmin.webServicesUrl + "/swisssearch/reversegeocoding";
            }

            var popup;
            var api = new GeoAdmin.API();
            api.createMap({
                div: "mymap",
                layers: 'ch.kantone.cadastralwebmap-farbe',
                easting:561289,
                northing: 185241,
                zoom: 11
            });
            api.createSwissSearchCombo({
                width: 500,
                renderTo: "mysearch"
            });
            var click = new OpenLayers.Control.Click();
            api.map.addControl(click);
            click.activate();
        }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js?mode=full"></script>
   </body>
