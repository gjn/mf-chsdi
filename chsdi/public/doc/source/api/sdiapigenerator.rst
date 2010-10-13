API Generator
=============


.. raw:: html

   <body>
      <div id="myconfigurator" style="width:800px;height:200px;padding: 0 0 0 0;"></div>
      <a href="javascript:showCode()">Show code</a>
      <h1> Preview </h1>
      <div id="mypanel" style="width:800px;height:600px;padding: 0 0 0 0;"></div>
   </body>

.. raw:: html

   <script type="text/javascript">
      var iframeElement;
      var configurator;
      var mapWidth;
      var mapHeight;
      var getScaleZoomFromPreview;
      // Replaces all instances of the given substring.
      String.prototype.replaceAll = function(
              strTarget, // The substring you want to replace
              strSubString // The string you want to replace in.
              ) {
          var strText = this;
          var intIndexOfMatch = strText.indexOf(strTarget);

          // Keep looping while an instance of the target string
          // still exists in the string.
          while (intIndexOfMatch != -1) {
              // Relace out the current instance.
              strText = strText.replace(strTarget, strSubString);

              // Get the index of any next matching substring.
              intIndexOfMatch = strText.indexOf(strTarget);
          }

          // Return the updated string with ALL the target strings
          // replaced out with the new substring.
          return( strText );
      };

            function getReturnLine(html) {
        var separator = "\n";
        if (html) {
            separator = "<br>";
        }
        return separator;
      }

      function writeCode(htmlSeparator) {
         var separator = getReturnLine(htmlSeparator);

         var code = '<script type="text/javascript">';
         code = code + separator;
         code = code + 'var api';
         code = code + separator;
         code = code + 'function init() {';
         code = code + separator;
         code = code + '   api = new GeoAdmin.API();';
         code = code + separator;
         code = code + '   api.createMapPanel({';
         code = code + separator;
         code = code + '      renderTo: "mymap"';
         code = code + separator;
         code = code + '   });';
         code = code + separator;
         if (htmlSeparator) {
            if (getScaleZoomFromPreview) {
               var myiframe = document.getElementById("ifrm");
               var centerLat = myiframe.contentWindow.api.map.center.lat;
               var centerLon = myiframe.contentWindow.api.map.center.lon;
               var zoom = myiframe.contentWindow.api.map.zoom;
               code = code + '   api.map.setCenter(new OpenLayers.LonLat('+centerLon+','+centerLat+'),'+zoom+');';
               code = code + separator;
            }
         }
         code = code + '}';
         code = code + separator;
         code = code + '<\/script>';
         code = code + separator;
         code = code + '<body onload="init();">';
         code = code + separator;
         code = code + '  <div id="mymap" style="width:'+mapWidth+'px;height:'+mapHeight+'px;padding: 0 0 0 0"><\/div>';
         code = code + separator;
         if (htmlSeparator) {
             code = code + '  <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"><\/script>';
         } else {
            code = code + '  <script type="text/javascript" src="../../../loader.js"><\/script>';
         }
         code = code + separator;
         code = code + '<\/body>';
         return code;
      }

      function showCode() {
         var code = writeCode(true);
         code = code.replaceAll('<br>','blablabla');
         code = code.replaceAll('<','&#60;');
         code = code.replaceAll('>','&#62;');
         code = code.replaceAll(' ','&nbsp;');
         code = code.replaceAll('blablabla','<br>');
         new Ext.Window({
            id: 'apicode',
            width:800,
            height:500,
            autoScroll: true,
            title:"API Code source",
            html: code
         }).show();
      }

      function createPreview() {
         var panel = document.getElementById("mypanel");
         if (Ext.isIE) {
             if (panel.childNodes.length < 1) {
                var txt = document.createTextNode(" Sorry, but Internet Explorer doesn't support iframe.... please use a modern browser like Firefox. No preview available.");
                panel.appendChild(txt);
             }
         } else {
            iframeElement = document.createElement("iframe");
            iframeElement.setAttribute('id', 'ifrm');
            iframeElement.setAttribute('width', mapWidth + 2);
            iframeElement.setAttribute('height', mapHeight + 2);
            panel.appendChild(iframeElement);
            var docIframe = iframeElement.contentWindow.document;
            docIframe.open();
            docIframe.writeln(writeCode(false));
            docIframe.close();
         }
      }

      function dropPreview() {
         var panel = document.getElementById("mypanel");
         if (iframeElement) {
           panel.removeChild(iframeElement);
         }

      }

      function init() {
         mapWidth = 500;
         mapHeight = 400;
         getScaleZoomFromPreview = false;

         configurator = new Ext.FormPanel({
           title: 'GeoAdmin API configurator',
           frame: true,
           labelWidth: 300,
           width: 800,
           renderTo:'myconfigurator',
           bodyStyle: 'padding:0 10px 0;',
           items: [
              {
              xtype: 'textfield',
              fieldLabel: 'Map width [pixels]',
              anchor: '95%',
              value: mapWidth,
              listeners:{
                 'change': function(field,newValue, oldvalue) {
                    mapWidth = parseInt(newValue);
                    dropPreview();
                    createPreview();
                    }
                 }
              },
              {
              xtype: 'textfield',
              fieldLabel: 'Map height [pixels]',
              anchor: '95%',
              value: mapHeight,
              listeners:{
                 'change': function(field, newValue, oldvalue) {
                    mapHeight = parseInt(newValue);
                    dropPreview();
                    createPreview();
                    }
                 }
              },
              {
              xtype: 'checkbox',
              anchor: '95%',
              fieldLabel: 'Get scale and zoom from preview',
              listeners:{
                 'check': function(field,checked) {
                    getScaleZoomFromPreview = checked;
                    }
                 }
              }
           ]
         });
         createPreview();

      }

   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>