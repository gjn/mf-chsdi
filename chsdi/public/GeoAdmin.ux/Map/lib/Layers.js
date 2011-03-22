/*
 * @include OpenLayers/Layer/TileCache.js
 * @include OpenLayers/Layer/WMS.js
 * @include OpenLayers/Lang.js
 * @include OpenLayers/Projection.js
 *
 * @include Map/lib/VoidLayer.js
 * @include Map/lib/AggregateLayer.js
 */

GeoAdmin._Layers = OpenLayers.Class({

    layers: null,

    buildLayerByName: function(name, options) {

        if (this.layers === null) {
            this.init();
        }
        var config = this.layers[name];
        if (!config) {
            // layer not found
            return null;
        }

        if (config.wms) {
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
        } else if (name === "voidLayer") {
            return new GeoAdmin.VoidLayer(config.name, {
                layername: name,
                geoadmin_isBgLayer: !!(config.isBgLayer)
            });
        } else {
            var layer_options = OpenLayers.Util.extend({
                projection: new OpenLayers.Projection('EPSG:21781'),
                units: 'm',
                serverResolutions: [4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,
                                    1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5],
                format: config.format,
                attribution: config.datenherr,
                transitionEffect: "resize",
                buffer: 0,
                opacity: config.opacity ? config.opacity : 1.0,
                displayInLayerSwitcher: !config.isBgLayer,
                geoadmin_queryable: config.queryable,
                geoadmin_isBgLayer: !!(config.isBgLayer),
                layerType: config.type
            }, options);

            var url = [
                'http://tile5.geo.admin.ch/geoadmin/',
                'http://tile6.geo.admin.ch/geoadmin/',
                'http://tile7.geo.admin.ch/geoadmin/',
                'http://tile8.geo.admin.ch/geoadmin/',
                'http://tile9.geo.admin.ch/geoadmin/'
            ];
            return new OpenLayers.Layer.TileCache(config.name, url, name, layer_options);
        }
    },

    initialize: function() {},

    init: function() {
        this.layers = {
            // base layers
            "ch.swisstopo.swissimage": {
                name: OpenLayers.i18n("ch.swisstopo.swissimage"),
                isBgLayer: true,
                type: "raster",
                format: "image/jpeg",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.pixelkarte-farbe": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-farbe"),
                isBgLayer: true,
                type: "raster",
                format: "image/jpeg",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.pixelkarte-grau": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-grau"),
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
                type: "point",
                format: "image/png",
                datenherr: "ch.babs",
                queryable: true
            },
            "ch.bfs.gebaeude_wohnungs_register": {
                name: OpenLayers.i18n("ch.bfs.gebaeude_wohnungs_register"),
                type: "point",
                format: "image/png",
                datenherr: "ch.bfs",
                queryable: true
            },
            "ch.swisstopo.hiks-dufour": {
                name: OpenLayers.i18n("ch.swisstopo.hiks-dufour"),
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.hiks-siegfried": {
                name: OpenLayers.i18n("ch.swisstopo.hiks-siegfried"),
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-primaerflaechen": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-primaerflaechen"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-anlagen": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-anlagen"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-gwn-gewassernetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-gwn-gewassernetz"),
                type: "mixed",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.vec25-gebaeude": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-gebaeude"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-eisenbahnnetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-eisenbahnnetz"),
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-wander": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-wander"),
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.gg25-gemeinde-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.gg25-gemeinde-flaeche.fill"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.gg25-bezirk-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.gg25-bezirk-flaeche.fill"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.gg25-kanton-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.gg25-kanton-flaeche.fill"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.gg25-land-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.gg25-land-flaeche.fill"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.fixpunkte-agnes": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-agnes"),
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo.kt",
                queryable: true
            },
            "ch.swisstopo.fixpunkte-lage": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-lage"),
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo.kt",
                queryable: true
            },
            "ch.swisstopo.fixpunkte-hoehe": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-hoehe"),
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo.kt",
                queryable: true
            },
            "ch.bfs.arealstatistik-1985": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-1985"),
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bfs",
                queryable: true
            },
            "ch.bfs.arealstatistik-1997": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-1997"),
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bfs",
                queryable: true
            },
            "ch.swisstopo.vec200-transportation-oeffentliche-verkehr": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-transportation-oeffentliche-verkehr"),
                type: "mixed",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec200-transportation-strassennetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-transportation-strassennetz"),
                type: "mixed",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geophysik-totalintensitaet": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-totalintensitaet"),
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geophysik-inklination": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-inklination"),
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geophysik-deklination": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-deklination"),
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geophysik-geothermie": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-geothermie"),
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geophysik-aeromagnetische_karte_schweiz": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-aeromagnetische_karte_schweiz"),
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geodaesie-isostatische_anomalien": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geodaesie-isostatische_anomalien"),
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geodaesie-bouguer_anomalien": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geodaesie-bouguer_anomalien"),
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-eiszeit-lgm-raster": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-eiszeit-lgm-raster"),
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geologischer_atlas": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geologischer_atlas"),
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geologische_karte": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geologische_karte"),
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen"),
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet"),
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-tektonische_karte": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-tektonische_karte"),
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.bafu.bundesinventare-amphibien": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-amphibien"),
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.ren-extensive_landwirtschaftsgebiete": {
                name: OpenLayers.i18n("ch.bafu.ren-extensive_landwirtschaftsgebiete"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.ren-feuchtgebiete": {
                name: OpenLayers.i18n("ch.bafu.ren-feuchtgebiete"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.ren-fliessgewaesser_seen": {
                name: OpenLayers.i18n("ch.bafu.ren-fliessgewaesser_seen"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.ren-trockenstandorte": {
                name: OpenLayers.i18n("ch.bafu.ren-trockenstandorte"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.ren-wald_ueber_1000_meter": {
                name: OpenLayers.i18n("ch.bafu.ren-wald_ueber_1000_meter"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.ren-wald_unter_1000_meter": {
                name: OpenLayers.i18n("ch.bafu.ren-wald_unter_1000_meter"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.hydrologie-hydromessstationen": {
                name: OpenLayers.i18n("ch.bafu.hydrologie-hydromessstationen"),
                wms: true,
                layers: ["ch.bafu.hydrologie-hydromessstationen"],
                type: "point",
                format: "image/pnga",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bfs.arealstatistik-waldmischungsgrad": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-waldmischungsgrad"),
                type: "raster",
                format: "image/png",
                datenherr: "ch.bfs",
                queryable: false
            },
            "ch.bfs.arealstatistik-hintergrund": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-hintergrund"),
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bfs",
                queryable: false
            },
            "ch.bafu.bundesinventare-auen": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-auen"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.bundesinventare-bln": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-bln"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.bundesinventare-flachmoore": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-flachmoore"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.bundesinventare-hochmoore": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-hochmoore"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.bundesinventare-jagdbanngebiete": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-jagdbanngebiete"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.bundesinventare-moorlandschaften": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-moorlandschaften"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.bundesinventare-vogelreservate": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-vogelreservate"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.fauna-steinbockkolonien": {
                name: OpenLayers.i18n("ch.bafu.fauna-steinbockkolonien"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.schutzgebiete-paerke_nationaler_bedeutung": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-paerke_nationaler_bedeutung"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.schutzgebiete-ramsar": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-ramsar"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.schutzgebiete-schweizerischer_nationalpark": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-schweizerischer_nationalpark"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.schutzgebiete-wildruhezonen": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-wildruhezonen"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.kt.bafu",
                queryable: true
            },
            "ch.bafu.showme-kantone_hochwasser": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_hochwasser"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.showme-kantone_rutschungen": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_rutschungen"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.showme-kantone_sturzprozesse": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_sturzprozesse"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.showme-kantone_lawinen": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_lawinen"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.showme-gemeinden_hochwasser": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_hochwasser"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.showme-gemeinden_rutschungen": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_rutschungen"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.showme-gemeinden_sturzprozesse": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_sturzprozesse"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.showme-gemeinden_lawinen": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_lawinen"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.wasser-entnahme": {
                name: OpenLayers.i18n("ch.bafu.wasser-entnahme"),
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.wasser-leitungen": {
                name: OpenLayers.i18n("ch.bafu.wasser-leitungen"),
                type: "line",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.wasser-rueckgabe": {
                name: OpenLayers.i18n("ch.bafu.wasser-rueckgabe"),
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.are.belastung-personenverkehr-strasse-2008": {
                name: OpenLayers.i18n("ch.are.belastung-personenverkehr-strasse-2008"),
                type: "line",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.belastung-personenverkehr-bahn-2008": {
                name: OpenLayers.i18n("ch.are.belastung-personenverkehr-bahn-2008"),
                type: "line",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.belastung-gueterverkehr-strasse-2008": {
                name: OpenLayers.i18n("ch.are.belastung-gueterverkehr-strasse-2008"),
                type: "line",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.belastung-gueterverkehr-bahn-2008": {
                name: OpenLayers.i18n("ch.are.belastung-gueterverkehr-bahn-2008"),
                type: "line",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.alpenkonvention": {
                name: OpenLayers.i18n("ch.are.alpenkonvention"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.bevoelkerungsdichte-vz00": {
                name: OpenLayers.i18n("ch.are.bevoelkerungsdichte-vz00"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bfs",
                queryable: true
            },
            "ch.are.beschaeftigtendichte-bz08": {
                name: OpenLayers.i18n("ch.are.beschaeftigtendichte-bz08"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bfs",
                queryable: true
            },
            "ch.are.agglomerationen_isolierte_staedte-2000": {
                name: OpenLayers.i18n("ch.are.agglomerationen_isolierte_staedte-2000"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.landschaftstypen": {
                name: OpenLayers.i18n("ch.are.landschaftstypen"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.gueteklassen_oev": {
                name: OpenLayers.i18n("ch.are.gueteklassen_oev"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.reisezeit_miv-2005": {
                name: OpenLayers.i18n("ch.are.reisezeit_miv-2005"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.reisezeit_oev-2005": {
                name: OpenLayers.i18n("ch.are.reisezeit_oev-2005"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.bauzonen-2007": {
                name: OpenLayers.i18n("ch.are.bauzonen-2007"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.gemeindetyp-1990-9klassen": {
                name: OpenLayers.i18n("ch.are.gemeindetyp-1990-9klassen"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.swisstopo.vec25-strassennetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-strassennetz"),
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-uebrigerverkehr": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-uebrigerverkehr"),
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
             "ch.swisstopo-karto.wanderwege": {
                name: OpenLayers.i18n("ch.swisstopo-karto.wanderwege"),
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
			/*"ch.swisstopo.pixelkarte-pk25.metadata": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-pk25.metadata"),
                layers: ["ch.swisstopo.pixelkarte-pk25.metadata"],
                wms: true,
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.pixelkarte-pk50.metadata": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-pk50.metadata"),
                layers: ["ch.swisstopo.pixelkarte-pk50.metadata"],
                wms: true,
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.pixelkarte-pk100.metadata": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-pk100.metadata"),
                layers: ["ch.swisstopo.pixelkarte-pk100.metadata"],
                wms: true,
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.pixelkarte-pk200.metadata": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-pk200.metadata"),
                layers: ["ch.swisstopo.pixelkarte-pk200.metadata"],
                wms: true,
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.pixelkarte-pk500.metadata": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-pk500.metadata"),
                layers: ["ch.swisstopo.pixelkarte-pk500.metadata"],
                wms: true,
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.images-swissimage.metadata": {
                name: OpenLayers.i18n("ch.swisstopo.images-swissimage.metadata"),
                layers: ["ch.swisstopo.images-swissimage.metadata"],
                wms: true,
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },*/
            "ch.astra.ivs-nat": {
                name: OpenLayers.i18n("ch.astra.ivs-nat"),
                type: "line",
                format: "image/png",
                datenherr: "ch.astra",
                queryable: true
            },
            "ch.astra.ivs-reg_loc": {
                name: OpenLayers.i18n("ch.astra.ivs-reg_loc"),
                type: "line",
                format: "image/png",
                datenherr: "ch.astra",
                queryable: true
            },
            "ch.astra.ivs-gelaendekarte": {
                name: OpenLayers.i18n("ch.astra.ivs-gelaendekarte"),
                type: "raster",
                format: "image/png",
                datenherr: "ch.astra",
                queryable: false
            },
            "ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal": {
                name: OpenLayers.i18n("ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal"),
                layers: ["ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal-status_netz","ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal-typ"],
                wms: true,
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet": {
                name: OpenLayers.i18n("ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet"),
                layers: ["ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet-status_netz","ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet-typ"],
                wms: true,
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
			 "ch.blw.steil_terrassenlagen_rebbau": {
                name: OpenLayers.i18n("ch.blw.steil_terrassenlagen_rebbau"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                queryable: false
            },
            "ch.blw.hang_steillagen": {
                name: OpenLayers.i18n("ch.blw.hang_steillagen"),
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                queryable: false
            }
        };
        return this.layers;
    }
});

GeoAdmin.layers = new GeoAdmin._Layers();
