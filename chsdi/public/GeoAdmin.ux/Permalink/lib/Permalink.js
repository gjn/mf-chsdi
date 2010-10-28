/**
 * @requires Permalink/lib/PermalinkProvider.js
 */

Ext.namespace('GeoAdmin');

// create the permalink provider and set it into
// the state manager
Ext.state.Manager.setProvider(
    new GeoAdmin.PermalinkProvider());

/**
 *
 */
GeoAdmin.PermalinkField = Ext.extend(Ext.form.TextField, {
    autoHeight: true,
    width: 440,

    initComponent: function() {
        var provider = Ext.state.Manager.getProvider();
        this.value = provider.getLink();
        this.fieldLabel = OpenLayers.i18n("URL");

        GeoAdmin.PermalinkField.superclass.initComponent.apply(this, arguments);

        this.on("focus", this.selectText, this);
        provider.on("statechange", this.onProviderStatechange, this);
    },

    beforeDestroy: function() {
        var provider = Ext.state.Manager.getProvider();
        provider.un("statechange", this.onProviderStatechange, this);
    },

    onProviderStatechange: function(provider) {
        this.setValue(provider.getLink());
    }
});

/**
 *
 */
GeoAdmin.PermalinkPanel = Ext.extend(Ext.form.FormPanel, {
    border: false,
    width: 450,
    cls: "permalink-panel",
    ctCls: "permalink-panel-ct",
    baseCls: "permalink-panel",
    labelAlign: "top",
    closeButtonToggleGroup: "export",

    initComponent: function() {
        this.title = OpenLayers.i18n("Map URL");
        this.items = new GeoAdmin.PermalinkField();
        this.tbar = ["->", {
            iconCls: "close-button", 
            toggleGroup: this.closeButtonToggleGroup,
            handler: function() { this.hide(); },
            scope: this
        }];
        GeoAdmin.PermalinkPanel.superclass.initComponent.apply(
            this, arguments);
    },

    afterRender: function() {
        GeoAdmin.PermalinkPanel.superclass.afterRender.apply(
            this, arguments);
        // we want to swallow events not to have the map move
        // when mouse actions occur on this panel
        this.body.swallowEvent([
            "mousedown", "mousemove", "mouseup", "click", "dblclick"
        ]);
    }
});
Ext.reg("ga_permalinkpanel", GeoAdmin.PermalinkPanel);

/**
 */
GeoAdmin.PermalinkWindow = Ext.extend(Ext.Window, {

    initComponent: function() {

        this.layout = 'fit';
        this.title = OpenLayers.i18n('Permalink.title');
        this.closeAction = 'hide';

        var provider = Ext.state.Manager.getProvider();

        this.items = [new Ext.form.TextField({
            hideLabel: true,
            autoHeight: true,
            listeners: {
                'focus': function() {
                    this.selectText();
                }
            },
            value: provider.getLink()
        })];

        provider.on({
            statechange: function(provider) {
                this.get(0).setValue(provider.getLink());
            },
            scope: this
        });

        this.buttons = [{
            text: OpenLayers.i18n('Permalink.openlink'),
            handler: function() {
                window.open(this.get(0).getValue());
                this.hide();
            },
            scope: this
        }, {
            text: OpenLayers.i18n('Permalink.close'),
            handler: function() {
                this.hide();
            },
            scope: this
        }];

        GeoAdmin.PermalinkWindow.superclass.initComponent.apply(this, arguments);
    }
});

/**
 */
GeoAdmin.Permalink = Ext.extend(Ext.Action, {

    /**
     */
    constructor : function(config) {

        var permalinkWindow = new GeoAdmin.PermalinkWindow({
            width: 400,
            renderTo: Ext.getBody()
        });

        config = Ext.apply({
            allowDepress: false,
            iconCls: 'permalink',
            text: OpenLayers.i18n('Permalink'),
            handler: function() {
                permalinkWindow.show()
            }
        }, config);

        GeoAdmin.Permalink.superclass.constructor.call(this, config);
    }
});
