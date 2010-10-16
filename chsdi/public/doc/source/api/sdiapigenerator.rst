API Generator
=============


.. raw:: html

   <body>
      <div id="myconfigurator" style="width:800px;height:350px;padding: 2 2 2 2;"></div>
      <form onSubmit="return OnSubmitForm();" method="post" name="publisher" target="_blank" style="margin-top:2px;">
         <input type="hidden" id="codeValue" name="codeValue" value="">
         <input class="button" onclick="postCode();" value="Publish code" name="publishCode" type="submit" />
      </form>
      <h1> Source code editor </h1>
      <textarea id="code" cols="80" rows="30"></textarea>
      <input class="button" onclick="runCode();" value="Run code in preview" name="runCode" type="submit" />        
      <form onSubmit="return OnSubmitForm();" method="post" name="publisher1" target="_blank" style="margin-top:2px;">
         <input type="hidden" id="codeValue" name="codeValue" value="">
         <input class="button" onclick="postCode1();" value="Publish code" name="publishCode1" type="submit" />
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
    var getScaleZoomFromPreview;
    var selectedLayerArray;
    var addSwissSearch;
    var addBaseLayerTool;
    var backgroundLayer;
    var addTooltip;
    var editor;
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
        document.publisher1.action = GeoAdmin.webServicesUrl + "/publishers"
    }
    function getReturnLine(html) {
        var separator = "\n";
        if (html) {
            separator = "<br>";
        }
        return separator;
    }

    function postCode() {
        document.publisher.codeValue.value = writeCode(false, true);
    }

    function postCode1() {
        document.publisher1.codeValue.value = editor.getCode();
    }

    function runCode() {
        configurator.disable();
        dropPreview();
        createPreview(editor.getCode());
    }

    function writeCode(htmlSeparator, forPublication) {
        var separator = getReturnLine(htmlSeparator);

        var code = '<script type="text/javascript">';
        code = code + separator;

        code = code + 'var api;';
        code = code + separator;
        code = code + 'function init() {';
        code = code + separator;
        if (addSwissSearch || addBaseLayerTool) {
            code = code + '   var toolbar = new Ext.Toolbar({});';
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
            code = code + '   var baseLayerTool = api.createBaseLayerTool({label: "Orthophoto",slider: {width: 80},combo: { width: 120}});';
            code = code + separator;
            code = code + '   toolbar.add(baseLayerTool);'
            code = code + separator;
            code = code + '   toolbar.doLayout();';
        }

        if (addBaseLayerTool && addSwissSearch) {
            code = code + separator;
            code = code + '   toolbar.add(\' \');'
            code = code + separator;
            code = code + '   toolbar.doLayout();';
        }

        if (addSwissSearch) {
            code = code + separator;
            code = code + '   var swissSearchCombo = api.createSearchBox({width: 180});';
            code = code + separator;
            code = code + '   toolbar.add(swissSearchCombo);'
            code = code + separator;
            code = code + '   toolbar.doLayout();';
        }
        code = code + separator;
        if (selectedLayerArray.length > 0) {
            for each (var layer in selectedLayerArray) {
                if (layer.data) {
                    code = code + '   api.map.addLayerByName(\'' + layer['data'].value + '\');';
                    code = code + separator;
                }
            }
        }
        if (addTooltip) {
            code = code + separator;
            code = code + '   api.createTooltip({});';
            code = code + separator;
        }
        if (htmlSeparator || forPublication) {
            if (getScaleZoomFromPreview) {
                var myiframe = document.getElementById("ifrm");
                var centerLat = myiframe.contentWindow.api.map.center.lat;
                var centerLon = myiframe.contentWindow.api.map.center.lon;
                var zoom = myiframe.contentWindow.api.map.zoom;
                code = code + '   api.map.setCenter(new OpenLayers.LonLat(' + centerLon + ',' + centerLat + '),' + zoom + ');';
                code = code + separator;
            }
        }
        code = code + '}';
        code = code + separator;
        code = code + '<\/script>';
        code = code + separator;
        code = code + '<body onload="init();">';
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

    function createPreview(code) {
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
            if (code) {
                docIframe.writeln(code);
            } else {
                docIframe.writeln(writeCode(false,false));
                editor.setCode(writeCode(false,false));
            }

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

        editor = CodeMirror.fromTextArea('code', {
           height: "350px",
           parserfile: ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsehtmlmixed.js"],
           stylesheet: ["../_static/CodeMirror-0.9/css/xmlcolors.css", "../_static/CodeMirror-0.9/css/jscolors.css", "../_static/CodeMirror-0.9/css/csscolors.css"],
           path: "../_static/CodeMirror-0.9/js/"
        });


        var availableLayers = GeoAdmin.layers.init();
        var layerArray = [];
        for (var layer in availableLayers) {
            if (layer != 'ch.swisstopo.swissimage' && layer != 'ch.swisstopo.pixelkarte-farbe' && layer != 'ch.swisstopo.pixelkarte-grau' && layer != 'voidLayer') {
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
                        data: [
                            ['Pixelmap'],
                            ['Swissimage'],
                            ['Gray pixelmap']
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
                    fieldLabel: 'Use preview\'s map for publishing',
                    checked: true,
                    listeners:{
                        'check': function(field, checked) {
                            getScaleZoomFromPreview = checked;
                        }
                    }
                },
                {
                    xtype: 'checkbox',
                    anchor: '95%',
                    fieldLabel: 'Add base layer tool',
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
                    fieldLabel: 'Add swiss search combo',
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
                    fieldLabel: 'Add tooltip',
                    listeners:{
                        'check': function(field, checked) {
                            addTooltip = checked;
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