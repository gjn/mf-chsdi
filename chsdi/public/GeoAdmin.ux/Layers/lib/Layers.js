/*
 * @include OpenLayers/Layer/TileCache.js
 * @include OpenLayers/Layer/WMS.js
 * @include OpenLayers/Layer/WMTS.js
 * @include OpenLayers/Lang.js
 * @include OpenLayers/Projection.js
 *
 * @include Layers/lib/VoidLayer.js
 * @include Layers/lib/AggregateLayer.js
 */

GeoAdmin._Layers = OpenLayers.Class({

    layers: null,

    buildLayerByName: function(name, options) {

        var wmts_url = [
            'http://wmts0.geo.admin.ch/',
            'http://wmts1.geo.admin.ch/',
            'http://wmts2.geo.admin.ch/',
            'http://wmts3.geo.admin.ch/',
            'http://wmts4.geo.admin.ch/'
        ];

        if (this.layers === null) {
            this.init();
        }
        var config = this.layers[name];
        if (!config) {
            // layer not found
            return null;
        }

        if (config.layertype == "wms") {
            return new OpenLayers.Layer.WMS(config.name, config.url || "http://wms.geo.admin.ch/", {
                layers: config.layers,
                format: config.format
            }, {
                layername: name,
                displayInLayerSwitcher: !config.isBgLayer,
                attribution: config.datenherr,
                opacity: config.opacity ? config.opacity : 1.0,
                singleTile: true,
                geoadmin_queryable: config.queryable,
                geoadmin_isBgLayer: !!(config.isBgLayer),
                layerType: config.type,
                ratio: 1.1
            });
        } else if (config.layertype == "aggregate") {
            var sub_layers = [];
            var layer_to_aggregate;

            for (var i = 0; i < config.layers.length; ++i) {
                if (config.layers[i].sub_layertype == "wms") {
                    // WMS ---
                    layer_to_aggregate = new OpenLayers.Layer.WMS(config.name, config.layers[i].url || "http://wms.geo.admin.ch/", {
                        layers: config.layers[i].sub_layers,
                        format: config.format
                    }, {
                        layername: name,
                        singleTile: true,
                        ratio: 1.1,
                        minScale: config.layers[i].sub_minScale,
                        maxScale: config.layers[i].sub_maxScale
                    });
                } else {
                    // TILECACHE ---
                    layer_to_aggregate = new OpenLayers.Layer.TileCache(config.name, tilecache_url, name, {
                        projection: new OpenLayers.Projection('EPSG:21781'),
                        units: 'm',
                        serverResolutions: [4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,
                            1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5],
                        format: config.format,
                        transitionEffect: "resize",
                        buffer: 0,
                        minScale: config.layers[i].sub_minScale,
                        maxScale: config.layers[i].sub_maxScale
                    });
                }
                sub_layers[i] = layer_to_aggregate;
            }

            return new OpenLayers.Layer.Aggregate(config.name, sub_layers,
            {
                layername: name,
                displayInLayerSwitcher: !config.isBgLayer,
                attribution: config.datenherr,
                opacity: config.opacity ? config.opacity : 1.0,
                geoadmin_queryable: config.queryable,
                geoadmin_isBgLayer: !!(config.isBgLayer),
                layerType: config.type
            });

        } else if (config.layertype == "wmts") {
            var layer_options_wmts = OpenLayers.Util.extend({
                name: config.name,
                layer:  name,
                layername: name,
                version: "1.0.0",
                requestEncoding: "REST",
                url: wmts_url,
                style: "default",
                matrixSet: "21781",
                zoomOffset: 14,
                formatSuffix: config.format.split('/')[1].toLowerCase(),
                dimensions: ['TIME'],
                params: {
                    'time': config.timestamp
                },
                projection: new OpenLayers.Projection('EPSG:21781'),
                units: 'm',
                format: config.format,
                attribution: config.datenherr,
                transitionEffect: "resize",
                buffer: 0,
                opacity: config.opacity ? config.opacity : 1.0,
                displayInLayerSwitcher: !config.isBgLayer,
                geoadmin_queryable: config.queryable,
                geoadmin_isBgLayer: !!(config.isBgLayer),
                layerType: config.type,
                getMatrix: function() {
                    // Support the fact that one zoom level is not used (zoom 24, resolution 1.5m)
                    if (this.map.getZoom() > 9) {
                      return {identifier: this.map.getZoom() + this.zoomOffset + 1};
                    } else {
                      return {identifier: this.map.getZoom() + this.zoomOffset};
                    }
                }
            }, options);

            return new OpenLayers.Layer.WMTS(layer_options_wmts);
            
        } else if (name === "voidLayer") {
            return new GeoAdmin.VoidLayer(config.name, {
                layername: name,
                geoadmin_isBgLayer: !!(config.isBgLayer)
            });
        } 
    },

    initialize: function() {
    },

    init: function() {
        this.layers = {
            // base layers
            "ch.swisstopo.swissimage": {
                name: OpenLayers.i18n("ch.swisstopo.swissimage"),
                layertype: 'wmts',
                timestamp: '20110228',
                isBgLayer: true,
                type: "raster",
                format: "image/jpeg",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.pixelkarte-farbe": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-farbe"),
                layertype: 'wmts',
                timestamp: '20110401',
                isBgLayer: true,
                type: "raster",
                format: "image/jpeg",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.pixelkarte-grau": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-grau"),
                layertype: 'wmts',
                timestamp: '20110401',
                isBgLayer: true,
                type: "raster",
                format: "image/jpeg",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "voidLayer": {
                name: OpenLayers.i18n("voidLayer"),
                isBgLayer: true
            },

            // overlays
            "ch.babs.kulturgueter": {
                name: OpenLayers.i18n("ch.babs.kulturgueter"),
                layertype: 'wmts',
                timestamp: '20091127',
                type: "point",
                format: "image/png",
                datenherr: "ch.babs",
                queryable: true
            },
            "ch.bfs.gebaeude_wohnungs_register": {
                name: OpenLayers.i18n("ch.bfs.gebaeude_wohnungs_register"),
                layertype: 'wmts',
                timestamp: '20110509',
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true,
                type: "point"
            },
            "ch.swisstopo.hiks-dufour": {
                name: OpenLayers.i18n("ch.swisstopo.hiks-dufour"),
                layertype: 'wmts',
                timestamp: '18450101',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.hiks-siegfried": {
                name: OpenLayers.i18n("ch.swisstopo.hiks-siegfried"),
                layertype: 'wmts',
                timestamp: '18700101',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-primaerflaechen": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-primaerflaechen"),
                layertype: 'wmts',
                timestamp: '20090401',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-anlagen": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-anlagen"),
                layertype: 'wmts',
                timestamp: '20090401',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-gwn-gewassernetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-gwn-gewassernetz"),
                layertype: 'wmts',
                timestamp: '20090401',
                type: "mixed",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.vec25-gebaeude": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-gebaeude"),
                layertype: 'wmts',
                timestamp: '20090401',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-eisenbahnnetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-eisenbahnnetz"),
                layertype: 'wmts',
                timestamp: '20090401',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-wander": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-wander"),
                layertype: 'wmts',
                timestamp: '20090401',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.gg25-gemeinde-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.gg25-gemeinde-flaeche.fill"),
                layertype: 'wmts',
                timestamp: '20090601',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.gg25-bezirk-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.gg25-bezirk-flaeche.fill"),
                layertype: 'wmts',
                timestamp: '20090601',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.gg25-kanton-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.gg25-kanton-flaeche.fill"),
                layertype: 'wmts',
                timestamp: '20090601',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.gg25-land-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.gg25-land-flaeche.fill"),
                layertype: 'wmts',
                timestamp: '20090601',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.fixpunkte-agnes": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-agnes"),
                layertype: 'wmts',
                timestamp: '20110509',
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo.kt",
                queryable: true
            },
            "ch.swisstopo.fixpunkte-lage": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-lage"),
                layertype: 'wmts',
                timestamp: '20110509',
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo.kt",
                queryable: true
            },
            "ch.swisstopo.fixpunkte-hoehe": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-hoehe"),
                layertype: 'wmts',
                timestamp: '20110509',
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo.kt",
                queryable: true
            },
            "ch.bfs.arealstatistik-1985": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-1985"),
                layertype: 'wmts',
                timestamp: '19790101',
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bfs",
                queryable: true
            },
            "ch.bfs.arealstatistik-1997": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-1997"),
                layertype: 'wmts',
                timestamp: '19920101',
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bfs",
                queryable: true
            },
            "ch.swisstopo.vec200-transportation-oeffentliche-verkehr": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-transportation-oeffentliche-verkehr"),
                layertype: 'wmts',
                timestamp: '20100101',
                type: "mixed",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec200-transportation-strassennetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-transportation-strassennetz"),
                layertype: 'wmts',
                timestamp: '20100101',
                type: "mixed",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geophysik-totalintensitaet": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-totalintensitaet"),
                layertype: 'wmts',
                timestamp: '19791231',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geophysik-inklination": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-inklination"),
                layertype: 'wmts',
                timestamp: '19791231',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geophysik-deklination": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-deklination"),
                layertype: 'wmts',
                timestamp: '19791231',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geophysik-geothermie": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-geothermie"),
                layertype: 'wmts',
                timestamp: '19821231',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geophysik-aeromagnetische_karte_schweiz": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-aeromagnetische_karte_schweiz"),
                layertype: 'wmts',
                timestamp: '19821231',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geodaesie-isostatische_anomalien": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geodaesie-isostatische_anomalien"),
                layertype: 'wmts',
                timestamp: '19791231',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geodaesie-bouguer_anomalien": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geodaesie-bouguer_anomalien"),
                layertype: 'wmts',
                timestamp: '19791231',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-eiszeit-lgm-raster": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-eiszeit-lgm-raster"),
                layertype: 'wmts',
                timestamp: '20081231',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geologischer_atlas": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geologischer_atlas"),
                layertype: 'wmts',
                timestamp: '20101221',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geologische_karte": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geologische_karte"),
                layertype: 'wmts',
                timestamp: '20051231',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen"),
                layertype: 'wmts',
                timestamp: '20070101',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet"),
                layertype: 'wmts',
                timestamp: '20070914',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-tektonische_karte": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-tektonische_karte"),
                layertype: 'wmts',
                timestamp: '20051231',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.bafu.bundesinventare-amphibien": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-amphibien"),
                layertype: 'wmts',
                timestamp: '20070701',
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.ren-extensive_landwirtschaftsgebiete": {
                name: OpenLayers.i18n("ch.bafu.ren-extensive_landwirtschaftsgebiete"),
                layertype: 'wmts',
                timestamp: '20110214',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.ren-feuchtgebiete": {
                name: OpenLayers.i18n("ch.bafu.ren-feuchtgebiete"),
                layertype: 'wmts',
                timestamp: '20110214',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.ren-fliessgewaesser_seen": {
                name: OpenLayers.i18n("ch.bafu.ren-fliessgewaesser_seen"),
                layertype: 'wmts',
                timestamp: '20110214',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.ren-trockenstandorte": {
                name: OpenLayers.i18n("ch.bafu.ren-trockenstandorte"),
                layertype: 'wmts',
                timestamp: '20110214',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.ren-wald_ueber_1000_meter": {
                name: OpenLayers.i18n("ch.bafu.ren-wald_ueber_1000_meter"),
                layertype: 'wmts',
                timestamp: '20040101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.ren-wald_unter_1000_meter": {
                name: OpenLayers.i18n("ch.bafu.ren-wald_unter_1000_meter"),
                layertype: 'wmts',
                timestamp: '20040101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.ren-wald": {
                name: OpenLayers.i18n("ch.bafu.ren-wald"),
                layertype: 'wmts',
                timestamp: '20110214',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.hydrologie-hydromessstationen": {
                name: OpenLayers.i18n("ch.bafu.hydrologie-hydromessstationen"),
                layertype: 'wmts',
                timestamp: '20081201',
                type: "point",
                format: "image/pnga",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bfs.arealstatistik-waldmischungsgrad": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-waldmischungsgrad"),
                layertype: 'wmts',
                timestamp: '19970901',
                type: "raster",
                format: "image/png",
                datenherr: "ch.bfs",
                queryable: false
            },
            "ch.bfs.arealstatistik-hintergrund": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-hintergrund"),
                layertype: 'wmts',
                timestamp: '20070116',
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bfs",
                queryable: false
            },
            "ch.bafu.bundesinventare-auen": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-auen"),
                layertype: 'wmts',
                timestamp: '20070701',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.bundesinventare-bln": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-bln"),
                layertype: 'wmts',
                timestamp: '20010809',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.bundesinventare-flachmoore": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-flachmoore"),
                layertype: 'wmts',
                timestamp: '20100623',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.bundesinventare-hochmoore": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-hochmoore"),
                layertype: 'wmts',
                timestamp: '20080721',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.bundesinventare-jagdbanngebiete": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-jagdbanngebiete"),
                layertype: 'wmts',
                timestamp: '20100801',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.bundesinventare-moorlandschaften": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-moorlandschaften"),
                layertype: 'wmts',
                timestamp: '20070701',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.bundesinventare-vogelreservate": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-vogelreservate"),
                layertype: 'wmts',
                timestamp: '20090617',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.fauna-steinbockkolonien": {
                name: OpenLayers.i18n("ch.bafu.fauna-steinbockkolonien"),
                layertype: 'wmts',
                timestamp: '20020114',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.schutzgebiete-paerke_nationaler_bedeutung": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-paerke_nationaler_bedeutung"),
                layertype: 'wmts',
                timestamp: '20110103',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.schutzgebiete-ramsar": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-ramsar"),
                layertype: 'wmts',
                timestamp: '20050202',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.schutzgebiete-schweizerischer_nationalpark": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-schweizerischer_nationalpark"),
                layertype: 'wmts',
                timestamp: '20010117',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.schutzgebiete-wildruhezonen": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-wildruhezonen"),
                layertype: 'wmts',
                timestamp: '20101201',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.kt.bafu",
                queryable: true
            },
            "ch.bafu.showme-kantone_hochwasser": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_hochwasser"),
                layertype: 'wmts',
                timestamp: '20100101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.showme-kantone_rutschungen": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_rutschungen"),
                layertype: 'wmts',
                timestamp: '20100101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.showme-kantone_sturzprozesse": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_sturzprozesse"),
                layertype: 'wmts',
                timestamp: '20100101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.showme-kantone_lawinen": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_lawinen"),
                layertype: 'wmts',
                timestamp: '20100101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.showme-gemeinden_hochwasser": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_hochwasser"),
                layertype: 'wmts',
                timestamp: '20100101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.showme-gemeinden_rutschungen": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_rutschungen"),
                layertype: 'wmts',
                timestamp: '20100101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.showme-gemeinden_sturzprozesse": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_sturzprozesse"),
                layertype: 'wmts',
                timestamp: '20100101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.showme-gemeinden_lawinen": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_lawinen"),
                layertype: 'wmts',
                timestamp: '20100101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.wasser-entnahme": {
                name: OpenLayers.i18n("ch.bafu.wasser-entnahme"),
                layertype: 'wmts',
                timestamp: '20040101',
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.wasser-leitungen": {
                name: OpenLayers.i18n("ch.bafu.wasser-leitungen"),
                layertype: 'wmts',
                timestamp: '20040101',
                type: "line",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.wasser-rueckgabe": {
                name: OpenLayers.i18n("ch.bafu.wasser-rueckgabe"),
                layertype: 'wmts',
                timestamp: '20040101',
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            // *********************************
            // *********************************
            // *********************************
            "ch.bafu.permafrost": {
                name: OpenLayers.i18n("ch.bafu.permafrost"),
                layertype: 'wmts',
                timestamp: '20110317',
                type: "raster",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.gefahren-gefaehrdungszonen": {
                name: OpenLayers.i18n("ch.bafu.gefahren-gefaehrdungszonen"),
                layertype: 'wmts',
                timestamp: '20030101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.swissprtr": {
                name: OpenLayers.i18n("ch.bafu.swissprtr"),
                layertype: 'wmts',
                timestamp: '20110222',
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.nabelstationen": {
                name: OpenLayers.i18n("ch.bafu.nabelstationen"),
                layertype: 'wmts',
                timestamp: '20110309',
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.holzvorrat": {
                name: OpenLayers.i18n("ch.bafu.holzvorrat"),
                layertype: 'wmts',
                timestamp: '20100310',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.holznutzung": {
                name: OpenLayers.i18n("ch.bafu.holznutzung"),
                layertype: 'wmts',
                timestamp: '20100310',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.holzzuwachs": {
                name: OpenLayers.i18n("ch.bafu.holzzuwachs"),
                layertype: 'wmts',
                timestamp: '20100310',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.swisstopo.vec200-landcover-wald": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-landcover-wald"),
                layertype: 'wmts',
                timestamp: '20090430',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.laerm-bahnlaerm_tag": {
                name: OpenLayers.i18n("ch.bafu.laerm-bahnlaerm_tag"),
                layertype: 'wmts',
                timestamp: '20101109',
                type: "raster",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.laerm-bahnlaerm_nacht": {
                name: OpenLayers.i18n("ch.bafu.laerm-bahnlaerm_nacht"),
                layertype: 'wmts',
                timestamp: '20101109',
                type: "raster",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.laerm-strassenlaerm_tag": {
                name: OpenLayers.i18n("ch.bafu.laerm-strassenlaerm_tag"),
                layertype: 'wmts',
                timestamp: '20101109',
                type: "raster",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.laerm-strassenlaerm_nacht": {
                name: OpenLayers.i18n("ch.bafu.laerm-strassenlaerm_nacht"),
                layertype: 'wmts',
                timestamp: '20101109',
                type: "raster",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            // *********************************
            // *********************************
            // *********************************


            "ch.are.belastung-personenverkehr-strasse-2008": {
                name: OpenLayers.i18n("ch.are.belastung-personenverkehr-strasse-2008"),
                layertype: 'wmts',
                timestamp: '20080101',
                type: "line",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.belastung-personenverkehr-bahn-2008": {
                name: OpenLayers.i18n("ch.are.belastung-personenverkehr-bahn-2008"),
                layertype: 'wmts',
                timestamp: '20080101',
                type: "line",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.belastung-gueterverkehr-strasse-2008": {
                name: OpenLayers.i18n("ch.are.belastung-gueterverkehr-strasse-2008"),
                layertype: 'wmts',
                timestamp: '20080101',
                type: "line",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.belastung-gueterverkehr-bahn-2008": {
                name: OpenLayers.i18n("ch.are.belastung-gueterverkehr-bahn-2008"),
                layertype: 'wmts',
                timestamp: '20080101',
                type: "line",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.alpenkonvention": {
                name: OpenLayers.i18n("ch.are.alpenkonvention"),
                layertype: 'wmts',
                timestamp: '20090101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.bevoelkerungsdichte-vz00": {
                name: OpenLayers.i18n("ch.are.bevoelkerungsdichte-vz00"),
                layertype: 'wmts',
                timestamp: '20001205',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bfs",
                queryable: true
            },
            "ch.are.beschaeftigtendichte-bz08": {
                name: OpenLayers.i18n("ch.are.beschaeftigtendichte-bz08"),
                layertype: 'wmts',
                timestamp: '20080930',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bfs",
                queryable: true
            },
            "ch.are.agglomerationen_isolierte_staedte-2000": {
                name: OpenLayers.i18n("ch.are.agglomerationen_isolierte_staedte-2000"),
                layertype: 'wmts',
                timestamp: '20090101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.landschaftstypen": {
                name: OpenLayers.i18n("ch.are.landschaftstypen"),
                layertype: 'wmts',
                timestamp: '20100831',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.gueteklassen_oev": {
                name: OpenLayers.i18n("ch.are.gueteklassen_oev"),
                layertype: 'wmts',
                timestamp: '20091213',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.reisezeit_miv-2005": {
                name: OpenLayers.i18n("ch.are.reisezeit_miv-2005"),
                layertype: 'wmts',
                timestamp: '20050101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.reisezeit_oev-2005": {
                name: OpenLayers.i18n("ch.are.reisezeit_oev-2005"),
                layertype: 'wmts',
                timestamp: '20050101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.bauzonen-2007": {
                name: OpenLayers.i18n("ch.are.bauzonen-2007"),
                layertype: 'wmts',
                timestamp: '20070101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.gemeindetyp-1990-9klassen": {
                name: OpenLayers.i18n("ch.are.gemeindetyp-1990-9klassen"),
                layertype: 'wmts',
                timestamp: '20090101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                queryable: false
            },
            "ch.swisstopo.vec25-strassennetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-strassennetz"),
                layertype: 'wmts',
                timestamp: '20090401',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-uebrigerverkehr": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-uebrigerverkehr"),
                layertype: 'wmts',
                timestamp: '20090401',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo-karto.wanderwege": {
                name: OpenLayers.i18n("ch.swisstopo-karto.wanderwege"),
                layertype: 'wmts',
                timestamp: '20110124',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.tamedia.schweizerfamilie-feuerstellen": {
                name: OpenLayers.i18n("ch.tamedia.schweizerfamilie-feuerstellen"),
                layertype: 'wmts',
                timestamp: '20110124',
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            /*"ch.swisstopo.pixelkarte-pk25.metadata": {
             name: OpenLayers.i18n("ch.swisstopo.pixelkarte-pk25.metadata"),
             layers: ["ch.swisstopo.pixelkarte-pk25.metadata"],
             layertype: "wms",
             type: "polygon",
             format: "image/png",
             datenherr: "ch.swisstopo",
             queryable: true
             },
             "ch.swisstopo.pixelkarte-pk50.metadata": {
             name: OpenLayers.i18n("ch.swisstopo.pixelkarte-pk50.metadata"),
             layers: ["ch.swisstopo.pixelkarte-pk50.metadata"],
             layertype: "wms",
             type: "polygon",
             format: "image/png",
             datenherr: "ch.swisstopo",
             queryable: true
             },
             "ch.swisstopo.pixelkarte-pk100.metadata": {
             name: OpenLayers.i18n("ch.swisstopo.pixelkarte-pk100.metadata"),
             layers: ["ch.swisstopo.pixelkarte-pk100.metadata"],
             layertype: "wms",
             type: "polygon",
             format: "image/png",
             datenherr: "ch.swisstopo",
             queryable: true
             },
             "ch.swisstopo.pixelkarte-pk200.metadata": {
             name: OpenLayers.i18n("ch.swisstopo.pixelkarte-pk200.metadata"),
             layers: ["ch.swisstopo.pixelkarte-pk200.metadata"],
             layertype: "wms",
             type: "polygon",
             format: "image/png",
             datenherr: "ch.swisstopo",
             queryable: true
             },
             "ch.swisstopo.pixelkarte-pk500.metadata": {
             name: OpenLayers.i18n("ch.swisstopo.pixelkarte-pk500.metadata"),
             layers: ["ch.swisstopo.pixelkarte-pk500.metadata"],
             layertype: "wms",
             type: "polygon",
             format: "image/png",
             datenherr: "ch.swisstopo",
             queryable: true
             },
             "ch.swisstopo.images-swissimage.metadata": {
             name: OpenLayers.i18n("ch.swisstopo.images-swissimage.metadata"),
             layers: ["ch.swisstopo.images-swissimage.metadata"],
             layertype: "wms",
             type: "polygon",
             format: "image/png",
             datenherr: "ch.swisstopo",
             queryable: true
             },*/
            "ch.astra.ivs-nat": {
                name: OpenLayers.i18n("ch.astra.ivs-nat"),
                layertype: 'wmts',
                timestamp: '20070712',
                type: "line",
                format: "image/png",
                datenherr: "ch.astra",
                queryable: true
            },
            "ch.astra.ivs-reg_loc": {
                name: OpenLayers.i18n("ch.astra.ivs-reg_loc"),
                layertype: 'wmts',
                timestamp: '20070712',
                type: "line",
                format: "image/png",
                datenherr: "ch.astra",
                queryable: true
            },
            "ch.astra.ivs-gelaendekarte": {
                name: OpenLayers.i18n("ch.astra.ivs-gelaendekarte"),
                layertype: 'wmts',
                timestamp: '19980816',
                type: "raster",
                format: "image/png",
                datenherr: "ch.astra",
                queryable: false
            },
            "ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal": {
                name: OpenLayers.i18n("ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal"),
                layers: ["ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal-status_netz","ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal-typ"],
                layertype: "wms",
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet": {
                name: OpenLayers.i18n("ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet"),
                layers: ["ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet-status_netz","ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet-typ"],
                layertype: "wms",
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.blw.steil_terrassenlagen_rebbau": {
                name: OpenLayers.i18n("ch.blw.steil_terrassenlagen_rebbau"),
                layertype: 'wmts',
                timestamp: '20100501',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                queryable: false
            },
            "ch.blw.hang_steillagen": {
                name: OpenLayers.i18n("ch.blw.hang_steillagen"),
                layertype: 'wmts',
                timestamp: '20100501',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                queryable: false
            },
            "ch.ensi.zonenplan-notfallschutz-kernanlagen": {
                name: OpenLayers.i18n("ch.ensi.zonenplan-notfallschutz-kernanlagen"),
                layertype: 'wmts',
                timestamp: '20110412',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.ensi",
                opacity: 0.6,
                queryable: true
            }
        };
        return this.layers;
    }
});

GeoAdmin.layers = new GeoAdmin._Layers();
