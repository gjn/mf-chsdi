/**
 * @requires GeoExt/state/PermalinkProvider.js
 * @requires GeoExt/widgets/MapPanel.js
 */

Ext.namespace("GeoAdmin");

GeoAdmin.PermalinkProvider = Ext.extend(GeoExt.state.PermalinkProvider, {

    readURL: function(url) {
        var params = OpenLayers.Util.getParameters(url);

        var map_state = {
            layers: [],
            complementaryLayer: {}
        };

        for (var k in params) {
            if(params.hasOwnProperty(k)) {
                if (k === 'X' || k === 'Y') {
                    map_state[k.toLowerCase()] = parseFloat(params[k]);
                } else if (k === 'zoom') {
                    map_state[k] = parseFloat(params[k]);
                } else if (k === 'bgOpacity') {
                    map_state.complementaryLayer.opacity = parseInt(params.bgOpacity) / 100.0;
                } else if (k === 'bgLayer') {
                    if (params.bgLayer === 'pixelmaps-gray') {
                        params.bgLayer =  'ch.swisstopo.pixelkarte-grau';
                    }
                    map_state.complementaryLayer.layername = params.bgLayer;
                } else if (k === 'layers') {
                    if (!(params.layers instanceof Array)) {
                        params.layers = [params.layers];
                    }
                    for (var i = 0, len = params.layers.length; i < len; i++) {
                        map_state.layers.push({
                            layername: params.layers[i],
                            visibility: params.layers_visibility[i] === 'true',
                            opacity: parseFloat(params.layers_opacity[i])
                        });
                    }
                } else if (k == 'selectedNode') {


                
                } else if (k !== 'lang' && k !== 'layers_opacity' && 
                           k !== 'layers_visibility' && k !== 'layers_indices') {
                    // probably a layer to recenter on
                    map_state.layers.push({
                        layername: k
                    });
                    map_state.recenter = {
                        layername: k,
                        id: params[k]
                    };
                }
            }
        }
        var state = {};
        state['map'] = map_state;
        return state;
    },

    getLink: function(base) {
    }
});
