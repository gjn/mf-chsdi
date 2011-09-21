/* global GeoAdmin:true, OpenLayers: true, Ext:true */
/*
 * @include WmsBrowser/lib/WmsBrowser.js
 * @include Measure/lib/Measure.js
 * @include KmlSelector/lib/KmlSelector.js
 * @include OpenLayers/Lang.js
 * @require Permalink/lib/Permalink.js
 */

Ext.ns("GeoAdmin");

GeoAdmin.BaseTools = Ext.extend(Ext.Container, {

    /** api: config[mapPanel]
     *  ``GeoExt.MapPanel``
     *  A `GeoExt.MapPanel <http://geoext.org/lib/GeoExt/widgets/MapPanel.html>`_ instance
     */
    mapPanel: null,

    layout: 'column',

    cls: 'geoadmin-basetool',

    constructor : function(config) {
        this.mapPanel = config.mapPanel;

        var permalink = new GeoAdmin.PermalinkPanel({'hidden': true});
        this.permalinkAction = new Ext.Button({
            text: OpenLayers.i18n('permalink action'),
            cls: 'x-btn-no-over permalink',
            iconAlign: 'right',
            enableToggle: true,
            toggleGroup: 'tools',
            toggleHandler: function(btn, state) {
                permalink.setVisible(state);
            }
        });
        permalink.on('hide', function(p) {
            this.toggle(false, true);
        }, this.permalinkAction);


        this.advancedMenu = new Ext.Button({
            cls: 'x-btn-no-over',
            iconAlign: 'right',
            iconCls: 'tools',
            enableToggle: true,
            toggleGroup: 'tools',
            menu: [
                new GeoAdmin.KmlSelector({map: this.mapPanel.map}),
                new GeoAdmin.Measure({map: this.mapPanel.map}),
                new GeoAdmin.WmsBrowser({layerStore: this.mapPanel.layers})
            ]
        });

        this.printAction = this.createPrintAction({mapPanel: this.mapPanel});

        var print = new Ext.Panel({
            cls: 'print-panel',
            id: 'print-panel',
            style: 'visibility: hidden'
        });
        this.mapPanel.add(print);
        this.mapPanel.add(permalink);


        GeoAdmin.BaseTools.superclass.constructor.call(this, config);
    },

    getTools: function() {
        return [this.permalinkAction, this.advancedMenu,  this.printAction ]
    },

    addToToolbar: function(tbar) {
        if (tbar instanceof Ext.Toolbar) {
            var tools = this.getTools();
            for (var i = 0; i < tools.length; i++) {
                tbar.add(tools[i]);
            }
            return tbar;
        }
    },
    createPrintAction: function(options) {
        return new GeoAdmin.Print({
            printPanelOptions: {
                mapPanel: mapPanel,
                renderTo: "print-panel",
                title: OpenLayers.i18n("mf.print.print.title"),
                tbar: ["->", {
                    iconCls: "close-button",
                    handler: function() {
                        this.printAction.printPanel.container.setVisible(false);
                        this.printAction.printPanel.hideExtent();
                        this.printAction.printLayer.setVisibility(false);
                    },
                    scope: this
                }]
            },
            toggleGroup: 'tools',
            cls: 'x-btn-no-over',
            printBaseUrl: GeoAdmin.printBaseUrl || 'print/pdf/',
            iconAlign: 'right',
            iconCls: 'print',
            enableToggle: true
        });
    }
});

/** api: xtype = ga_basetools */
Ext.reg("ga_basetools", GeoAdmin.BaseTools);
