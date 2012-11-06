var gsearch;

Ext.onReady(function() {

    // required for accessing layer information
   GeoAdmin.webServicesUrl = (GeoAdmin.protocol ? GeoAdmin.protocol : 'http:') + '//mf-chsdi0t.bgdi.admin.ch';

    gsearch = new GeoAdmin.GeoCatSearchField({
        renderTo: "GeoCatSearch",
        width: 300,
        url: 'foo.json',
        listeners: {
            addmetadata: function(config) {
                alert(config.name);
            }
        }
    });
});
