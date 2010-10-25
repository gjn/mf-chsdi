/**
 * @requires Permalink/lib/PermalinkProvider.js
 */

Ext.namespace('GeoAdmin');

// create the permalink provider and set it into
// the state manager
Ext.state.Manager.setProvider(
    new GeoAdmin.PermalinkProvider());

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
