/*global GeoAdmin:true, OpenLayers: true, Ext:true */


/**
 * @include OpenLayers/Control/ArgParser.js
 * @include OpenLayers/Format/WMSCapabilities.js
 * @include OpenLayers/Format/WMSCapabilities/v1.js
 * @include OpenLayers/Format/WMSCapabilities/v1_1.js
 * @include OpenLayers/Format/WMSCapabilities/v1_1_0.js
 * @include OpenLayers/Format/WMSCapabilities/v1_1_1.js
 * @include OpenLayers/Format/WMSCapabilities/v1_3.js
 * @include OpenLayers/Format/WMSCapabilities/v1_3_0.js
 * @include GeoExt/data/LayerReader.js
 * @include GeoExt/data/LayerRecord.js
 * @include GeoExt/data/WMSCapabilitiesReader.js
 * @include GeoExt/data/WMSCapabilitiesStore.js
 */


Ext.namespace("Ext.data.Store");

Ext.data.Store.prototype.getValueArray = function(value) {
    var aszValues = [];
    var nValues = this.getCount();
    for (var i = 0; i < nValues; i++) {
        aszValues.push(this.getAt(i).get(value));
    }
    return aszValues;
};

Ext.namespace("GeoAdmin");

GeoAdmin.WmsBrowserPanel = Ext.extend(Ext.Panel, {
    layout: 'absolute',
    cls: 'wmsbrowser',
    minWidth: 300,
    minHeight: 200,
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    useIcons: false,
    layerStore: null,
    serverStore: null,
    serverStoreDisplayField: 'url',
    capabilitiesParams: {},
    defaultCapabilitiesParams: {
        'service': "WMS",
        'request': "GetCapabilities",
        'version': '1.1.1'
    },
    gridPanelOptions: {
        'height': 200
    },
    layerOptions: null,
    zoomOnLayerAdded: false,
    closeOnLayerAdded: false,
    allowInvalidUrl: false,
    currentUrl: null,
    constructor: function(config) {
        this.serverStore = config.serverStore || null;
        this.gridPanelOptions = config.gridPanelOptions || this.gridPanelOptions;
        this.layerOptions = config.layerOptions || this.layerOptions;
        OpenLayers.Util.applyDefaults(this.capabilitiesParams, this.defaultCapabilitiesParams);
        this.initMyItems();
        this.initMyToolbar();
        arguments.callee.superclass.constructor.call(this, config);
        this.on("afterrender", this.onAfterRender, this);
    },
    initMyItems: function() {
        var oItems;
        oItems = [];
        oTopPanel = {
            style: 'padding:2px;margin:2px;',
            region: 'north',
            id: "wms_field_group",
            xtype: 'fieldset',
            layout: 'form',
            border: false,
            collapsible: false,
            anchor: '100%',
            defaults: {
                width: '100%'
            },
            defaultType: 'textfield',
            buttonAlign: 'center',
            items: [],
            buttons: []
        };
        var oURLField;
        if (this.serverStore) {
            oURLField = {
                style: 'padding:0px;margin:0px;',
                columnWidth: 0.85,
                'name': 'wms_url',
                'id': 'wms_url',
                xtype: 'combo',
                store: this.serverStore,
                displayField: this.serverStoreDisplayField,
                typeAhead: true,
                mode: 'local',
                forceSelection: false,
                triggerAction: 'all',
                allowBlank: false,
                validator: this.urlValidator,
                invalidText: OpenLayers.i18n('The url address entered is not valid.'),
                emptyText: OpenLayers.i18n('Select or input a server address (URL)'),
                selectOnFocus: true
            };
        } else {
            oURLField = {
                style: 'padding:0px;margin:0px;',
                xtype: "textfield",
                columnWidth: 0.85,
                layout: 'fit',
                'name': 'wms_url',
                'id': 'wms_url',
                border: false,
                allowBlank: false,
                validator: this.urlValidator,
                invalidText: OpenLayers.i18n('The url address entered is not valid.'),
                'emptyText': OpenLayers.i18n('Input the server address (URL)')
            };
        }
        oTopPanel.items.push({
            style: 'padding:0px;margin:0px;',
            xtype: 'fieldset',
            layout: 'column',
            border: false,
            collapsible: false,
            collapsed: false,
            items: [oURLField, {
                style: 'padding:0 0 0 5;margin:0px;',
                columnWidth: 0.15,
                border: false,
                items: [
                    {
                        width: 'auto',
                        autoWidth: 'true',
                        style: 'padding:0px;margin:0px;',
                        xtype: 'button',
                        text: OpenLayers.i18n('Connect'),
                        scope: this,
                        handler: function(b, e) {
                            if (!GeoAdmin.loadingMask) {
                                GeoAdmin.loadingMask = new Ext.LoadMask(Ext.getBody(), {msg:OpenLayers.i18n('Loading...')});
                            }
                            GeoAdmin.loadingMask.show();
                            this.triggerGetCapabilities();
                        }
                    }
                ]
            }]
        });
        oItems.push(oTopPanel);
        oCenterPanel = {
            style: 'padding:2px;margin:2px;',
            x: 0,
            y: 25,
            xtype: 'form',
            region: 'center',
            id: "wms_capabilities_panel",
            layout: 'column',
            border: false,
            collapsible: false,
            anchor: '100% 100%',
            defaults: {
                width: '100%',
                hideLabel: true
            },
            defaultType: 'textfield',
            buttonAlign: 'center',
            items: []
        };
        this.capStore = new GeoExt.data.WMSCapabilitiesStore({
            'url': "",
            layerOptions: this.layerOptions
        });
        this.capStore.on('load', this.onWMSCapabilitiesStoreLoad, this);
        oCenterPanel.items.push(this.createGridPanel(this.capStore));
        oCenterPanel.items.push(this.createFormPanel());
        oItems.push(oCenterPanel);
        Ext.apply(this, {
            items: oItems
        });
    },
    triggerGetCapabilities: function() {
        var urlField = Ext.getCmp('wms_url');
        var url = urlField.getValue();
        if (!urlField.isValid()) {
            if (!url) {
                alert(OpenLayers.i18n('Please, enter an url in the textbox first'));
                GeoAdmin.loadingMask.hide();
                return;
            } else if (!this.allowInvalidUrl) {
                alert(OpenLayers.i18n('The url address entered is not valid.'));
                GeoAdmin.loadingMask.hide();
                return;
            }
        }
        this.currentUrl = url;
        var urlDomain = this.getHostname(url);
        var params = OpenLayers.Util.getParameterString(this.capabilitiesParams);
        url = OpenLayers.Util.urlAppend(url, params);
        if (OpenLayers.ProxyHost && OpenLayers.String.startsWith(url, "http")) {
            url = OpenLayers.ProxyHost + encodeURIComponent(url);
        }
        this.capStore.proxy.setUrl(url);

        //Attribution
        this.capStore.layerOptions.attribution = urlDomain;
        OpenLayers.Lang[OpenLayers.Lang.getCode()][this.capStore.layerOptions.attribution + ".url"] = 'http://' + urlDomain;
        
        this.capStore.proxy.setApi(Ext.data.Api.actions.read, url);
        this.capStore.load();
    },
    removeAllItemsFromObject: function(object) {
        while (object.items.length != 0) {
            var oItem = object.items.items[0];
            object.remove(oItem, true);
            oItem.destroy();
        }
    },
    getHostname: function(str) {
        return decodeURIComponent(str).match(/:\/\/(.[^/]+)/)[1].toString();
    },
    createGridPanel: function(store) {
        var columns = [
            {
                header: OpenLayers.i18n('Add'),
                dataIndex: "srsCompatible",
                hidden: false,
                renderer: this.boolRenderer,
                width: 80
            },
            {
                header: OpenLayers.i18n('Title'),
                dataIndex: "title",
                id: "title",
                sortable: true
            },
            {
                header: OpenLayers.i18n('Name'),
                dataIndex: "name",
                hidden: true,
                sortable: true
            },
            {
                header: OpenLayers.i18n('Queryable'),
                dataIndex: "queryable",
                sortable: true,
                hidden: true,
                renderer: this.boolRenderer
            },
            {
                header: OpenLayers.i18n('Description'),
                dataIndex: "abstract",
                hidden: true
            }
        ];
        var options = {
            id: 'wms_capabilities_grid_panel',
            columnWidth: 0.5,
            layout: 'fit',
            store: store,
            columns: columns,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true,
                listeners: {
                    rowselect: function(sm, row, rec) {
                        Ext.getCmp("wms_capabilities_panel").getForm().loadRecord(rec);
                    }
                }
            }),
            autoExpandColumn: "title",
            width: 'auto',
            autoWidth: true,
            listeners: {
                rowdblclick: this.mapPreview
            }
        };
        options = OpenLayers.Util.applyDefaults(this.gridPanelOptions, options);
        return new Ext.grid.GridPanel(options);
    },
    createFormPanel: function() {
        var nDescHeight = parseInt(this.gridPanelOptions['height']) - 2;
        var options = {
            style: 'padding:0px;margin:0px;',
            columnWidth: 0.5,
            xtype: 'fieldset',
            labelWidth: 80,
            defaults: Ext.isIE6 ? {
                width: '150px',
                border: false,
                readOnly: true
            } : {
                width: '100%',
                border: false,
                readOnly: true
            },
            defaultType: 'textfield',
            autoHeight: true,
            bodyStyle: Ext.isIE ? 'padding:0 0 0px 0px;' : 'padding:5px 0px;',
            border: false,
            style: {
                "margin-left": "10px",
                "margin-right": Ext.isIE6 ? (Ext.isStrict ? "-10px" : "-13px") : "0"
            },
            items: [
                {
                    xtype: 'textarea',
                    fieldLabel: OpenLayers.i18n('Description'),
                    name: 'abstract',
                    height: nDescHeight
                }
            ]
        };
        return options;
    },
    mapPreview: function(grid, index) {
        var record = grid.getStore().getAt(index);
        var layer = record.get("layer").clone();

        //Prepare a preview with swiss coordinate system
        var myMap = new OpenLayers.Map(null, {
            projection: new OpenLayers.Projection("EPSG:21781"),
            maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
            allOverlays: true,
            units: 'm'
        });
        myMap.addLayer(layer);
        var mapPanel = new GeoExt.MapPanel({
            map: myMap
        });

        mapPanel.map.zoomToExtent(
                OpenLayers.Bounds.fromArray(record.get("llbbox")).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:21781"))
                );

        var win = new Ext.Window({
            title: OpenLayers.i18n('Preview') + ": " + record.get("title"),
            width: 512,
            height: 256,
            layout: "fit",
            items: [
                mapPanel
            ]
        });
        win.show();
    },
    initMyToolbar: function() {
        var items = [];
        items.push('->');
        var actionOptions = {
            handler: this.addLayer,
            scope: this,
            tooltip: OpenLayers.i18n('Add currently selected layer')
        };
        if (this.useIcons === true) {
            actionOptions.iconCls = "gx-wmsbrowser-addlayer";
        } else {
            actionOptions.text = OpenLayers.i18n('Add Layer');
        }
        var action = new Ext.Action(actionOptions);
        items.push(action);
        items.push('-');
        Ext.apply(this, {
            bbar: new Ext.Toolbar(items)
        });
    },
    addLayer: function() {
        var grid = Ext.getCmp('wms_capabilities_grid_panel');
        var record = grid.getSelectionModel().getSelected();
        if (record) {
            if (record.get("srsCompatible") === false) {
                var error = "This layer can't be added to the current map" + " because it doesn't support its projection.";
                alert(OpenLayers.i18n(error));
                return;
            }
            var copy = record.clone();
            copy.data.layer = record.data.layer.clone();
            copy.get("layer").mergeNewParams({
                format: "image/png",
                transparent: "true"
            });
            this.layerStore.add(copy);
            if (this.zoomOnLayerAdded) {
                this.layerStore.map.zoomToExtent(OpenLayers.Bounds.fromArray(copy.get("llbbox")).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection(this.layerStore.map.getProjection())));
            }
            if (this.closeOnLayerAdded && this.ownerCt.getXType() == Ext.Window.xtype) {
                this.closeWindow();
            }
        } else {
            if (grid.store.getTotalCount() > 0) {
                var error = "Please, select a layer from the grid first.";
                alert(OpenLayers.i18n(error));
            } else {
                var error = "Please, enter an url in the textbox " + "then click \'Connect\'.";
                alert(OpenLayers.i18n(error));
            }
        }
    },
    onWMSCapabilitiesStoreLoad: function(store, records, options) {
        var srs = this.layerStore.map.getProjection();
        var grid = Ext.getCmp('wms_capabilities_grid_panel');
        var urlField = Ext.getCmp('wms_url');
        for (var i = 0; i < records.length; i++) {
            var record = records[i];
            if (record.get('srs')[srs.toUpperCase()] === true || OpenLayers.Util.indexOf(record.get('srs'), srs.toUpperCase()) >= 0 ||
                    record.get('srs')[srs.toLowerCase()] === true || OpenLayers.Util.indexOf(record.get('srs'), srs.toLowerCase()) >= 0) {
                record.set("srsCompatible", true);
            } else {
                record.set("srsCompatible", false);
            }
        }
        if (grid.store.getCount() > 0) {
            grid.getSelectionModel().selectRow(0);
            if (urlField.getXType() == Ext.form.ComboBox.xtype) {
                // what is this ?
                var aszUrls = urlField.store.getValueArray('url');
                if (OpenLayers.Util.indexOf(aszUrls, this.currentUrl) == -1) {
                    var record = new Ext.data.Record({
                        'url': this.currentUrl
                    });
                    urlField.store.add([record]);
                }
            }
        }
        GeoAdmin.loadingMask.hide();
    },
    boolRenderer: function(bool) {
        return (bool) ? '<span style="color:green;">' + OpenLayers.i18n("Yes") + '</span>' : '<span style="color:red;">' + OpenLayers.i18n("No") + '</span>';
    },
    onAfterRender: function() {
        if (this.ownerCt.getXType() == Ext.Window.xtype) {
            this.addCloseButton();
        }
    },
    addCloseButton: function() {
        var actionOptions = {
            handler: this.closeWindow,
            scope: this,
            tooltip: OpenLayers.i18n('Close this window')
        };
        if (this.useIcons === true) {
            actionOptions.iconCls = "gx-wmsbrowser-close";
        } else {
            actionOptions.text = OpenLayers.i18n('Close');
        }
        var action = new Ext.Action(actionOptions);
        this.getBottomToolbar().add(action);
    },
    closeWindow: function() {
        this.ownerCt.hide();
    },
    urlValidator: function(url) {
        var result = Ext.form.VTypes.url(url);
        return result;
    }
});

