var map;

function init() {

    OpenLayers.Util.extend(OpenLayers.Lang.en, {
        'Biodiversitaet': 'Biodiversity'
    });
    OpenLayers.Util.extend(OpenLayers.Lang.fr, {
        'Biodiversitaet': 'Biodiversité'
    });
    var params = OpenLayers.Util.getParameters();
    OpenLayers.Lang.setCode(params.lang || 'en');

    map = new GeoAdmin.Map("mymap", {
        doZoomToMaxExtent: true,
        tileManager: null
    });
    map.switchComplementaryLayer("ch.swisstopo.pixelkarte-grau", {
        opacity: 1
    });

    var customCatalog = [{
        text: OpenLayers.i18n('Biodiversitaet'),
        expanded: true,
        children: [{
            layerId: 'ch.bafu.bundesinventare-amphibien'
        }, {
            layerId: 'ch.bafu.bundesinventare-amphibien_wanderobjekte'
        }, {
            layerId: 'ch.bafu.bundesinventare-auen'
        }, {
            layerId: 'ch.bafu.bundesinventare-flachmoore'
        }, {
            layerId: 'ch.bafu.bundesinventare-hochmoore'
        }, {
            layerId: 'ch.bafu.schutzgebiete-paerke_nationaler_bedeutung'
        }, {
            layerId: 'ch.bafu.ren-trockenstandortee'
        }]
    }];

    var tree11 = new GeoAdmin.CatalogTree({
        renderTo: "mycatalogtree11",
        map: map,
        configCatalog: customCatalog,
        singleUnfold: false, // avoid closing the branch when anotherone is selected
        sortCatalog: false, // do not sort catalog leafs automatically
        limitLayers: 50 // increase the number of layers one can add at the same time
    });
    map.addLayerByName('ch.bafu.schutzgebiete-paerke_nationaler_bedeutung');

}
