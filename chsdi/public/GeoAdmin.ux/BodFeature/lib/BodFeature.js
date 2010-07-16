/*
 * @requires OpenLayers/Control/GetFeature.js
 * @requires OpenLayers/Protocol/HTTP.js
 * @requires OpenLayers/Format/GeoJSON.js
 */

// use http://trac.geoext.org/browser/sandbox/camptocamp/extensions/geoext.ux/ux/FeatureBrowser to display results

GeoAdmin.BodFeature = OpenLayers.Class(OpenLayers.Control.GetFeature, {

    layer: null,

    initialize: function(options) {
        OpenLayers.Control.GetFeature.prototype.initialize.apply(this, arguments);

        this.protocol = new OpenLayers.Protocol.HTTP({
            url: GeoAdmin.webServicesUrl + "/bodfeature/search",
            format: new OpenLayers.Format.GeoJSON(),
//             filter: new OpenLayers.Filter.Comparison({
//                 type: OpenLayers.Filter.Comparison.EQUAL_TO,
//                 property: "layers",
//                 value: ['foo', 'bar'].join(',')
//             }),
            params: {
                lang: OpenLayers.Lang.getCode()
            }
        });

        this.events.on({
            "featuresselected": this.onSelect,
            "featureunselected":this.onUnSelect,
            scope: this
        });
    },

    request: function(bounds, options) {
        console.log(bounds, options);
        OpenLayers.Control.GetFeature.prototype.request.apply(this, arguments);
    },

    onSelect: function(evt) {
    },

    onUnselect: function(evt) {
    }
});
