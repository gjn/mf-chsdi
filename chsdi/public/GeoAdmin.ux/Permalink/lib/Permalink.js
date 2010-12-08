/**
 * @requires Permalink/lib/PermalinkProvider.js
 */

Ext.namespace('GeoAdmin');



// create the permalink provider and set it into
// the state manager
Ext.state.Manager.setProvider(new GeoAdmin.PermalinkProvider());


GeoAdmin.PermalinkField = Ext.extend(Ext.form.TextField, {
    autoHeight: true,

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

/** api: (define)
 *  module = GeoAdmin
 *  class = PermalinkPanel
 *  base_link = `Ext.form.FormPanel <http://dev.sencha.com/deploy/dev/docs/?class=Ext.form.FormPanel>`_
 */
GeoAdmin.PermalinkPanel = Ext.extend(Ext.form.FormPanel, {
    border: false,
    width: 460,
    cls: "permalink-panel",
    ctCls: "permalink-panel-ct",
    baseCls: "permalink-panel",
    labelAlign: "top",
    closeButtonToggleGroup: "export",

    initComponent: function() {
        this.title = OpenLayers.i18n("Map URL");
        this.items = new GeoAdmin.PermalinkField({width: 440});
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


/** api: (define)
 *  module = GeoAdmin
 *  class = PermalinkWindow
 *  base_link = `Ext.Window <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Window>`_
 */

/** api: example
 *  Sample code to create a permalink window (see also :ref:`permalink`):
 *
 *  .. code-block:: javascript
 *
 *     var mapPanel = new GeoAdmin.MapPanel({
 *         renderTo: "map",
 *         width: 600,
 *         height: 400,
 *         map: new GeoAdmin.Map(),
 *         stateId: "map",
 *         tbar: ["->", new GeoAdmin.Permalink()]
 *     });
 *
 */

GeoAdmin.PermalinkWindow = Ext.extend(Ext.Window, {

    initComponent: function() {

        this.layout = 'fit';
        this.title = OpenLayers.i18n('Permalink.title');
        this.closeAction = 'hide';

        var permalinkField = new GeoAdmin.PermalinkField({hideLabel: true});
        this.items = permalinkField;

        this.buttons = [{
            text: OpenLayers.i18n('Permalink.openlink'),
            handler: function() {
                window.open(permalinkField.getValue());
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

        GeoAdmin.PermalinkWindow.superclass.initComponent.apply(
                this, arguments);
    }
});


/** api: (define)
 *  module = GeoAdmin
 *  class = Permalink
 *  base_link = `Ext.Action <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Action>`_
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
