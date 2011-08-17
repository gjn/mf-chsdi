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

        if (typeof stWidget != 'undefined') {
            for (var i = 0; i < stWidget.shareables.length; i++) {
                var share = stWidget.shareables[i];
                if (share.element.id == "sharethis_permalink") {
                    share.url = provider.getLink();
                }
                share.title = OpenLayers.i18n("Share map.geo.admin.ch");
                share.summary = OpenLayers.i18n("Link to map.geo.admin.ch");
                share.text = OpenLayers.i18n("Here is a link to map.geo.admin.ch");
                share.image = "http://www.swisstopo.admin.ch/images/logo.jpg";
            }
        }
    }
});
