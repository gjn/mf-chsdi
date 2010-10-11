/**
 * @requires Permalink/lib/PermalinkProvider.js
 */

Ext.namespace('GeoAdmin');

GeoAdmin.Permalink = Ext.extend(Ext.Action, {

    constructor : function(config) {
        GeoAdmin.Permalink.superclass.constructor.call(this, config);

        this.permalink_text =  new Ext.form.TextField({
            hideLabel: true,
            autoHeight: true,
            listeners: {
                focus: function() {
                    this.selectText();
                }
            }
        });
        this.window = new Ext.Window({});

        // Registers a statechange listener to update the value
        // of the permalink text field.
        Ext.state.Manager.getProvider().on({
            statechange: function(provider) {
                // FIXME: update this.permalink_text
            }
        });
    },

    handler: function() {}
});

Ext.reg("ga_permalink", GeoAdmin.Permalink);

/**
 * Creates the permalink provider.
 */
Ext.state.Manager.setProvider(
    new GeoAdmin.PermalinkProvider()
);
