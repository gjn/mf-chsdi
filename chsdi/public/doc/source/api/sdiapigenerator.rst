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
              strText = strText.replace(strTarget, strSubString)

              // Get the index of any next matching substring.
              intIndexOfMatch = strText.indexOf(strTarget);
          }

          // Return the updated string with ALL the target strings
          // replaced out with the new substring.
          return( strText );
      };
      
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
         docIframe.writeln(writeCode(false));
         docIframe.close();
      };
      function dropPreview() {
         var panel = document.getElementById("mypanel");
         panel.removeChild(iframeElement);
      };
      function showCode() {
         var code = writeCode(true);

         var code = code.replaceAll('<br>', 'blablabla');
         var code = code.replaceAll('<', '&#60;');
	     var code = code.replaceAll('>', '&#62;');
	     var code = code.replaceAll(' ', '&nbsp;');
	     var code = code.replaceAll('blablabla', '<br>');
         new Ext.Window({
            id: 'apicode',
            width:800,
	        height:500,
	        autoScroll: true,
	        title:"API Code source",
            html: code
         }).show();
      };


      function getReturnLine(html) {
        var separator = "\n";
        if (html) {
            separator = "<br>";
        }
        return separator;
      };
      
      function writeCode(htmlSeparator) {
         var separator = getReturnLine(htmlSeparator);
         var code = '<script type="text/javascript">';
         code = code + separator;
         code = code + 'function init() {';
         code = code + separator;
         code = code + '   var api = new GeoAdmin.API();';
         code = code + separator;
         code = code + '   api.createMapPanel({';
         code = code + separator;
         code = code + '      renderTo: "mymap1"';
         code = code + separator;
         code = code + '      });';
         code = code + separator;
         code = code + '   }';
         code = code + separator;
         code = code + '<\/script>';
         code = code + separator;
         code = code + '<body onload="init();">';
         code = code + separator;
         code = code + '  <div id="mymap1" style="width:'+mapWidth+'px;height:'+mapHeight+'px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"><\/div>';
         code = code + separator;
         code = code + '  <script type="text/javascript" src="../../../loader.js"><\/script>';
         code = code + separator;
         code = code + '<\/body>';
         return code;
      };
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>