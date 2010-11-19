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

StreetView
----------

 Showing the swiss maps and Google StreetView side-by-side. You need to load the `StreetViewPanel <http://svn.geoext.org/sandbox/cmoullet/ux/StreetViewPanel/>`_ GeoExt Ux for this example. In order to use the Google services, please read carefully their terms of use.

.. raw:: html

  <body>
     <div id="mypanel21" style="width:500px;height:500px;margin: 10px; !important;"></div>
  </body>


.. raw:: html

    <a id="showRef20" href="javascript:showdiv('codeBlock20','showRef20','hideRef20')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef20" href="javascript:hidediv('codeBlock20','showRef20','hideRef20')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock20" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
        var mapPanel;
        
        var streetViewPanel;
        
        var mainPanel;
        
        function init() {
            var geo = new geoadmin.API();
            var map = geo.createMap({
                easting: 600000,
                northing: 200000,
                zoom: 16
            });
        
            var extent = new OpenLayers.Bounds(600000, 199500, 600500, 200000);
        
            var positionPano = new OpenLayers.LonLat(600410, 199577);
            positionPano.transform(map.projection, new OpenLayers.Projection("EPSG:4326"));
            var featurePosition = new GLatLng(positionPano.lat, positionPano.lon);
        
            var streetViewPanelItem = {
                xtype: 'gxux_streetviewpanel',
                id: 'streetViewPanelItem',
                map: map,
                videoMode: true,
                showLinks: true,
                showTool: true,
                panoramaLocation: featurePosition
            };
        
            var mainPanel = new Ext.Panel({
                title: 'StreetView Demo',
                //closable:true,
                width: 700,
                height: 500,
                border: false,
                margins: '0 0 0 0',
                //plain:true,
                split: true,
                layout: 'border',
                id: 'mainpanel',
                renderTo: 'mypanel21',
        
        
                items: [{
                    region: "center",
                    id: "mappanel",
                    title: "GeoAdmin API",
                    xtype: "gx_mappanel",
                    map: map,
                    extent: extent,
                    split: true
                },
                {
                    region: "east",
                    layout: 'fit',
                    width: '50%',
                    id: "streetviewpanel",
                    title: 'Street View Panel',
                    closeAction: 'hide',
                    split: true
                }
        
                ]
            });
        
            mapPanel = Ext.getCmp("mappanel");
            streetViewPanel = Ext.getCmp("streetviewpanel");
            streetViewPanel.add(streetViewPanelItem);
            streetViewPanel.doLayout();
        
            mainPanel.show();
        };
        
 
   </script> 
   <body onload="init();">
     <div id="mypanel21" style="width:500px;height:500px;margin: 10px; !important;"></div>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
     <!-- Use your own key please -->
     <script src="http://maps.google.com/maps?file=api&amp;v=2&amp;sensor=false&amp;key=ABQIAAAAzQ-mOk5vsRF_OLoN-mOVjhSHRXVQO97xZDVElO7Kaxb3_E7dkBRAys4lZqDtTngdp3fHGDiZ-9QpCw" type="text/javascript"></script>

     <script type="text/javascript"
            src="http://svn.geoext.org/sandbox/cmoullet/ux/StreetViewPanel/ux/widgets/StreetViewPanel.js"></script>
     <script type="text/javascript"
            src="http://svn.geoext.org/sandbox/cmoullet/ux/StreetViewPanel/ux/control/StreetViewClick.js"></script>
   </body>    

.. raw:: html

         <div id="mypanel21"></div>
.. raw:: html


   <script type="text/javascript">

        
        var mapPanel;
        
        var streetViewPanel;
        
        var mainPanel;
        
        function init() {
            var geo = new geoadmin.API();
            var map = geo.createMap({
                easting: 600000,
                northing: 200000,
                zoom: 16
            });
        
            var extent = new OpenLayers.Bounds(600000, 199500, 600500, 200000);
        
            var positionPano = new OpenLayers.LonLat(600410, 199577);
            positionPano.transform(map.projection, new OpenLayers.Projection("EPSG:4326"));
            var featurePosition = new GLatLng(positionPano.lat, positionPano.lon);
        
            var streetViewPanelItem = {
                xtype: 'gxux_streetviewpanel',
                id: 'streetViewPanelItem',
                map: map,
                videoMode: true,
                showLinks: true,
                showTool: true,
                panoramaLocation: featurePosition
            };
        
            var mainPanel = new Ext.Panel({
                title: 'StreetView Demo',
                //closable:true,
                width: 700,
                height: 500,
                border: false,
                margins: '0 0 0 0',
                //plain:true,
                split: true,
                layout: 'border',
                id: 'mainpanel',
                renderTo: 'mypanel21',
        
        
                items: [{
                    region: "center",
                    id: "mappanel",
                    title: "GeoAdmin API",
                    xtype: "gx_mappanel",
                    map: map,
                    extent: extent,
                    split: true
                },
                {
                    region: "east",
                    layout: 'fit',
                    width: '50%',
                    id: "streetviewpanel",
                    title: 'Street View Panel',
                    closeAction: 'hide',
                    split: true
                }
        
                ]
            });
        
            mapPanel = Ext.getCmp("mappanel");
            streetViewPanel = Ext.getCmp("streetviewpanel");
            streetViewPanel.add(streetViewPanelItem);
            streetViewPanel.doLayout();
        
            mainPanel.show();
            map.zoomToExtent(extent);
        };
        
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
     <script type="text/javascript">
         var googleApiKey;
         if (location.host.indexOf('bgdi.admin.ch') > -1) {
             googleApiKey = 'ABQIAAAAzQ-mOk5vsRF_OLoN-mOVjhSHRXVQO97xZDVElO7Kaxb3_E7dkBRAys4lZqDtTngdp3fHGDiZ-9QpCw';
         }
         if (location.host.indexOf('api.geo.admin.ch') > -1) {
             googleApiKey = 'ABQIAAAAzQ-mOk5vsRF_OLoN-mOVjhTmDF_rIO6ddF9-LXny6In2V76gexSHwsu1kNFXDUE1wI35QJW0iEd8mw'
         }
         document.write('<scr' + 'ipt type="text/javascript" src="http://maps.google.com/maps?file=api&amp;v=2&amp;sensor=false&amp;key=' + googleApiKey + '"></scr' + 'ipt>');
    </script>

     <script type="text/javascript"
            src="http://svn.geoext.org/sandbox/cmoullet/ux/StreetViewPanel/ux/widgets/StreetViewPanel.js"></script>
     <script type="text/javascript"
            src="http://svn.geoext.org/sandbox/cmoullet/ux/StreetViewPanel/ux/control/StreetViewClick.js"></script>

   </body>
