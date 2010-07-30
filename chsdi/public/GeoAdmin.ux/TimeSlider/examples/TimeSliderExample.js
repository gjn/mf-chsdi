var map;
var timeSlider;

Ext.onReady(function() {
    map = new GeoAdmin.Map("map");
    map.switchComplementaryLayer("voidLayer");
    timeSlider = new GeoAdmin.TimeSlider({
        map: map,
        renderTo: 'timeslider',
        layerList: [
            [1980, 'ch.swisstopo.hiks-dufour'],
            [1990, 'ch.swisstopo.hiks-siegfried'],
            [2000, 'ch.swisstopo.pixelkarte-grau'],
            [2010, 'ch.swisstopo.pixelkarte-farbe']        
        ]
    })

});