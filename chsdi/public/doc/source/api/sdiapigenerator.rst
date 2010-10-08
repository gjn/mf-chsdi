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

      function init() {
         mapWidth = 500;
         mapHeight = 400;
         configurator = new Ext.FormPanel({
           title: 'GeoAdmin API configurator',
           frame: true,
           labelWidth: 110,
           width: 300,
           renderTo:'myconfigurator',
           bodyStyle: 'padding:0 10px 0;',
           items: [
              {
              xtype: 'textfield',
              fieldLabel: 'Map width',
              anchor: '95%',
              value: mapWidth,
              listeners:{
                 'change': function(field,newValue, oldvalue) {
                    mapWidth = newValue;
                    dropPreview();
                    createPreview();
                    }
                 }
              },
              {
              xtype: 'textfield',
              fieldLabel: 'Map height',
              anchor: '95%',
              value: mapHeight,
              listeners:{
                 'change': function(field, newValue, oldvalue) {
                    mapHeight = newValue;
                    dropPreview();
                    createPreview();
                    }
                 }
              }
           ]
         });
         createPreview();

      };
      function createPreview() {
         var panel = document.getElementById("mypanel");
         iframeElement = document.createElement("iframe");
         iframeElement.setAttribute('id', 'ifrm');
         iframeElement.setAttribute('width', 800);
         iframeElement.setAttribute('height', 600);
         panel.appendChild(iframeElement);
         docIframe = iframeElement.contentWindow.document;
         docIframe.open();
         docIframe.writeln(writeCode());
         docIframe.close();
      };
      function dropPreview() {
         var panel = document.getElementById("mypanel");
         panel.removeChild(iframeElement);
      };
      function showCode() {
         new Ext.Window({
             html: 'to be implemented' 
         }).show();
      }
      function writeCode() {
         var code = '<script type="text/javascript">';
         code = code + 'function init() {';
         code = code + '   var api = new GeoAdmin.API();';
         code = code + '   api.createMapPanel({';
         code = code + '      renderTo: "mymap1"';
         code = code + '      });';
         code = code + '   }';
         code = code + '<\/script>';
         code = code + '<body onload="init();">';
         code = code + '  <div id="mymap1" style="width:'+mapWidth+'px;height:'+mapHeight+'px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"><\/div>';
         code = code + '  <script type="text/javascript" src="../../../loader.js"><\/script>';
         code = code + '<\/body>';
         return code;
      };
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>