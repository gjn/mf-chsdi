/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @requires OpenLayers/Lang.js
 * @requires Ext/examples/ux/ux-all.js
 * @requires Ext/examples/ux/Reorderer.js
 * @requires Ext/examples/ux/ToolbarReorderer.js
 * @requires Ext/examples/ux/ToolbarDroppable.js
 */

Ext.namespace('GeoAdmin');

GeoAdmin.BodGrid = Ext.extend(Ext.grid.GridPanel, {

    /**
     */



    constructor : function(config) {

        var encode = false; //filter query encoded by default?
        var local = true;   //filter performed locally by default?

        var bodGridUrl = (GeoAdmin.protocol ? GeoAdmin.protocol : 'http:') + '//api.geo.admin.ch/main/wsgi/bodgrid?';

        var bodStore = new Ext.data.JsonStore({
            proxy: new Ext.data.ScriptTagProxy({
                url: bodGridUrl,
                callbackParam: 'callback',
                method: 'GET',
                nocache: false,
                autoAbort: true
            }),
            root: 'results',
            fields: ['tech_layer_name'
                , 'abstract'
                , 'datenstand'
                , 'url_portale'
                , 'geobasisdaten_num'
                , 'wms_url'
                , 'geoadmin_inspire_group'
                , 'georeferenzdaten_bool'
                , 'url_download', 'geocat'
                , 'geobasisdaten_tech_number'
                , 'rechtsgrundlage'
                , 'geoadmin_inspire_theme'
                , 'projekte'
                , 'bezeichnung_geobasisdaten_katalog'
                , 'zustaendige_stelle'
                , 'fachstelle_bund'
                , 'inspire_num'
                , 'inspire_name_public'
                , 'oereb_bool'
                , 'download_bool'
                , 'geobasisdaten_sammlung_bundesrecht_bezeichnung'
                , 'geoadmin_kurz_bez'
                , 'geoadmin_bezeichnung'
                , 'zugangberechtigung'
                , 'ausser_kraft_bool'
                , 'termin_minimalmodell'
                /* commented out for Personal Data Protection
                 , 'ansprechperson'
                 */
            ]

        });

        bodStore.load({
            params: {}
        });

        var cursorRe = /^(?:col|e|w)-resize$/;
        Ext.ux.grid.AutoSizeColumns = Ext.extend(Object, {
            cellPadding: 8,
            constructor: function (config) {
                Ext.apply(this, config);
            },
            init: function (grid) {
                var view = grid.getView();
                view.onHeaderClick = view.onHeaderClick.createInterceptor(this.onHeaderClick);
                grid.on('headerdblclick', this.onHeaderDblClick.createDelegate(view, [this.cellPadding], 3));
            },
            onHeaderClick: function (grid, colIndex) {
                var el = this.getHeaderCell(colIndex);
                if (cursorRe.test(el.style.cursor)) {
                    return false;
                }
            },
            onHeaderDblClick: function (grid, colIndex, e, cellPadding) {
                var el = this.getHeaderCell(colIndex), width, rowIndex, count;
                if (!cursorRe.test(el.style.cursor)) {
                    return;
                }
                if (e.getXY()[0] - Ext.lib.Dom.getXY(el)[0] <= 5) {
                    colIndex--;
                    el = this.getHeaderCell(colIndex);
                }
                if (this.cm.isFixed(colIndex) || this.cm.isHidden(colIndex)) {
                    return;
                }
                el = el.firstChild;
                el.style.width = '0px';
                width = el.scrollWidth;
                el.style.width = 'auto';
                for (rowIndex = 0,count = this.ds.getCount(); rowIndex < count; rowIndex++) {
                    el = this.getCell(rowIndex, colIndex).firstChild;
                    el.style.width = '0px';
                    width = Math.max(width, el.scrollWidth);
                    el.style.width = 'auto';
                }
                this.onColumnSplitterMoved(colIndex, width + cellPadding);
            }
        });
        Ext.preg('autosizecolumns', Ext.ux.grid.AutoSizeColumns);


        var filters = new Ext.ux.grid.GridFilters({
            encode: encode, //json encode the filter query
            local: local, //default to 'true' (local filtering)
            filters: [
                {
                    type: 'string',
                    dataIndex: 'tech_layer_name',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'abstract',
                    disabled: false
                },
                {
                    type: 'numeric',
                    dataIndex: 'datenstand',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'url_portale',
                    disabled: false
                },
                {
                    type: 'numeric',
                    dataIndex: 'geobasisdaten_num',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'wms_url',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'geoadmin_inspire_group',
                    disabled: false
                },
                {
                    type: 'boolean',
                    dataIndex: 'georeferenzdaten_bool',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'url_download',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'geocat',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'geobasisdaten_tech_number',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'rechtsgrundlage',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'geoadmin_inspire_theme',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'projekte',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'bezeichnung_geobasisdaten_katalog',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'zustaendige_stelle',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'fachstelle_bund',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'inspire_num',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'inspire_name_public',
                    disabled: false
                },
                {
                    type: 'boolean',
                    dataIndex: 'oereb_bool',
                    disabled: false
                },
                {
                    type: 'boolean',
                    dataIndex: 'download_bool',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'geobasisdaten_sammlung_bundesrecht_bezeichnung',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'geoadmin_kurz_bez',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'geoadmin_bezeichnung',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'zugangberechtigung',
                    disabled: false
                },
                {
                    type: 'boolean',
                    dataIndex: 'ausser_kraft_bool',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'termin_minimalmodell',
                    disabled: false
                }
                /*commented out for Personal Data protection
                 ,
                 {
                 type: 'string',
                 dataIndex: 'ansprechperson',
                 disabled: false
                 }
                 */
            ]
        });

        var reorderer = new Ext.ux.ToolbarReorderer();
        var droppable = new Ext.ux.ToolbarDroppable({
            createItem: function(sampleData) {
                var column = this.getColumnFromDragDrop(sampleData);

                return createSorterButton({
                    text: column.header,
                    sortData: {
                        field: column.dataIndex,
                        direction: "ASC"
                    }
                });
            },

            canDrop: function(dragSource, event, sampleData) {
                var sorters = getSorters(),
                    column = this.getColumnFromDragDrop(sampleData);
                for (var i = 0; i < sorters.length; i++) {
                    if (sorters[i].field == column.dataIndex) return false;
                }

                return true

            },
            afterLayout: doSort,

            getColumnFromDragDrop: function(sampleData) {

                var index = sampleData.header.cellIndex,
                    colModel = bodGridColModel,
                    column = bodGridColModel.getColumnById(bodGridColModel.getColumnId(index + 1));
                return column;
            }
        });

        Ext.override(Ext.grid.ColumnModel, {
            moveColumn: function(oldIndex, newIndex) {
                if (this.isMovable(oldIndex)) {
                    var c = this.config[oldIndex];
                    this.config.splice(oldIndex, 1);
                    this.config.splice(newIndex, 0, c);
                    this.dataMap = null;
                    this.fireEvent("columnmoved", this, oldIndex, newIndex);
                }
            },

            isMovable: function(col) {
                if (typeof this.config[col].movable == "undefined") {
                    return this.enableColumnMove || true;
                }
                return this.config[col].movable;
            }
        });

        var qTipTpl = new Ext.XTemplate(
            '<h3>Abstract:</h3>',
            '<tpl for=".">',
            '<div>{value}</div>',
            '</tpl>'
        );


        var bodGridColModel = new Ext.ux.grid.LockingColumnModel([
            new Ext.grid.RowNumberer({movable: false,
                locked: true,
                width: 30,
                id: 'rownumberercolumn',
                css: 'padding: 3px 3px 3px 4px;'
            }),
            {
                dataIndex: 'tech_layer_name',
                header: OpenLayers.i18n('tech_layer_name'),
                id: 'tech_layer_name',
                sortable: true,
                filterable: true,
                xtype: 'gridcolumn',
                width: 150,
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'abstract',
                id: 'abstract',
                header: OpenLayers.i18n('abstract'),
                sortable: true,
                filterable: true,
                xtype: 'gridcolumn',
                width: 50,
                renderer: function(value, metadata) {
                    metadata.attr = 'ext:qtip="' + value + '"';
                    return value;
                    /* if (!value) {
                    return '';
                    } else {
                    return '<img src="' + textLogo + '">';
                    }     */
        },
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'datenstand',
                id: 'datenstand',
                header: OpenLayers.i18n('datenstand'),
                sortable: true,
                filterable: true,
                xtype: 'gridcolumn',
                width: 75,
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'url_portale',
                id: 'url_portale',
                header: OpenLayers.i18n('url_portale'),
                sortable: true,
                filterable: true,
                xtype: 'gridcolumn',
                width: 75,
                renderer: function (value, metadata) {
                    if (!value) {
                        return '<img border="0" height="16" src="' + dummyLogo + '"/>';
                        //return ''
                    } else {
                        return '<a href="' + value + '" target="_blank"> <img border="0" height="16" src="' + chLogo + '"/></a>';
                    }
                }
            },
            {
                dataIndex: 'geobasisdaten_num',
                id: 'geobasisdaten_num',
                header: OpenLayers.i18n('geobasisdaten_num'),
                sortable: true,
                filterable: true,
                xtype: 'gridcolumn',
                width: 75,
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'wms_url',
                id: 'wms_url',
                header: OpenLayers.i18n('wms_url'),
                sortable: true,
                filterable: true,
                xtype: 'gridcolumn',
                width: 75,
                renderer: function (value, metadata) {
                    if (!value) {
                        return '<img border="0" height="16" src="' + dummyLogo + '"/>';
                    } else {
                        return '<a href="' + value + '" target="_blank"> <img border="0" height="16" style="border:none;" src="' + chLogo + '"/></a>';
                    }
                }
            },
            {
                dataIndex: 'geoadmin_inspire_group',
                id: 'geoadmin_inspire_group',
                header: OpenLayers.i18n('geoadmin_inspire_group'),
                sortable: true,
                filterable: true,
                xtype: 'gridcolumn',
                width: 150,
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'georeferenzdaten_bool',
                id: 'georeferenzdaten_bool',
                header: OpenLayers.i18n('georeferenzdaten_bool'),
                sortable: true,
                filterable: true,
                xtype: 'gridcolumn',
                width: 75,
                renderer:function(value) {
                    return(value == true) ? 'X' : ''
                },
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'url_download',
                id: 'url_download',
                header: OpenLayers.i18n('url_download'),
                sortable: true,
                filterable: true,
                type: 'string',
                width: 75,
                 renderer: function (value, metadata) {
                    if (!value) {
                        return '<img border="0" height="16" src="' + dummyLogo + '"/>';
                    } else {
                        return '<a href="' + value + '" target="_blank"> <img border="0" height="16" style="border:none;" src="' + chLogo + '"/></a>';
                    }
                }
            },
            {
                dataIndex: 'geocat',
                id: 'geocat',
                header: OpenLayers.i18n('geocat'),
                sortable: true,
                filterable: true,
                type: 'string',
                width: 75,
                renderer: function (value, metadata) {
                    if (!value) {
                        return '<img border="0" height="16" src="' + dummyLogo + '"/>';
                    } else {
                        return '<a href="http://www.geocat.ch/geonetwork/srv/deu/metadata.show?fileIdentifier=' + value + '&currTab=simple" target="_blank"> <img border="0" height="16" style="border:none;" src="' + chLogo + '"/></a>';
                    }
                }
            },
            {
                dataIndex: 'geobasisdaten_tech_number',
                id: 'geobasisdaten_tech_number',
                header: OpenLayers.i18n('geobasisdaten_tech_number'),
                sortable: true,
                filterable: true,
                type: 'string',
                width: 75,
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'rechtsgrundlage',
                id: 'rechtsgrundlage',
                header: OpenLayers.i18n('rechtsgrundlage'),
                sortable: true,
                filterable: true,
                type: 'string',
                width: 150,
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'geoadmin_inspire_theme',
                id: 'geoadmin_inspire_theme',
                header: OpenLayers.i18n('geoadmin_inspire_theme'),
                sortable: true,
                filterable: true,
                type: 'string',
                width: 150,
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'projekte',
                id: 'projekte',
                header: OpenLayers.i18n('projekte'),
                sortable: true,
                filterable: true,
                type: 'string',
                width: 75,
                renderer: function (value, metadata) {
                    if (!value) {
                        return '<img border="0" height="16" src="' + dummyLogo + '"/>';
                    } else {
                        portals = value.split(',');
                        elem=portals.length;
                        apiPortal = '';
                        geoPortal = '';
                        arePortal = '';
                        bafuPortal = '';
                        for (i=0;i<elem;i++) {
                            if (portals[i]=="mf-geoadmin2") {
                                 apiPortal = '<a href="' + (GeoAdmin.protocol ? GeoAdmin.protocol : 'http:') +  '//api.geo.admin.ch" target="_blank"> <img border="0" height="16" style="border:none;" src="' + chLogo + '"/></a> ';
                                 geoPortal = '<a href="' + (GeoAdmin.protocol ? GeoAdmin.protocol : 'http:') +   + '//map.geo.admin.ch" target="_blank"> <img border="0" height="16" style="border:none;" src="' + chLogo + '"/></a> ';
                            } else if (portals[i]=="mf-are2") {
                                 arePortal = '<a href="http://map.are.admin.ch" target="_blank"> <img border="0" height="16" style="border:none;" src="' + chLogo + '"/></a> ';
                            } else if (portals[i]=="mf-bafu") {
                                 bafuPortal = '<a href="http://map.bafu.admin.ch" target="_blank"> <img border="0" height="16" style="border:none;" src="' + chLogo + '"/></a> ';
                            }
                        }
                        return apiPortal + geoPortal + arePortal + bafuPortal;
                    }
                }
            },
            {
                dataIndex: 'bezeichnung_geobasisdaten_katalog',
                id: 'bezeichnung_geobasisdaten_katalog',
                header: OpenLayers.i18n('bezeichnung_geobasisdaten_katalog'),
                sortable: true,
                filterable: true,
                type: 'string',
                width: 150,
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'zustaendige_stelle',
                id: 'zustaendige_stelle',
                header: OpenLayers.i18n('zustaendige_stelle'),
                sortable: true,
                filterable: true,
                type: 'string',
                width: 75,
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'fachstelle_bund',
                id: 'fachstelle_bund',
                header: OpenLayers.i18n('fachstelle_bund'),
                sortable: true,
                filterable: true,
                type: 'string',
                width: 75,
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'inspire_num',
                id: 'inspire_num',
                header: OpenLayers.i18n('inspire_num'),
                sortable: true,
                filterable: true,
                type: 'string',
                width: 75,
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'inspire_name_public',
                id: 'inspire_name_public',
                header: OpenLayers.i18n('inspire_name_public'),
                sortable: true,
                filterable: true,
                type: 'string',
                width: 150,
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'oereb_bool',
                id: 'oereb_bool',
                header: OpenLayers.i18n('oereb_bool'),
                sortable: true,
                filterable: true,
                type: 'boolean',
                width: 75,
                renderer:function(value) {
                    return(value == true) ? 'X' : ''
                },
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'download_bool',
                id: 'download_bool',
                header: OpenLayers.i18n('download_bool'),
                sortable: true,
                filterable: true,
                type: 'boolean',
                width: 75,
                renderer:function(value) {
                    return(value == true) ? 'X' : ''
                },
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'geobasisdaten_sammlung_bundesrecht_bezeichnung',
                id: 'geobasisdaten_sammlung_bundesrecht_bezeichnung',
                header: OpenLayers.i18n('geobasisdaten_sammlung_bundesrecht_bezeichnung'),
                sortable: true,
                filterable: true,
                type: 'string',
                width: 150,
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'geoadmin_kurz_bez',
                id: 'geoadmin_kurz_bez',
                header: OpenLayers.i18n('geoadmin_kurz_bez'),
                sortable: true,
                filterable: true,
                type: 'string',
                width: 150,
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'geoadmin_bezeichnung',
                id: 'geoadmin_bezeichnung',
                header: OpenLayers.i18n('geoadmin_bezeichnung'),
                sortable: true,
                filterable: true,
                type: 'string',
                width: 150,
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'zugangberechtigung',
                id: 'zugangberechtigung',
                header: OpenLayers.i18n('zugangberechtigung'),
                sortable: true,
                filterable: true,
                type: 'string',
                width: 75,
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'ausser_kraft_bool',
                id: 'ausser_kraft_bool',
                header: OpenLayers.i18n('ausser_kraft_bool'),
                sortable: true,
                filterable: true,
                type: 'boolean',
                width: 75,
                renderer:function(value) {
                    return(value == true) ? 'X' : ''
                },
                css: 'padding: 3px 0px 3px 0px;'
            },
            {
                dataIndex: 'termin_minimalmodell',
                id: 'termin_minimalmodell',
                header: OpenLayers.i18n('termin_minimalmodell'),
                sortable: true,
                filterable: true,
                type: 'string',
                width: 150,
                css: 'padding: 3px 0px 3px 0px;'
            }

            /*commented out for Personal Data protection
             ,
             {
             dataIndex: 'ansprechperson',
             id: 'ansprechperson',
             header: OpenLayers.i18n('ansprechperson'),
             sortable: true,
             filterable: true,
             type: 'string',
             width: 150,
             css: 'padding: 3px 0px 3px 0px;'
             }
             */
        ]);
        var bufferview = new Ext.ux.grid.BufferView({
            scrolldelay: false
        });
        //var lockingView = new Ext.ux.grid.LockingGridView();

        var bodLoadMask = new Ext.LoadMask(Ext.getBody(), {msg:"Loading data..."});
        bodLoadMask.show();

        /**
         *
         *  Base64 encode / decode
         *  http://www.webtoolkit.info/
         *
         **/

        var Base64 = {

            // private property
            _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

            // public method for encoding
            encode : function (input) {
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;

                input = Base64._utf8_encode(input);

                while (i < input.length) {

                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

                }

                return output;
            },

            // public method for decoding
            decode : function (input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;

                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                while (i < input.length) {

                    enc1 = this._keyStr.indexOf(input.charAt(i++));
                    enc2 = this._keyStr.indexOf(input.charAt(i++));
                    enc3 = this._keyStr.indexOf(input.charAt(i++));
                    enc4 = this._keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                }

                output = Base64._utf8_decode(output);

                return output;

            },

            // private method for UTF-8 encoding
            _utf8_encode : function (string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";

                for (var n = 0; n < string.length; n++) {

                    var c = string.charCodeAt(n);

                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    }
                    else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }

                }

                return utftext;
            },

            // private method for UTF-8 decoding
            _utf8_decode : function (utftext) {
                var string = "";
                var i = 0;
                var c = c1 = c2 = 0;

                while (i < utftext.length) {

                    c = utftext.charCodeAt(i);

                    if (c < 128) {
                        string += String.fromCharCode(c);
                        i++;
                    }
                    else if ((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i + 1);
                        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                    }
                    else {
                        c2 = utftext.charCodeAt(i + 1);
                        c3 = utftext.charCodeAt(i + 2);
                        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                    }

                }

                return string;
            }

        };

        var chLogo = 'https://dav0.bgdi.admin.ch/swisstopo/cms2007/geoadmin/chLogo.png';
        var dummyLogo = 'https://dav0.bgdi.admin.ch/swisstopo/cms2007/geoadmin/chLogo.png';

        var tbar = new Ext.Toolbar({
            items: [OpenLayers.i18n('Sorting_order'), '-'
            ],
            plugins: [reorderer, droppable],
            //plugins: [droppable],
            listeners: {
                scope: this,
                reordered: function(button) {
                    changeSortDirection(button, false);
                }
            }
        });
        var bbar = new Ext.Toolbar({
                //pageSize: 20,
                //store: bodStore,
                //displayInfo: true,
                //displayMsg: OpenLayers.i18n('layers' + {0} + ' - ' + {1} 'de ' {2}),
                //buttons: [
                buttons: [
                     {
                        id: 'grid-excel-button',
                        text: OpenLayers.i18n('Export'),
                        grid: this,
                        handler: function(b, e) {
                            if (!Ext.isIE) {
                                document.location = 'data:application/vnd.ms-excel;base64,' + Base64.encode(b.grid.getExcelXml())
                            } else {
                                Ext.Msg.show({
                                    title: 'Warning',
                                    msg: OpenLayers.i18n('ExportFromIE'),
                                    icon: Ext.MessageBox.WARNING
                                });
                            }
                        }
                    }
                ]
            });

        config = Ext.apply({
            id: 'bodGrid',
            tbar: tbar,
            bbar: bbar,
            border: false,
            store: bodStore,
            //colModel: bodGridColModel,
            plugins: [filters, 'autosizecolumns'],
            stripeRows: true,
            sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
            //view: lockingView,
            view: bufferview,
            height: 200,
            split: true,
            region: 'north',
            loadMask: bodLoadMask,
            listeners: {
                scope: this,
                render: function() {
                    var dragProxy = this.getView().columnDrag,
                        ddGroup = dragProxy.ddGroup;
                    droppable.addDDGroup(ddGroup);
                }
            }

        }, config);

        function doSort() {
            bodStore.sort(getSorters(), "ASC");
        }

        function changeSortDirection(button, changeDirection) {
            var sortData = button.sortData,
                iconCls = button.iconCls;

            if (sortData != undefined) {
                if (changeDirection !== false) {
                    button.sortData.direction = button.sortData.direction.toggle("ASC", "DESC");
                    button.setIconClass(iconCls.toggle("sort-asc", "sort-desc"));
                }
                bodStore.clearFilter();
                doSort();
            }
        }

        function getSorters() {
            var sorters = [];
            Ext.each(tbar.findByType('button'), function(button) {
                sorters.push(button.sortData);
            }, this);
            return sorters;
        }

        function createSorterButton(config) {
            config = config || {};

            Ext.applyIf(config, {
                listeners: {
                    click: function(button, e) {
                        changeSortDirection(button, true);
                    }
                },
                iconCls: 'sort-' + config.sortData.direction.toLowerCase(),
                reorderable: true
            });
            return new Ext.Button(config);
        }


        GeoAdmin.BodGrid.superclass.constructor.call(this, config);
    },




    getExcelXml: function(includeHidden) {
        var worksheet = this.createWorksheet(includeHidden);
        var totalWidth = this.getColumnModel().getTotalWidth(includeHidden);
        return '<xml version="1.0" encoding="utf-8">' +
            '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:o="urn:schemas-microsoft-com:office:office">' +
            '<o:DocumentProperties><o:Title>' + this.title + '</o:Title></o:DocumentProperties>' +
            '<ss:ExcelWorkbook>' +
            '<ss:WindowHeight>' + worksheet.height + '</ss:WindowHeight>' +
            '<ss:WindowWidth>' + worksheet.width + '</ss:WindowWidth>' +
            '<ss:ProtectStructure>False</ss:ProtectStructure>' +
            '<ss:ProtectWindows>False</ss:ProtectWindows>' +
            '</ss:ExcelWorkbook>' +
            '<ss:Styles>' +
            '<ss:Style ss:ID="Default">' +
            '<ss:Alignment ss:Vertical="Top" ss:WrapText="1" />' +
            '<ss:Font ss:FontName="arial" ss:Size="10" />' +
            '<ss:Borders>' +
            '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Top" />' +
            '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Bottom" />' +
            '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Left" />' +
            '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Right" />' +
            '</ss:Borders>' +
            '<ss:Interior />' +
            '<ss:NumberFormat />' +
            '<ss:Protection />' +
            '</ss:Style>' +
            '<ss:Style ss:ID="title">' +
            '<ss:Borders />' +
            '<ss:Font />' +
            '<ss:Alignment ss:WrapText="1" ss:Vertical="Center" ss:Horizontal="Center" />' +
            '<ss:NumberFormat ss:Format="@" />' +
            '</ss:Style>' +
            '<ss:Style ss:ID="headercell">' +
            '<ss:Font ss:Bold="1" ss:Size="10" />' +
            '<ss:Alignment ss:WrapText="1" ss:Horizontal="Center" />' +
            '<ss:Interior ss:Pattern="Solid" ss:Color="#58ACFA" />' +
            '</ss:Style>' +
            '<ss:Style ss:ID="even">' +
            '<ss:Interior ss:Pattern="Solid" ss:Color="#FFFFFF" />' +
            '</ss:Style>' +
            '<ss:Style ss:Parent="even" ss:ID="evendate">' +
            '<ss:NumberFormat ss:Format="[ENG][$-409]dd\-mmm\-yyyy;@" />' +
            '</ss:Style>' +
            '<ss:Style ss:Parent="even" ss:ID="evenint">' +
            '<ss:NumberFormat ss:Format="0" />' +
            '</ss:Style>' +
            '<ss:Style ss:Parent="even" ss:ID="evenfloat">' +
            '<ss:NumberFormat ss:Format="0.00" />' +
            '</ss:Style>' +
            '<ss:Style ss:ID="odd">' +
            '<ss:Interior ss:Pattern="Solid" ss:Color="#D8D8D8" />' +
            '</ss:Style>' +
            '<ss:Style ss:Parent="odd" ss:ID="odddate">' +
            '<ss:NumberFormat ss:Format="[ENG][$-409]dd\-mmm\-yyyy;@" />' +
            '</ss:Style>' +
            '<ss:Style ss:Parent="odd" ss:ID="oddint">' +
            '<ss:NumberFormat ss:Format="0" />' +
            '</ss:Style>' +
            '<ss:Style ss:Parent="odd" ss:ID="oddfloat">' +
            '<ss:NumberFormat ss:Format="0.00" />' +
            '</ss:Style>' +
            '</ss:Styles>' +
            worksheet.xml +
            '</ss:Workbook>';
    },

    createWorksheet: function(includeHidden) {
        // Calculate cell data types and extra class names which affect formatting
        //var grid = Ext.getCmp('bodGrid');
        var cellType = [];
        var cellTypeClass = [];
        var cm = this.getColumnModel();
        var totalWidthInPixels = 0;
        var colXml = '';
        var headerXml = '';
        for (var i = 1; i < cm.getColumnCount(); i++) {
            if (includeHidden || !cm.isHidden(i)) {

                var w = cm.getColumnWidth(i);
                totalWidthInPixels += w;
                colXml += '<ss:Column ss:AutoFitWidth="1" ss:Width="' + w + '" />';
                headerXml += '<ss:Cell ss:StyleID="headercell">' +
                    '<ss:Data ss:Type="String">' + cm.getColumnHeader(i) + '</ss:Data>' +
                    '<ss:NamedCell ss:Name="Print_Titles" /></ss:Cell>';
                var fld = this.store.recordType.prototype.fields.get(cm.getDataIndex(i));
                switch (fld.type.type) {
                    case "boolean":
                        cellType.push("String");
                        cellTypeClass.push("");
                        break;
                    case "String":
                        cellType.push("String");
                        cellTypeClass.push("");
                        break;
                    default:
                        cellType.push("String");
                        cellTypeClass.push("");
                        break;
                }
            }
        }
        var visibleColumnCount = cellType.length;

        var result = {
            height: 9000,
            width: Math.floor(totalWidthInPixels * 30) + 50
        };

        // Generate worksheet header details.
        var t = '<ss:Worksheet ss:Name="' + this.title + '">' +
            '<ss:Names>' +
            '<ss:NamedRange ss:Name="Print_Titles" ss:RefersTo="=\'' + this.title + '\'!R1:R2" />' +
            '</ss:Names>' +
            '<ss:Table x:FullRows="1" x:FullColumns="1"' +
            ' ss:ExpandedColumnCount="' + visibleColumnCount +
            '" ss:ExpandedRowCount="' + (this.store.getCount() + 2) + '">' +
            colXml +
            '<ss:Row ss:Height="38">' +
            '<ss:Cell ss:StyleID="title" ss:MergeAcross="' + (visibleColumnCount - 1) + '">' +
            '<ss:Data xmlns:html="http://www.w3.org/TR/REC-html40" ss:Type="String">' +
            '<html:B>BGDI Export</html:B></ss:Data><ss:NamedCell ss:Name="Print_Titles" />' +
            '</ss:Cell>' +
            '</ss:Row>' +
            '<ss:Row ss:AutoFitHeight="1">' +
            headerXml +
            '</ss:Row>';

        // Generate the data rows from the data in the Store
        for (var iforcreateworksheet = 0, it = this.store.data.items, l = it.length; iforcreateworksheet < l; iforcreateworksheet++) {
            t += '<ss:Row>';
            var cellClass = (iforcreateworksheet & 1) ? 'odd' : 'even';
            var r = it[iforcreateworksheet].data;
            var k = 0;
            for (var j = 1; j < cm.getColumnCount(); j++) {
                if (includeHidden || !cm.isHidden(j)) {
                    var v = r[cm.getDataIndex(j)];
                    t += '<ss:Cell ss:StyleID="' + cellClass + cellTypeClass[k] + '"><ss:Data ss:Type="' + cellType[k] + '">';
                    if (cellType[k] == 'DateTime') {
                        t += '<![CDATA[' + v.format('Y-m-d') + ']]>';       // <![CDATA[ ... ]] is needed to tell the xml parser to ignore the cell text
                    } else {
                        t += '<![CDATA[' + v + ']]>'

                    }
                    t += '</ss:Data></ss:Cell>';
                    k++;
                }
            }
            t += '</ss:Row>';
        }

        result.xml = t + '</ss:Table>' +
            '<x:WorksheetOptions>' +
            '<x:PageSetup>' +
            '<x:Layout x:CenterHorizontal="1" x:Orientation="Landscape" />' +
            '<x:Footer x:Data="Page &amp;P of &amp;N" x:Margin="0.5" />' +
            '<x:PageMargins x:Top="0.5" x:Right="0.5" x:Left="0.5" x:Bottom="0.8" />' +
            '</x:PageSetup>' +
            '<x:FitToPage />' +
            '<x:Print>' +
            '<x:PrintErrors>Blank</x:PrintErrors>' +
            '<x:FitWidth>1</x:FitWidth>' +
            '<x:FitHeight>32767</x:FitHeight>' +
            '<x:ValidPrinterInfo />' +
            '<x:VerticalResolution>600</x:VerticalResolution>' +
            '</x:Print>' +
            '<x:Selected />' +
            '<x:DoNotDisplayGridlines />' +
            '<x:ProtectObjects>False</x:ProtectObjects>' +
            '<x:ProtectScenarios>False</x:ProtectScenarios>' +
            '</x:WorksheetOptions>' +
            '</ss:Worksheet>';
        return result;
    }


});

/** api: xtype = ga_bodgrid */
Ext.reg("ga_bodgrid", GeoAdmin.BodGrid);
