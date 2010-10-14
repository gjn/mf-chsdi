API Generator
=============


.. raw:: html

   <body>
      <div id="myconfigurator" style="width:800px;height:350px;padding: 0 0 0 0;"></div>

      <h1> Preview </h1>
      <a href="javascript:showCode()">Show code of preview</a>
      <div id="mypanel" style="width:800px;height:600px;padding: 0 0 0 0;"></div>
   </body>

.. raw:: html

   <script type="text/javascript">
      var iframeElement;
      var configurator;
      var mapWidth;
      var mapHeight;
      var getScaleZoomFromPreview;
      var selectedLayerArray;
      var addSwissSearch;
      var addBaseLayerTool;
      var backgroundLayer;
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
         if (addSwissSearch || addBaseLayerTool) {
              code = code + '   var toolbar = new Ext.Toolbar({});'
              code = code + separator;
         }
         code = code + '   api = new GeoAdmin.API();';
         code = code + separator;
         code = code + '   api.createMapPanel({';
         code = code + separator;
         code = code + '      renderTo: "mymap"';

         if (addSwissSearch || addBaseLayerTool) {
              code = code + separator;
              code = code + '      ,tbar: toolbar'    
         }




          
         code = code + separator;
         code = code + '   });';

         if (backgroundLayer == 1) {
              code = code + separator;
              code = code + '   api.map.complementaryLayer.setOpacity(0);'
         }

          if (backgroundLayer == 2) {
              code = code + separator;
              code = code + '   api.map.switchComplementaryLayer("ch.swisstopo.pixelkarte-grau", {opacity: 1});'
         }

         if (addBaseLayerTool) {
              code = code + separator;
              code = code + '   var baseLayerTool = api.createBaseLayerTool({label: "Orthophoto",slider: {width: 80},combo: { width: 120}});'
              code = code + separator;
              code = code + '   toolbar.add(baseLayerTool);toolbar.doLayout();'
         }

         if (addBaseLayerTool && addSwissSearch) {
             code = code + separator;
             code = code + '   toolbar.add(\' \');toolbar.doLayout();'
         }
          
         if (addSwissSearch) {
              code = code + separator;
              code = code + '   var swissSearchCombo = api.createSearchBox({width: 180});'
              code = code + separator;
              code = code + '   toolbar.add(swissSearchCombo);toolbar.doLayout();' 
         }
         code = code + separator;
         if (selectedLayerArray.length > 0) {
             for each (var layer in selectedLayerArray) {
                 if (layer.data) {
                    code = code + '   api.map.addLayerByName(\'' + layer['data'].value + '\');'
                    code = code + separator;
                 }
             }
         }
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

            if (addSwissSearch) {
                 iframeElement.setAttribute('width', mapWidth + 30);
            } else {
                 iframeElement.setAttribute('width', mapWidth + 2);
            }
            if (addSwissSearch) {
                 iframeElement.setAttribute('height', mapHeight + 30);
            } else {
                 iframeElement.setAttribute('height', mapHeight + 2);
            }
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
         mapWidth = 700;
         mapHeight = 500;
         getScaleZoomFromPreview = true;
         backgroundLayer = 0;

         var availableLayers = GeoAdmin.layers.init();
         layerArray = [];
         for (var layer in availableLayers) {
             if (layer != 'ch.swisstopo.swissimage' && layer != 'ch.swisstopo.pixelkarte-farbe' && layer != 'ch.swisstopo.pixelkarte-grau' &&  layer != 'voidLayer') {
             layerArray.push([layer, availableLayers[layer].name]);
             }   
         }

         var ds = new Ext.data.ArrayStore({
            data: layerArray,
            fields: ['value','text'],
            sortInfo: {
               field: 'text',
               direction: 'ASC'
            }
         });

         configurator = new Ext.FormPanel({
           title: 'GeoAdmin API Generator',
           frame: true,
           labelWidth: 200,
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
              xtype: 'combo',
              fieldLabel: 'Background layer',
              displayField:'value',
              mode: 'local',
              typeAhead: true,
              triggerAction: 'all',
              emptyText:'Default',
              selectOnFocus:true,
              store: new Ext.data.ArrayStore({
                 fields: ['value'],
                 data: [['Pixelmap'],['Swissimage'],['Gray pixelmap']]
              }),
              listeners:{
                 'select': function(combo, record, index) {
                    backgroundLayer = index;
                    dropPreview();
                    createPreview();
                    }
                 }
              },
              {
              xtype: 'checkbox',
              anchor: '95%',
              fieldLabel: 'Use preview\'s map (zoom & scale)',
              checked: true,
              listeners:{
                 'check': function(field,checked) {
                    getScaleZoomFromPreview = checked;
                    }
                 }
              },
              {
              xtype: 'checkbox',
              anchor: '95%',
              fieldLabel: 'Add base layer tool',
              listeners:{
                 'check': function(field,checked) {
                    addBaseLayerTool = checked;
                    dropPreview();
                    createPreview();
                    }
                 }
              },
              {
              xtype: 'checkbox',
              anchor: '95%',
              fieldLabel: 'Add swiss search combo',
              listeners:{
                 'check': function(field,checked) {
                    addSwissSearch = checked;
                    dropPreview();
                    createPreview();
                    }
                 }
              },
              {
              xtype: 'itemselector',
              name: 'itemselector',
              fieldLabel: 'Layer selection',
              imagePath: '../../../lib/ext/Ext/examples/ux/images/',
              listeners:{
                 'change': function(itemselector, value, hiddenvalue) {
                     selectedLayerArray = itemselector.toStore.data.items;
                     if (selectedLayerArray.length > 0) {
                        dropPreview();
                        createPreview();
                     }
                 }
              },
              multiselects: [{
                 width: 240,
                 height: 140,
                 store: ds,
                 displayField: 'text',
                 valueField: 'value'
                 },{
                 width: 240,
                 height: 140,
                 store: [],
                 tbar:[{
                    text: 'clear',
                    handler:function(){
	                    configurator.getForm().findField('itemselector').reset();
                        selectedLayerArray  = [];
                        dropPreview();
                        createPreview(); 
	                }
                  }]
                }]
              }
           ]
         });
         createPreview();

      }

   </script>

   <body onload="init();">

     <script type="text/javascript" src="../../../loader.js"></script>
     <link rel="stylesheet" type="text/css" href="../../../lib/ext/Ext/examples/ux/css/MultiSelect.css"/>

     <script type="text/javascript" src="../../../lib/ext/Ext/examples/ux/MultiSelect.js"></script>
     <script type="text/javascript" src="../../../lib/ext/Ext/examples/ux/ItemSelector.js"></script>
   </body>