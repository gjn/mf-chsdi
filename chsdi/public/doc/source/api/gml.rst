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

GML
---

Display a remote GML file with custom symbols. In this example, some triangulation point data from http://wfs.geo.admin.ch/. 

.. raw:: html

   <body>
      <div id="mymap14" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef14" href="javascript:showdiv('codeBlock14','showRef14','hideRef14')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef14" href="javascript:hidediv('codeBlock14','showRef14','hideRef14')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock14" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
       function init() {
           
           OpenLayers.ProxyHost = "/ogcproxy?url=";
           var api14 = new GeoAdmin.API();
           api14.createMap({
               div: "mymap14",
               easting: 530000,
               northing: 199000,
               zoom: 1
           });         
           var gml = new OpenLayers.Layer.Vector("GML", {
                    strategies: [new OpenLayers.Strategy.Fixed()],
                    protocol: new OpenLayers.Protocol.HTTP({
                        url: "http://wfs.geo.admin.ch/",
                        params: {
                            service: 'WFS',
                            version: '1.0.0',
                            request: 'GetFeature',
                            typename: 'ch.swisstopo.fixpunkte-lage-lfp1',
                            outputformat: 'GML2'
                        },
                        format: new OpenLayers.Format.GML()
                    }),
                    styleMap: new OpenLayers.StyleMap({
                        strokeColor: "#0066cc",
                        fillColor: "#3399ff", 
                        pointRadius: 4
                    })  
            });

           api14.map.addLayer(gml);
       }
   </script>
   <body onload="init();">
       <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>    

.. raw:: html

    </div>

.. raw:: html


   <script type="text/javascript">
      
       function init() {
           
           OpenLayers.ProxyHost = "/ogcproxy?url=";
           var api14 = new GeoAdmin.API();
           api14.createMap({
               div: "mymap14",
               easting: 530000,
               northing: 199000,
               zoom: 1
           });
         var gml = new OpenLayers.Layer.Vector("GML", {
                    strategies: [new OpenLayers.Strategy.Fixed()],
                    protocol: new OpenLayers.Protocol.HTTP({
                        url: "http://wfs.geo.admin.ch/",
                        params: {
                            service: 'WFS',
                            version: '1.0.0',
                            request: 'GetFeature',
                            typename: 'ch.swisstopo.fixpunkte-lage-lfp1',
                            outputformat: 'GML2'
                        },
                        format: new OpenLayers.Format.GML()
                    }),
                    styleMap: new OpenLayers.StyleMap({
                        strokeColor: "#0066cc",
                        fillColor: "#3399ff", 
                        pointRadius: 4
                    })  
            });
           api14.map.addLayer(gml);
       }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>
