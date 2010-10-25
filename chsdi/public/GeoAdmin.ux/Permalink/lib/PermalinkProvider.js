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
        var catalog_state = {};
        
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
                    if (!(params.layers_opacity instanceof Array)) {
                        params.layers_opacity = [params.layers_opacity];
                    }
                    if (!(params.layers_visibility instanceof Array)) {
                        params.layers_visibility = [params.layers_visibility];
                    }
                    
                    for (var i = 0, len = params.layers.length; i < len; i++) {
                        map_state.layers.push({
                            layername: params.layers[i],
                            visibility: params.layers_visibility[i] === 'true',
                            opacity: parseFloat(params.layers_opacity[i])
                        });
                    }
                } else if (k == 'selectedNode') {
                    catalog_state.selected = params.selectedNode;
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
        state['catalog'] = catalog_state;
        
        return state;
    },

    getLink: function(base) {
        base = base || document.location.href;
        var params = {};

        if (this.state.catalog && this.state.catalog.selected) {
            params.selectedNode = this.state.catalog.selectede;
        }
        if (this.state.map) {
            params.X = this.state.map.x;
            params.Y = this.state.map.y;
            params.zoom = this.state.map.zoom;
            params.bgOpacity = this.state.map.complementaryLayer.opacity * 100;
            params.bgLayer = this.state.map.complementaryLayer.layername;

            params.layers = [];
            params.layers_opacity = [];
            params.layers_visibility = [];
            
            for (var i = 0, len = this.state.map.layers.length; i < len; i++) {
                var layer = this.state.map.layers[i];
                params.layers.push(layer.layername);
                params.layers_opacity.push(layer.opacity);
                params.layers_visibility.push(layer.visibility);
            }
        }

        // merge params in the URL into the state params
        OpenLayers.Util.applyDefaults(params, OpenLayers.Util.getParameters(base));
        
        var paramsStr = OpenLayers.Util.getParameterString(params);
        
        var qMark = base.indexOf("?");
        if(qMark > 0) {
            base = base.substring(0, qMark);
        }
        
        return Ext.urlAppend(base, paramsStr);
    }
});
