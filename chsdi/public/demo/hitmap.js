var map,
    vector,
    features;

function init() {

    features = [];

    OpenLayers.Request.GET({
        url: 'response.json',
        success: function(req) {
            var format = new OpenLayers.Format.JSON();
            var json = format.read(req.responseText);
            for (var i = 0; i < json.facets.locations.terms.length; i++) {
                var obj = json.facets.locations.terms[i];
                var position = obj.term.split(",");
                var weight = obj.count / 16.000;
                var geometry = new OpenLayers.Geometry.Point(position[1], position[0]).transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    new OpenLayers.Projection("EPSG:21781")
                );
                var feature = new OpenLayers.Feature.Vector(geometry, {weight: weight});
                features.push(feature);
            }
            vector = new OpenLayers.Layer.Vector("heatmap", {
                // use the heatmap renderer instead of the default one (SVG, VML or Canvas)
                renderers: ['Heatmap'],
                styleMap: new OpenLayers.StyleMap({
                    "default": new OpenLayers.Style({
                        pointRadius: 20,
                        weight: 1
                        //"${weight}"
                    }, {
                        context: {
                            // the 'weight' of the point (between 0.0 and 1.0), used by the heatmap renderer
                            weight: function(f) {
                                return 1
                                //Math.min(Math.max((f.attributes.duration || 0) / 432, 0.25), 1.0);
                            }
                        }
                    })
                })
            });
            map.addLayers([vector]);
            vector.addFeatures(features);
            vector.div.style.opacity = 0.7;

        }
    });


    map = new GeoAdmin.Map("map", {
        resolutions: [1000, 650.0]
    });
    map.switchComplementaryLayer('ch.swisstopo.pixelkarte-farbe', {
        opacity: 1.0
    });

    map.zoomToExtent([413767.3782955, -3605.391845, 923767.3782955, 346394.608155]);

}