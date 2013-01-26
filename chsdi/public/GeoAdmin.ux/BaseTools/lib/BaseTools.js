/* global GeoAdmin:true, OpenLayers: true, Ext:true */
/*
 * @include WmsBrowser/lib/WmsBrowser.js
 * @include Measure/lib/Measure.js
 * @include KmlSelector/lib/KmlSelector.js
 * @include Redlining/lib/Redlining.js
 * @include Swipe/lib/SwipeAction.js
 * @include Swipe/lib/Swipe.js
 * @include OpenLayers/Lang.js
 * @requires Permalink/lib/Permalink.js
 * @requires Print/lib/Print.js
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
    /* Parameter used to define whether one wants the email function in the share buttons */
    mail: false,

    noHeader: false,

    constructor : function(config) {
        Ext.apply(this, config);
        this.mapPanel = config.mapPanel;
        Ext.applyIf(config, {menuItems: ['kml', 'measure', 'wms', 'redlining','swipe']});

        if (OpenLayers.Util.getParameters().noHeader) {
            this.noHeader = OpenLayers.Util.getParameters().noHeader;
        }

        var permalink = new GeoAdmin.PermalinkPanel({'hidden': true, 'mail': this.mail});
        this.permalinkAction = new Ext.Button({
            text: OpenLayers.i18n('permalink action'),
            tooltip: OpenLayers.i18n('Permalink.tooltip'),
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


        this.advancedMenu = this.createAdvancedMenu(config);

        this.printAction = this.createPrintAction(config.print);

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
        return [this.permalinkAction, this.advancedMenu, this.printAction ]
    },

    addToToolbar: function(tbar) {
        if (tbar instanceof Ext.Toolbar) {
            var tools = this.getTools();
            for (var i = 0; i < tools.length; i++) {
                if (tools[i])
                    tbar.add(tools[i]);
            }
            return tbar;
        }
    },

    /**
     * Create button with drop-down to select tools
     */
    createAdvancedMenu: function(options) {
        var menu = [];

        for (var i in options.menuItems) {
            var item = options.menuItems[i];
            if (item instanceof Ext.Component || item instanceof Ext.Action) {
                menu.push(item);
            } else {
                switch (item) {
                    case 'kml':
                        menu.push(new GeoAdmin.KmlSelector({map: this.mapPanel.map}));
                        break;
                    case 'measure':
                        menu.push(new GeoAdmin.Measure({map: this.mapPanel.map}));
                        break;
                    case 'wms':
                        menu.push(new GeoAdmin.WmsBrowser({layerStore: this.mapPanel.layers, map: this.mapPanel.map}));
                        break;
                    case 'redlining':
                        menu.push(new GeoAdmin.Redlining({map: this.mapPanel.map}));
                       break;
                    case 'swipe':
                        menu.push(new GeoAdmin.SwipeAction({map: this.mapPanel.map}));
                       break;
                }
            }
        }

        // Manage the header (if noHeader)
        var menuClass = 'advanced-menu';
        if (this.noHeader) {
             menuClass = 'advanced-menu-noheader';
        }

        return  new Ext.Button({
            tooltip: OpenLayers.i18n('AdvancedMenu.tooltip'),
            cls: 'x-btn-no-over',
            iconAlign: 'right',
            iconCls: 'tools',
            allowDepress: false,
            enableToggle: true,
            toggleGroup: 'tools',
            menu: new Ext.menu.Menu({cls: menuClass, items: menu})
        });
    },
    
    /**
     * Creates a button which opens a dialog to set print options and to trigger printing
     */
    createPrintAction: function(options) {
        var options = options || {};
        Ext.apply(options,{
            printPanelOptions: {
                mapPanel: this.mapPanel,
                renderTo: "print-panel",
                title: OpenLayers.i18n("mf.print.print.title"),
                tbar: ["->", {
                    iconCls: "close-button",
                    handler: function() {
                        this.printAction.items[0].pressed = false;
                        this.printAction.pHandler();
                    },
                    scope: this
                }]
            },
            toggleGroup: 'tools',
            tooltip: OpenLayers.i18n('mf.print.tooltip'),
            cls: 'x-btn-no-over',
            printBaseUrl: GeoAdmin.printBaseUrl || 'wsgi/print/pdf/',
            iconAlign: 'right',
            iconCls: 'print',
            enableToggle: true
        });
        return new GeoAdmin.Print(options);
    }
});

/** api: xtype = ga_basetools */
Ext.reg("ga_basetools", GeoAdmin.BaseTools);
