API Generator
=============

Use the API generator to create fantastic maps without development knowledge.

  1. Use the following panel to configure the map
  2. Test the configuration with the publish button
  3. Place the code in your own web page. That's it ! 

Please read the terms of use and register before using the GeoAdmin API: http://www.geo.admin.ch/internet/geoportal/de/home/services/geoservices/display_services/api_services/order_form.html

.. raw:: html

   <body>
      <div id="myconfigurator" style="width:750px;height:370px;padding: 2 2 2 2;"></div>
      <form onSubmit="return OnSubmitForm();" method="post" name="publisher" target="_blank" style="margin-top:10px;">
         <input type="hidden" id="codeValue" name="codeValue" value="">
         <input class="button" onclick="postCode();" value="Publish code" name="publishCode" type="submit" />
      </form>
      <h1> Source Code Editor </h1>
      <textarea id="code" cols="80" rows="3"></textarea>
      <input class="button" onclick="runCode();" value="Run code in preview" id="runCode" name="runCode" type="submit" />        
      <form onSubmit="return OnSubmitForm();" method="post" id="publisher1" name="publisher1" target="_blank" style="margin-top:2px;">
         <input type="hidden" id="codeValue" name="codeValue" value="">
         <input class="button" onclick="postCode1();" value="Publish code" id="publishCode1" name="publishCode1" type="submit" />
      </form>
      <h1> Preview </h1>
      <div id="mypanel" style="padding: 2 2 2 2;"></div>
   </body>

.. raw:: html

   <script type="text/javascript">

    var iframeElement;
    var configurator;
    var mapWidth;
    var mapHeight;
    var selectedLayerArray = [];
    var addSwissSearch;
    var addBaseLayerTool;
    var backgroundLayer;
    var addTooltip;
    var editor;
    var easting;
    var northing;
    var zoom;
    var kmlPath;
    var start = true;

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

    function OnSubmitForm() {
        document.publisher.action = GeoAdmin.webServicesUrl + "/publishers";
        document.publisher1.action = GeoAdmin.webServicesUrl + "/publishers";
    }

    function getReturnLine(html) {
        var separator = "\n";
        if (html) {
            separator = "<br>";
        }
        return separator;
    }

    function postCode1() {
        if (editor) {
           document.publisher1.codeValue.value = editor.getCode();
        }
    }

    function writeCode(htmlSeparator, forPublication) {
        var separator = getReturnLine(htmlSeparator);

        var code = '<head><script type="text/javascript">';
        code = code + separator;

        code = code + '//Create a global api variable to simplify debugging';
        code = code + separator;
        code = code + 'var api;';
        code = code + separator;
        code = code + separator;
        code = code + '//init function is started when page onload event is triggered';
        code = code + separator;
        code = code + 'function init() {';
        code = code + separator;
        if (addSwissSearch || addBaseLayerTool) {
            code = code + separator;
            code = code + '   //Create a toolbar placed above the map panel';
            code = code + separator;
            code = code + '   var toolbar = new Ext.Toolbar({});';
            code = code + separator;
        }

        code = code + separator;
        code = code + '   //Create an instance of the GeoAdmin API';
        code = code + separator;
        code = code + '   api = new GeoAdmin.API();';
        code = code + separator;
        code = code + separator;
        code = code + '   //Create a GeoExt map panel placed in the mymap div';
        code = code + separator;
        code = code + '   api.createMapPanel({';
        code = code + separator;
        code = code + '      renderTo: "mymap",';
        code = code + separator;
        code = code + '      height: ' + mapHeight;

        if (addSwissSearch || addBaseLayerTool) {
            code = code + separator;
            code = code + '      //Add the toolbar in the map panel';
            code = code + separator;
            code = code + '      ,tbar: toolbar';
        }


        code = code + separator;
        code = code + '   });';

        if (backgroundLayer == 1) {
            code = code + separator;
            code = code + separator;
            code = code + '   //The complementary layer is the pixelmap. The Swissimage is place below the pixelmap.';
            code = code + separator;
            code = code + '   api.map.complementaryLayer.setOpacity(0);';
        }

        if (backgroundLayer == 2) {
            code = code + separator;
            code = code + separator;
            code = code + '   //The complementary layer is per default the color pixelmap.';
            code = code + separator;
            code = code + '   api.map.switchComplementaryLayer("ch.swisstopo.pixelkarte-grau", {opacity: 1});';
        }

        if (backgroundLayer == 3) {
            code = code + separator;
            code = code + separator;
            code = code + '   //The complementary layer is per default the color pixelmap.';
            code = code + separator;
            code = code + '   api.map.switchComplementaryLayer("voidLayer", {opacity: 1});';
        }

        if (addBaseLayerTool) {
            code = code + separator;
            code = code + separator;
            code = code + '   //Add a tool to select the background layer.';
            code = code + separator;
            code = code + '   var baseLayerTool = api.createBaseLayerTool({label: "Orthophoto",slider: {width: 80},combo: { width: 120}});';
            code = code + separator;
            code = code + '   toolbar.add(baseLayerTool);';
            code = code + separator;
            code = code + '   toolbar.doLayout();';
        }

        if (addBaseLayerTool && addSwissSearch) {
            code = code + separator;
            code = code + '   toolbar.add(\' \');';
            code = code + separator;
            code = code + '   toolbar.doLayout();';
        }

        if (addSwissSearch) {
            code = code + separator;
            code = code + separator;
            code = code + '   //Add a tool to search for Swissnames, Zip code, Cities and Cantons';
            code = code + separator;
            code = code + '   var swissSearchCombo = api.createSwissSearchCombo({width: 180});';
            code = code + separator;
            code = code + '   toolbar.add(swissSearchCombo);';
            code = code + separator;
            code = code + '   toolbar.doLayout();';
        }
        code = code + separator;
        if (selectedLayerArray.length > 0) {
            code = code + separator;
            code = code + '   //Add layer in the map';
            code = code + separator;
            for (var key in selectedLayerArray) {
                if (selectedLayerArray[key].data) {
                    code = code + '   api.map.addLayerByName(\'' + selectedLayerArray[key].data.value + '\');';
                    code = code + separator;
                }
            }
        }

        if (kmlPath) {
            code = code + separator;
            code = code + '   //Add KML layer in the map';
            code = code + separator;
            code = code + '   var kmlLayer = api.createKmlLayer(\'' + kmlPath + '\',true);';
            code = code + separator;
            code = code + '';
        }
        if (addTooltip) {
            code = code + separator;
            code = code + '   //Add a tooltip when the user clicks on a feature in the map';
            code = code + separator;
            code = code + '   api.createTooltip({});';
            code = code + separator;
        }


        code = code + separator;
        code = code + '   //Recenter the map and define a zoom level';
        code = code + separator;
        code = code + '   api.map.setCenter(new OpenLayers.LonLat(' + easting + ',' + northing + '),' + zoom + ');';
        code = code + separator;

        
        code = code + '}';
        code = code + separator;
        code = code + 'window.onload = init;';
        code = code + separator;
        code = code + '<\/script><\/head>';
        code = code + separator;
        code = code + '<body>';
        code = code + separator;
        if (forPublication) {
            code = code + '<h1 style="font-size:120%;font-family:\'Arial\';margin:2px;">Publication of your custom GeoAdmin API configuration<\/h1>';
            code = code + separator;
        }
        code = code + '  <div id="mymap" style="width:' + mapWidth + 'px;height:' + mapHeight + 'px;padding: 0 0 0 0"><\/div>';
        code = code + separator;
        if (forPublication) {
            code = code + '<br><br><h2 style="font-size:110%;font-family:\'Arial\';margin:2px;">Source code<\/h2>';
            code = code + separator;
            code = code + '<div style="font-size:90%;font-family:\'Arial\';margin:2px;background: #cccccc">';
            code = code + separator;
            var mycode = writeCode(true, false);
            mycode = mycode.replaceAll('<br>', 'blablabla');
            mycode = mycode.replaceAll('<', '&#60;');
            mycode = mycode.replaceAll('>', '&#62;');
            mycode = mycode.replaceAll(' ', '&nbsp;');
            mycode = mycode.replaceAll('blablabla', '<br>');
            code = code + mycode;
            code = code + separator;
            code = code + '<\/div>';
            code = code + separator;
        }
        if (htmlSeparator) {
            code = code + '  <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"><\/script>';
        } else {
            if (forPublication) {
                code = code + '  <script type="text/javascript" src="loader.js"><\/script>';
            } else {
                code = code + '  <script type="text/javascript" src="../../../loader.js"><\/script>';
            }
        }
        code = code + separator;
        code = code + '<\/body>';
        return code;
    }

    function postCode() {
        document.publisher.codeValue.value = writeCode(false, true);
    }

    function createPreview(code) {
        var panel = document.getElementById("mypanel");
        if (Ext.isIE) {
            if (panel.childNodes.length < 1) {
                var txt = document.createTextNode(" Sorry, but Internet Explorer has difficulty to support correctly iframe.... please use a modern browser like Firefox. No preview available.");
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
            if (code) {
                docIframe.writeln(code);
            } else {
                docIframe.writeln(writeCode(false,false));
                if (editor) {
                   editor.setCode(writeCode(false,false));
                }
            }

            docIframe.close();
            window.setTimeout('manageIframeMapEvent()',5000);

        }
    }


    function mapMoveEnd() {
        var myiframe = document.getElementById("ifrm");
        northing = myiframe.contentWindow.api.map.center.lat;
        easting = myiframe.contentWindow.api.map.center.lon;
        zoom = myiframe.contentWindow.api.map.zoom;
        Ext.getCmp('northing').setValue(northing);
        Ext.getCmp('easting').setValue(easting);
        Ext.getCmp('zoom').setValue(zoom);
        if (editor) {
           editor.setCode(writeCode(false,false));
        }
    }
    
    function manageIframeMapEvent() {
         var myiframe = document.getElementById("ifrm");
         myiframe.contentWindow.api.map.events.register("moveend", null, mapMoveEnd);
    }



    function dropPreview() {
        var panel = document.getElementById("mypanel");
        if (iframeElement) {
            panel.removeChild(iframeElement);
        }
    }


    function runCode() {
        configurator.disable();
        dropPreview();
        if (editor) {
           createPreview(editor.getCode());
        }
    }

    function init() {
        mapWidth = 700;
        mapHeight = 500;
        backgroundLayer = 0;
        easting = 660000;
        northing = 190000;
        zoom = 0;

        if (Ext.isIE) {
            document.getElementById("code").innerHTML = "Sorry, but Internet Explorer doesn't support the source code editor.... please use a modern browser like Firefox. ";
            document.getElementById("runCode").style.display='none';
            document.getElementById("publisher1").style.display='none';
        } else {
        editor = CodeMirror.fromTextArea('code', {
           height: "350px",
           parserfile: ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsehtmlmixed.js"],
           stylesheet: ["../_static/CodeMirror-0.9/css/xmlcolors.css", "../_static/CodeMirror-0.9/css/jscolors.css", "../_static/CodeMirror-0.9/css/csscolors.css"],
           path: "../_static/CodeMirror-0.9/js/"
        });
        }


        var availableLayers = GeoAdmin.layers.init();
        var layerArray = [];
        for (var layer in availableLayers) {
            if (layer != 'ch.swisstopo.swissimage' && layer != 'ch.swisstopo.pixelkarte-farbe' && layer != 'ch.swisstopo.pixelkarte-grau' && layer != 'voidLayer' && availableLayers[layer].name.toString().indexOf('ch.') != 0) {
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
            frame: true,
            labelWidth: 200,
            width: 775,
            renderTo:'myconfigurator',
            bodyStyle: 'padding:0 10px 0;',
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: 'Map width [pixels]',
                    anchor: '50%',
                    value: mapWidth,
                    listeners:{
                        'change': function(field, newValue, oldvalue) {
                            mapWidth = parseInt(newValue);
                            dropPreview();
                            createPreview();
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Map height [pixels]',
                    anchor: '50%',
                    value: mapHeight,
                    listeners:{
                        'change': function(field, newValue, oldvalue) {
                            mapHeight = parseInt(newValue);
                            dropPreview();
                            createPreview();
                        }
                    }
                },{
                    xtype: 'compositefield',
                    fieldLabel: 'Map position',
                    labelWidth: 120,
                    items: [
                       {
                       xtype: 'displayfield',
                       value: 'Easting: '
                       },
                       {
                       xtype     : 'textfield',
                       width     : 80,
                       value     : easting,
                       id        : 'easting',
                       disabled  : true
                       },
                       {
                       xtype: 'displayfield',
                       value: 'Northing: '
                       },
                       {
                       xtype     : 'textfield',
                       width     : 80,
                       value     : northing,
                       id        : 'northing',
                       disabled  : true
                       },
                       {
                       xtype: 'displayfield',
                       value: 'Zoom: '
                       },
                       {
                       xtype     : 'textfield',
                       width     : 30,
                       value     : zoom,
                       id        : 'zoom',
                       disabled  : true
                       },
                       {
                       xtype: 'displayfield',
                       value: '(navigate in the preview to set it)'
                       }
                    ]
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
                        data: [
                            ['Pixelmap'],
                            ['Swissimage'],
                            ['Gray pixelmap'],
                            ['White background']
                        ]
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
                    fieldLabel: '<a href="http://api.geo.admin.ch/doc/build/api/sdiapiexamples2.html#base-layer-tool" target="new">Add base layer tool<\/a>',
                    listeners:{
                        'check': function(field, checked) {
                            addBaseLayerTool = checked;
                            dropPreview();
                            createPreview();
                        }
                    }
                },
                {
                    xtype: 'checkbox',
                    anchor: '95%',
                    fieldLabel: '<a href="http://api.geo.admin.ch/doc/build/api/sdiapiexamples1.html#map-with-swiss-search" target="new">Add swiss search combo<\/a>',
                    listeners:{
                        'check': function(field, checked) {
                            addSwissSearch = checked;
                            dropPreview();
                            createPreview();
                        }
                    }
                },
                {
                    xtype: 'checkbox',
                    anchor: '95%',
                    fieldLabel: '<a href="http://api.geo.admin.ch/doc/build/widgets/sdiwidgetsexamples2.html#tooltip" target="new">Add feature tooltip<\/a>',
                    listeners:{
                        'check': function(field, checked) {
                            addTooltip = checked;
                            dropPreview();
                            createPreview();
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'KML URL',
                    anchor: '95%',
                    listeners:{
                        'change': function(field, newValue, oldvalue) {
                            kmlPath = newValue;
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
                            if (!start) {
                                selectedLayerArray = itemselector.toStore.data.items;
                                dropPreview();
                                createPreview();
                            } else {
                                start = false;
                            }
                        }
                    },
                    multiselects: [
                        {
                            width: 240,
                            height: 140,
                            store: ds,
                            displayField: 'text',
                            valueField: 'value'
                        },
                        {
                            width: 240,
                            height: 140,
                            store: [],
                            tbar:[
                                {
                                    text: 'clear',
                                    handler:function() {
                                        configurator.getForm().findField('itemselector').reset();
                                        selectedLayerArray = [];
                                        dropPreview();
                                        createPreview();
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        window.setTimeout("createPreview()", 2000);


    }

   </script>

   <body onload="init();">
     <script src="../_static/CodeMirror-0.9/js/codemirror.js" type="text/javascript"></script>

     <script type="text/javascript" src="../../../loader.js"></script>
     <link rel="stylesheet" type="text/css" href="../../../lib/ext/Ext/examples/ux/css/MultiSelect.css"/>

     <script type="text/javascript" src="../../../lib/ext/Ext/examples/ux/MultiSelect.js"></script>
     <script type="text/javascript" src="../../../lib/ext/Ext/examples/ux/ItemSelector.js"></script>
   </body>
