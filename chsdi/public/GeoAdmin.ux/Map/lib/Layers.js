/*
 * @include OpenLayers/Layer/TileCache.js
 * @include OpenLayers/Lang.js
 * @include OpenLayers/Projection.js
 *
 * @include Map/lib/VoidLayer.js
 */

// FIXME: uuid ?

(function() {

var Layers = OpenLayers.Class({

    layers: null,

    buildLayerByName: function(name, options) {
        var config = this.layers[name];
        
        if (name === "voidLayer") {
            return new GeoAdmin.VoidLayer(config.name, {
                layername: name
            });
        }

        if (config) {

            var layer_options = OpenLayers.Util.applyDefaults({
                projection: new OpenLayers.Projection('EPSG:21781'),
                units: 'm',
                serverResolutions: [4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,
                                    1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5],
                format: config.format,
                attribution: config.datenherr,
                transitionEffect: "resize",

                geoadmin_queryable: config.queryable
            }, options);

            var url = [
                'http://tile5.bgdi.admin.ch/geoadmin/',
                'http://tile6.bgdi.admin.ch/geoadmin/',
                'http://tile7.bgdi.admin.ch/geoadmin/',
                'http://tile8.bgdi.admin.ch/geoadmin/',
                'http://tile9.bgdi.admin.ch/geoadmin/'
            ];
            return new OpenLayers.Layer.TileCache(config.name, url, name, layer_options);
        } else {
            return null;
        }
    },

    initialize: function() {
        this.layers = {
            // base layers
            "ch.swisstopo.swissimage": {
                name: OpenLayers.i18n("ch.swisstopo.swissimage"),
                isBgLayer: true,
                type: "raster",
                format: "image/jpeg",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
                queryable: false
            },
            "ch.swisstopo.pixelkarte-farbe": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-farbe"),
                isBgLayer: true,
                type: "raster",
                format: "image/jpeg",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
                queryable: false
            },
            "ch.swisstopo.pixelkarte-grau": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-grau"),
                isBgLayer: true,
                type: "raster",
                format: "image/jpeg",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
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
                datenherr: OpenLayers.i18n("ch.babs"),
                queryable: true
            },
            "ch.bfs.gebaeude_wohnungs_register": {
                name: OpenLayers.i18n("ch.bfs.gebaeude_wohnungs_register"),
                type: "point",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bfs"),
                queryable: true
            },
            "ch.swisstopo.hiks-dufour": {
                name: OpenLayers.i18n("ch.swisstopo.hiks-dufour"),
                type: "raster",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
                queryable: false
            },
            "ch.swisstopo.hiks-siegfried": {
                name: OpenLayers.i18n("ch.swisstopo.hiks-siegfried"),
                type: "raster",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
                queryable: false
            },
            "ch.swisstopo.vec25-primaerflaechen": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-primaerflaechen"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
                queryable: false
            },
            "ch.swisstopo.vec25-anlagen": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-anlagen"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
                queryable: false
            },
            "ch.swisstopo.vec25-gwn-gewassernetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-gwn-gewassernetz"),
                type: "mixed",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
                queryable: false
            },
            "ch.swisstopo.vec25-gebaeude": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-gebaeude"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
                queryable: false
            },
            "ch.swisstopo.vec25-eisenbahnnetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-eisenbahnnetz"),
                type: "line",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
                queryable: false
            },
            "ch.swisstopo.gg25-gemeinde-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.gg25-gemeinde-flaeche.fill"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
                queryable: true
            },
            "ch.swisstopo.gg25-bezirk-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.gg25-bezirk-flaeche.fill"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
                queryable: true
            },
            "ch.swisstopo.gg25-kanton-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.gg25-kanton-flaeche.fill"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
                queryable: true
            },
            "ch.swisstopo.gg25-land-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.gg25-land-flaeche.fill"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
                queryable: false
            },
            "ch.swisstopo.fixpunkte-agnes": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-agnes"),
                type: "point",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
                queryable: true
            },
            "ch.swisstopo.fixpunkte-lage": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-lage"),
                type: "point",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
                queryable: true
            },
            "ch.swisstopo.fixpunkte-hoehe": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-hoehe"),
                type: "point",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
                queryable: true
            },
            "ch.bfs.arealstatistik-1985": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-1985"),
                type: "mixed",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bfs"),
                queryable: true
            },
            "ch.bfs.arealstatistik-1997": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-1997"),
                type: "mixed",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bfs"),
                queryable: true
            },
            "ch.swisstopo.vec200-transportation-oeffentliche-verkehr": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-transportation-oeffentliche-verkehr"),
                type: "mixed",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
                queryable: true
            },
            "ch.swisstopo.vec200-transportation-strassennetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-transportation-strassennetz"),
                type: "mixed",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.swisstopo"),
                queryable: true
            },
            "ch.bafu.bundesinventare-amphibien": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-amphibien"),
                type: "mixed",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: true
            },
            "ch.bafu.ren-extensive_landwirtschaftsgebiete": {
                name: OpenLayers.i18n("ch.bafu.ren-extensive_landwirtschaftsgebiete"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: false
            },
            "ch.bafu.ren-feuchtgebiete": {
                name: OpenLayers.i18n("ch.bafu.ren-feuchtgebiete"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: false
            },
            "ch.bafu.ren-fliessgewaesser_seen": {
                name: OpenLayers.i18n("ch.bafu.ren-fliessgewaesser_seen"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: false
            },
            "ch.bafu.ren-trockenstandorte": {
                name: OpenLayers.i18n("ch.bafu.ren-trockenstandorte"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: false
            },
            "ch.bafu.ren-wald_ueber_1000_meter": {
                name: OpenLayers.i18n("ch.bafu.ren-wald_ueber_1000_meter"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: false
            },
            "ch.bafu.ren-wald_unter_1000_meter": {
                name: OpenLayers.i18n("ch.bafu.ren-wald_unter_1000_meter"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: false
            },
            "ch.bafu.hydrologie-hydromessstationen": {
                name: OpenLayers.i18n("ch.bafu.hydrologie-hydromessstationen"),
                type: "point",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: true
            },
            "ch.bfs.arealstatistik-waldmischungsgrad": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-waldmischungsgrad"),
                type: "raster",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bfs"),
                queryable: false
            },
            "ch.bfs.arealstatistik-hintergrund": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-hintergrund"),
                type: "mixed",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bfs"),
                queryable: false
            },
            "ch.bafu.bundesinventare-auen": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-auen"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: true
            },
            "ch.bafu.bundesinventare-bln": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-bln"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: true
            },
            "ch.bafu.bundesinventare-flachmoore": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-flachmoore"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: true
            },
            "ch.bafu.bundesinventare-hochmoore": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-hochmoore"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: true
            },
            "ch.bafu.bundesinventare-jagdbanngebiete": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-jagdbanngebiete"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: true
            },
            "ch.bafu.bundesinventare-moorlandschaften": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-moorlandschaften"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: true
            },
            "ch.bafu.bundesinventare-vogelreservate": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-vogelreservate"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: true
            },
            "ch.bafu.fauna-steinbockkolonien": {
                name: OpenLayers.i18n("ch.bafu.fauna-steinbockkolonien"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: true
            },
            "ch.bafu.schutzgebiete-paerke_nationaler_bedeutung": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-paerke_nationaler_bedeutung"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: true
            },
            "ch.bafu.schutzgebiete-ramsar": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-ramsar"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: true
            },
            "ch.bafu.schutzgebiete-schweizerischer_nationalpark": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-schweizerischer_nationalpark"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: false
            },
            "ch.bafu.showme-kantone_hochwasser": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_hochwasser"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: false
            },
            "ch.bafu.showme-kantone_rutschungen": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_rutschungen"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: false
            },
            "ch.bafu.showme-kantone_sturzprozesse": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_sturzprozesse"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: false
            },
            "ch.bafu.showme-kantone_lawinen": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_lawinen"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: false
            },
            "ch.bafu.showme-gemeinden_hochwasser": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_hochwasser"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: false
            },
            "ch.bafu.showme-gemeinden_rutschungen": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_rutschungen"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: false
            },
            "ch.bafu.showme-gemeinden_sturzprozesse": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_sturzprozesse"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: false
            },
            "ch.bafu.showme-gemeinden_lawinen": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_lawinen"),
                type: "polygon",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: false
            },
            "ch.bafu.wasser-entnahme": {
                name: OpenLayers.i18n("ch.bafu.wasser-entnahme"),
                type: "point",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: true
            },
            "ch.bafu.wasser-leitungen": {
                name: OpenLayers.i18n("ch.bafu.wasser-leitungen"),
                type: "line",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: true
            },
            "ch.bafu.wasser-rueckgabe": {
                name: OpenLayers.i18n("ch.bafu.wasser-rueckgabe"),
                type: "point",
                format: "image/png",
                datenherr: OpenLayers.i18n("ch.bafu"),
                queryable: true
            }
        };
    }
});
// create the singleton
GeoAdmin.layers = new Layers();
})();

