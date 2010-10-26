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

Showmarkers
----------

This example shows a naive way to add custom markers and popup linking to external pages. Obviously the webcam locations are not accurate.

.. raw:: html

   <body>
      <div id="mymap14" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>
Exemple provided by *P. Staub*

.. raw:: html

    <a id="showRef14" href="javascript:showdiv('codeBlock14','showRef14','hideRef14')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef14" href="javascript:hidediv('codeBlock14','showRef14','hideRef14')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock14" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
       function init() {
           var geo = new GeoAdmin.API();
           geo.createMap({
               div: "mymap14",
               easting: 530000,
               northing: 199000,
               zoom: 1
           });
          var drawing = geo.map.getLayersByName('drawing').pop();
          if (drawing) {
              drawing.events.on({
                  featureselected: function (e) {
                       geo.popup.setWidth(400)
                  }
              });
          }
         geo.map.zoomToMaxExtent();
         <!--BE Frienisberg-->
         geo.showMarker({
             easting: 591817,
             northing: 208466,
             iconPath: 'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',
             graphicHeight: 30,
             graphicWidth: 30,
             html: '<h1>Frienisberg BE - 710m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0011.Data.jpg" /><br><h1>Viertages-Wetterprognose BERN (Quelle: meteo.ch):</h1><br><img src="http://www.meteo.ch/_mdata/de_ch_ort_bern_1.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_bern_2.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_bern_3.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_bern_4.jpg" />'
         });
         
         <!-- Obviously only one meteo station is added. -->
         


       }
   </script>
   <body onload="init();">
       <script type="text/javascript" src="../../../loader.js"></script>
       <script type="text/javascript" src="http://api.geo.admin.ch/lib/openlayers/lib/OpenLayers/Format/GML.js"></script>
       <link rel=stylesheet type=text/css href="../../../build/api.css">
   </body>    

.. raw:: html

    </div>

.. raw:: html


   <script type="text/javascript">
      var geo;
       function init() {
           
           geo = new GeoAdmin.API();
           geo.createMap({
               div: "mymap14",
               easting: 530000,
               northing: 199000,
               zoom: 1
           });
           var drawing = geo.map.getLayersByName('drawing').pop();
           if (drawing) {
               drawing.events.on({featureselected: function(e){geo.popup.setWidth(400)}});
           }
           geo.map.zoomToMaxExtent();
           <!--BE Frienisberg-->
           geo.showMarker({easting:591817,northing:208466,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30,
                    html:'<h1>Frienisberg BE - 710m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0011.Data.jpg" /><br><h1>Viertages-Wetterprognose BERN (Quelle: meteo.ch):</h1><br><img src="http://www.meteo.ch/_mdata/de_ch_ort_bern_1.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_bern_2.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_bern_3.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_bern_4.jpg" />'});

           <!--BE Sigriswil-->
                geo.showMarker({easting:621012,northing:173991,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30,
                    html:'<h1>Sigriswil BE - 730m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0025.Data.jpg" /><br><h1>Viertages-Wetterprognose BERN (Quelle: meteo.ch):</h1><br><img src="http://www.meteo.ch/_mdata/de_ch_ort_bern_1.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_bern_2.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_bern_3.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_bern_4.jpg" />'});
                <!--BE/VS Grimsel-->
                geo.showMarker({easting:668853,northing:157050,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30,
                    html:'<h1>Grimselpass BE/VS - 2212m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0013.Data.jpg" />'});
                <!--BS St. Chrischona-->
                geo.showMarker({easting:618077,northing:269116,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30,
                    html:'<h1>St. Chrischona BS - 650m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0027.Data.jpg" /><br><h1>Viertages-Wetterprognose BASEL (Quelle: meteo.ch):</h1><br><img src="http://www.meteo.ch/_mdata/de_ch_ort_basel_1.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_basel_2.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_basel_3.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_basel_4.jpg" />'});
                <!--GR Bivio-->
                geo.showMarker({easting:769937,northing:148237,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30, 
                    html:'<h1>Bivio GR - 1900m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0006.Data.jpg" />'});
                <!--GR Casaccia-->
                geo.showMarker({easting:771366,northing:140219,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30,
                    html:'<h1>Casaccia GR - 1470m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0007.Data.jpg" />'});
                <!--GR Flüelapass-->
                geo.showMarker({easting:794325,northing:180195,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30, 
                    html:'<h1>Flüelapass GR - 2176m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0009.Data.jpg" />'});
                <!--GR Landquart-->
                geo.showMarker({easting:763675,northing:203765,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30,
                    html:'<h1>Landquart GR - 540m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0017.Data.jpg" /><br><h1>Viertages-Wetterprognose CHUR (Quelle: meteo.ch):</h1><br><img src="http://www.meteo.ch/_mdata/de_ch_ort_chur_1.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_chur_2.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_chur_3.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_chur_4.jpg" />'});
                <!--GR Splügenpass-->
                geo.showMarker({easting:745095,northing:152212,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30,
                    html:'<h1>Splügenpass GR/I - 2144m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0033.Data.jpg" />'});
                <!--GR Murtel-->
                geo.showMarker({easting:783355,northing:145140,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30,
                    html:'<h1>Murtel GR - 2700m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0020.Data.jpg" />'});
                <!--OW Kaiserstuhl-->
                geo.showMarker({easting:656274,northing:185120,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30, 
                    html:'<h1>Kaiserstuhl OW - 700m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0015.Data.jpg" /><br><h1>Viertages-Wetterprognose LUZERN (Quelle: meteo.ch):</h1><br><img src="http://www.meteo.ch/_mdata/de_ch_ort_luzern_1.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_luzern_2.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_luzern_3.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_luzern_4.jpg" />'});
                <!--SG Walensee-->
                geo.showMarker({easting:734920,northing:219460,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30,
                    html:'<h1>Walensee GL/SG - 440m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0030.Data.jpg" />'});
                <!--SZ Goldau-->
                geo.showMarker({easting:684400,northing:211540,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30, 
                    html:'<h1>Goldau SZ - 510m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0012.Data.jpg" /><br><h1>Viertages-Wetterprognose LUZERN (Quelle: meteo.ch):</h1><br><img src="http://www.meteo.ch/_mdata/de_ch_ort_luzern_1.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_luzern_2.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_luzern_3.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_luzern_4.jpg" />'});
                <!--TI Brugnasco-->
                geo.showMarker({easting:693249,northing:153131,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30, 
                    html:'<h1>Brugnasco TI - 1390m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0005.Data.jpg" />'});
                <!--TI Montagnola-->
                geo.showMarker({easting:714578,northing: 93364,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30,
                    html:'<h1>Montagnola TI - 480m ü. M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0018.Data.jpg" /><br><h1>Viertages-Wetterprognose LOCARNO (Quelle: meteo.ch):</h1><br><img src="http://www.meteo.ch/_mdata/de_ch_ort_locarno_1.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_locarno_2.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_locarno_3.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_locarno_4.jpg" />'});
                <!--TI Novazzano-->
                geo.showMarker({easting:719714,northing: 77332,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30,
                    html:'<h1>Novazzano TI - 410m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0021.Data.jpg" /><br><h1>Viertages-Wetterprognose LOCARNO (Quelle: meteo.ch):</h1><br><img src="http://www.meteo.ch/_mdata/de_ch_ort_locarno_1.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_locarno_2.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_locarno_3.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_locarno_4.jpg" />'});
                <!--TI Olivone-->
                geo.showMarker({easting:716379,northing:155402,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30,
                    html:'<h1>Olivone TI - 1190m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0021.Data.jpg" />'});
                <!--TG Frauenfeld (sehr unpräzise)-->               
                geo.showMarker({easting:711585,northing:268450,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30, 
                    html:'<h1>Frauenfeld TG - 520m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0010.Data.jpg" />'});
                <!--UR Gütsch-->                
                geo.showMarker({easting:689531,northing:167562,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30,
                    html:'<h1>Gütsch UR - 2280m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0014.Data.jpg" />'});
                <!--VD La Dôle-->               
                geo.showMarker({easting:497085,northing:142450,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30, 
                    html:'<h1>La Dôle VD - 1670m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0016.Data.jpg" /><br><br><h1>Viertages-Wetterprognose GENF (Quelle: meteo.ch):</h1><br><img src="http://www.meteo.ch/_mdata/de_ch_ort_geneve_1.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_geneve_2.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_geneve_3.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_geneve_4.jpg" />'});
                <!--VD Yverdon-l-B-->               
                geo.showMarker({easting:538870,northing:181300,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30,
                    html:'<h1>Yverdon-les-Bains VD - 465m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0031.Data.jpg" />'});
                <!--VD Mt Pèlerin-->                
                geo.showMarker({easting:552510,northing:149790,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30,
                    html:'<h1>Mt. P&egrave;lerin VD - 1080m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0019.Data.jpg" />'});
                <!--VD Château-d'Oex-->             
                geo.showMarker({easting:576360,northing:147000,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30, 
                    html:'<h1>Château-d Oex - 980m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0008.Data.jpg" />'});
                <!--VS Ravoire-->               
                geo.showMarker({easting:569413,northing:105345,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30,
                    html:'<h1>Ravoire VS - 1133m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0023.Data.jpg" />'});
                <!--VS Torrentalp-->                
                geo.showMarker({easting:616200,northing:135360,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30,
                    html:'<h1>Torrentalp VS - 2310m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0028.Data.jpg" /><br><h1>Viertages-Wetterprognose BRIG (Quelle: meteo.ch):</h1><br><img src="http://www.meteo.ch/_mdata/de_ch_ort_brig_1.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_brig_2.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_brig_3.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_brig_4.jpg" />'});
                <!--VS Rosswald-->              
                geo.showMarker({easting:646631,northing:128306,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30, 
                    html:'<h1>Rosswald VS - 1830m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0024.Data.jpg" /><br><h1>Viertages-Wetterprognose BRIG (Quelle: meteo.ch):</h1><br><img src="http://www.meteo.ch/_mdata/de_ch_ort_brig_1.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_brig_2.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_brig_3.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_brig_4.jpg" />'});
                <!--ZH Zürich -->
                geo.showMarker({easting:685115,northing:248107,
                    iconPath:'http://www.imos-cms.de/fileadmin/images/kamera_icon.png',graphicHeight:30,graphicWidth:30,
                    html:'<h1>Zürich ZH (MeteoSchweiz) - 560m ü.M.</h1><br><img src="http://www.meteoschweiz.admin.ch/web/de/wetter/aktuelles_wetter/kamerabilder.Par.0032.Data.jpg" /><br><h1>Viertages-Wetterprognose ZÜRICH (Quelle: meteo.ch):</h1><br><img src="http://www.meteo.ch/_mdata/de_ch_ort_zuerich_1.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_zuerich_2.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_zuerich_3.jpg" />&nbsp;<img src="http://www.meteo.ch/_mdata/de_ch_ort_zuerich_4.jpg" />'});




          
       }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
     <link rel=stylesheet type=text/css href="../../../build/api.css">
   </body>
