GeoAdmin.OpenLayersImgPath = "../../Map/img/";

OpenLayers.Lang.setCode(OpenLayers.Util.getParameters().lang || "fr");

var map, combo

Ext.onReady(function() {

    map = new GeoAdmin.Map("map", {doZoomToMaxExtent: true});
    var config = [
        [OpenLayers.i18n('Water'),
        'geolocation.png',
        {'layers': [ 
            {'layername': 'ch.bafu.wasser-leitungen', 'opacity': 1, 'visibility': true},
            {'layername': 'ch.bafu.wasser-rueckgabe', 'opacity': 1, 'visibility': true},
            {'layername': 'ch.bafu.wasser-entnahme', 'opacity': 1, 'visibility': true},
            {'layername': 'ch.bafu.bundesinventare-auen', 'opacity': 1, 'visibility': true},
            {'layername': 'ch.bafu.bundesinventare-flachmoore', 'opacity': 1, 'visibility': true},
            {'layername': 'ch.bafu.bundesinventa', 'opacity': 1, 'visibility': true}],
        'complementaryLayer': {'layername': 'ch.swisstopo.pixelkarte-farbe', 'opacity': 1}
        }],
        [OpenLayers.i18n('Agnes'),
        'geolocation_on.png',
        {'layers': [
            {'layername': 'ch.swisstopo.fixpunkte-agnes', 'opacity': 1, 'visibility': true}],
        'complementaryLayer': {'layername': 'ch.swisstopo.pixelkarte-grau', 'opacity': 1}
        }]
    ];

    combo= new GeoAdmin.ThemesCombo({renderTo: "ThemesCombo", map: map, width: 300, themes: config});
});
