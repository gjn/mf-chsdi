/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @requires GeoExt/state/PermalinkProvider.js
 * @requires GeoExt/widgets/MapPanel.js
 */

/** api: (define)
 *  module = GeoAdmin
 *  class = PermalinkProvider
 *  base_link = `GeoExt.state.PermalinkProvider <http://www.geoext.org/lib/GeoExt/state/PermalinkProvider.html>`_
 */

/** api: example
 *  Sample code to use the permalink provider.
 *
 *  .. code-block:: javascript
 *
 *     Ext.state.Manager.setProvider(new GeoAdmin.PermalinkProvider());
 *
 */

/** api: constructor
 *  .. class:: PermalinkProvider(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.PermalinkProvider``
 *
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
                if (k === 'X') {
                    // invert x coordinate.
                    map_state['y'] = parseFloat(params.X);
                } else if (k === 'Y') {
                    // invert y coordinate.
                    map_state['x'] = parseFloat(params.Y);
                } else if (k === 'zoom') {
                    map_state[k] = parseFloat(params[k]);
                } else if (k === 'bgOpacity') {
                    map_state.complementaryLayer.opacity = parseFloat(params.bgOpacity);
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
                } else if (k == 'crosshair') {
                    map_state.crosshair = {
                        type: params.crosshair
                    };
                } else if (k == 'selectedNode') {
                    catalog_state.selected = params.selectedNode;
                } else if (k !== 'lang' && k !== 'noHeader' &&
                           k !== 'layers_opacity' && k !== 'layers_visibility' && k !== 'layers_indices') {
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

    /** api: method[getLink]
     *  :param base: ``String`` The base URL, optional.
     *  :return: ``String`` The permalink.
     *
     *  Return the permalink corresponding to the current state.
     */
    getLink: function(base) {
        base = base || document.location.href;
        var params = {};

        if (this.state.catalog && this.state.catalog.selected) {
            params.selectedNode = this.state.catalog.selected;
        }
        if (this.state.map) {
            // invert x and y coordinates.
            params.Y = this.state.map.x;
            params.X = this.state.map.y;
            params.zoom = this.state.map.zoom;
            if (this.state.map.complementaryLayer.opacity < 1.0) {
                params.bgOpacity = this.state.map.complementaryLayer.opacity;
            }
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

            if (params.layers.length === 0) {
                delete params.layers;
                delete params.layers_opacity;
                delete params.layers_visibility;
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
