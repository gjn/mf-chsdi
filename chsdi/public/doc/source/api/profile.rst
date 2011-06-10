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

Profile
-------

This example demonstrate the usage of the profile service.

.. raw:: html

   <body>
      <div id="mymap" style="float: left; width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="myclear" style="clear: both;"></div>

   </body>

.. raw:: html

    <a id="showRef14" href="javascript:showdiv('codeBlock14','showRef14','hideRef14')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef14" href="javascript:hidediv('codeBlock14','showRef14','hideRef14')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock14" style="margin:10px !important;">

.. code-block:: html

     <script type="text/javascript">
       var api;
       function init() {
           api = new GeoAdmin.API();
           var mapPanel = api.createMapPanel({
               renderTo: "mymap",
               height: 340,
               tbar: []
           });
           var profileAction = new GeoExt.ux.Profile({
               map: api.map,
               profileService: 'api.geo.admin.ch',
               profileInteractionEvent: "jqplotMouseMove",
               profileWidth: 600,
               profileHeight: 400,
               styleMarker: {
                           strokeColor: "#FFFF00",
                           strokeOpacity: 0.85,
                           strokeWidth: 3,
                           strokeLinecap: "round",
                           strokeDashstyle: "solid",
                           pointRadius: 5,
                           pointerEvents: "visiblePainted",
                           cursor: "inherit"
                       }
           });
           mapPanel.getTopToolbar().add([profileAction]);
       }
       </script>
          <body onload="init();">
       </script>
       <body onload="init();">
           <div id="mymap" style="float: right; width:400px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
           <script type="text/javascript" src="../../../loader.js"></script>
           <script type="text/javascript" src="../../../lib/geoext.ux.dev/Profile/lib/GeoExt.ux/ProfileControl.js"></script>
           <script type="text/javascript" src="../../../lib/geoext.ux.dev/Profile/lib/GeoExt.ux/ProfileAction.js"></script>
           <script type="text/javascript" src="../../../lib/geoext.ux.dev/Profile/lib/GeoExt.ux/ProfileBox.js"></script>
           <script type="text/javascript" src="../../../lib/geoext.ux.dev/Profile/lib/GeoExt.ux/ProfileFitToParentWindow.js"></script>
           <script type="text/javascript" src="../../../lib/geoext.ux.dev/Profile/lib/jquery/jquery.jqplot.js"></script>
           <script type="text/javascript" src="../../../lib/geoext.ux.dev/Profile/lib/jquery/plugins/jqplot.cursor.js"></script>
       </body>

.. raw:: html

    </div>

.. raw:: html

     <script type="text/javascript">
       var api;
       function init() {
           api = new GeoAdmin.API();
           var mapPanel = api.createMapPanel({
               renderTo: "mymap",
               height: 340,
               tbar: []
           });
           var profileAction = new GeoExt.ux.Profile({
               map: api.map,
               profileService: 'api.geo.admin.ch',
               profileInteractionEvent: "jqplotMouseMove",
               profileWidth: 600,
               profileHeight: 400,
               styleMarker: {
                           strokeColor: "#FFFF00",
                           strokeOpacity: 0.85,
                           strokeWidth: 3,
                           strokeLinecap: "round",
                           strokeDashstyle: "solid",
                           pointRadius: 5,
                           pointerEvents: "visiblePainted",
                           cursor: "inherit"
                       }
           });
           mapPanel.getTopToolbar().add([profileAction]);
       }
       </script>
          <body onload="init();">
       </script>
       <body onload="init();">
           <link rel="stylesheet" type="text/css" href="../../../lib/geoext.ux.dev/Profile/lib/jquery/jquery.jqplot.css"/>           
           <script type="text/javascript" src="../../../loader.js"></script>
           <!--[if IE]>
               <script language="javascript" type="text/javascript" src="../../../lib/geoext.ux.dev/Profile/lib/jquery/excanvas.min.js"></script><![endif]-->           
           <script type="text/javascript" src="../../../lib/geoext.ux.dev/Profile/lib/GeoExt.ux/ProfileControl.js"></script>
           <script type="text/javascript" src="../../../lib/geoext.ux.dev/Profile/lib/GeoExt.ux/ProfileAction.js"></script>
           <script type="text/javascript" src="../../../lib/geoext.ux.dev/Profile/lib/GeoExt.ux/ProfileBox.js"></script>
           <script type="text/javascript" src="../../../lib/geoext.ux.dev/Profile/lib/GeoExt.ux/ProfileFitToParentWindow.js"></script>
           <script type="text/javascript" src="../../../lib/geoext.ux.dev/Profile/lib/jquery/jquery.jqplot.js"></script>
           <script type="text/javascript" src="../../../lib/geoext.ux.dev/Profile/lib/jquery/plugins/jqplot.cursor.js"></script>
       </body>

