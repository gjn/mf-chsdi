Ext.namespace('GeoAdmin');

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
