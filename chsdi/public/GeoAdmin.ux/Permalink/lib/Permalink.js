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
GeoAdmin.Permalink = Ext.extend(Ext.Action, {

    /**
     */
    constructor : function(config) {

        // the text field where the link is displayed
        var permalinkTextField = new Ext.form.TextField({
            hideLabel: true,
            autoHeight: true,
            listeners: {
                'focus': function() {
                    this.selectText();
                }
            }
        });

        // the window including the text field displaying
        // the link, it is shown when the action is
        // triggered
        var permalinkWindow = new Ext.Window({
            layout: 'fit',
            renderTo: Ext.getBody(),
            width: 400,
            closeAction: 'hide',
            plain: true,
            title: OpenLayers.i18n('Permalink.title'),
            items: permalinkTextField,
            buttons: [{
                text: OpenLayers.i18n('Permalink.openlink'),
                handler: function() {
                    window.open(permalinkTextField.getValue());
                    permalinkWindow.hide();
                }
            }, {
                text: OpenLayers.i18n('Permalink.close'),
                handler: function() {
                    permalinkWindow.hide();
                }
            }]
        });

        // registers a statechange listener to update the value
        // of the permalink text field
        Ext.state.Manager.getProvider().on({
            statechange: function(provider) {
                permalinkTextField.setValue(provider.getLink());
            }
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
