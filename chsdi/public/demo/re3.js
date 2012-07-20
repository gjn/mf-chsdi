var map,
swisssearch,
layertool;
var $;

if (!window.GeoAdmin) {
    window.GeoAdmin = {};
}

function init() {
    $ = OpenLayers.Util.getElement;
    map = new GeoAdmin.Map("mymap", {});
    map.switchComplementaryLayer('ch.swisstopo.pixelkarte-farbe', {
        opacity: 100
    });
    map.zoomTo(3);
    var control = new OpenLayers.Control.MousePosition({
        numDigits: 0,
        prefix: OpenLayers.i18n("Coordinates (m):")
        });
    map.addControl(control);
    map.events.register("mousemove", map, function(e) {
        var position = this.events.getMousePosition(e);
        OpenLayers.Util.getElement("coords").innerHTML = map.getLonLatFromPixel(position);
    });
    swisssearch = new GeoAdmin.SwissSearchCombo('swisssearch-div', {
        map: map
    });

    layertool = new GeoAdmin.LayerCombo({
        div: 'layertool',
        map: map
    });

}

GeoAdmin.LayerCombo = OpenLayers.Class({
    div: null,
    map: null,

    initialize: function(options) {
        this.div = OpenLayers.Util.getElement(options.div);
        this.map = options.map;
        var layers = options.layers || ["ch.swisstopo.pixelkarte-farbe", "ch.swisstopo.pixelkarte-grau", "ch.swisstopo.swissimage", "ch.kantone.hintergrund-farbe", "ch.swisstopo.tml3d-hintergrund-karte", "voidLayer"];
        var selectEl = document.createElement('select');
        selectEl.id = 'backgroundlayer';

        for (var i = 0, len = layers.length; i < len; i++) {
            id = layers[i];
            //   if (GeoAdmin.layers.layers[id]) {
            var optionEl = document.createElement('option');
            optionEl.id = id;
            optionEl.value = id;
            optionEl.innerHTML = OpenLayers.i18n(id);
            selectEl.appendChild(optionEl);
            // }
            }
        this.div.appendChild(selectEl);

        OpenLayers.Element.addClass(this.div, 'geoadmin-layertool')

            selectEl.onchange = function(event) {
            var layerId = event.target.value;
            if (layerId == 'ch.swisstopo.swissimage') {
                options.map.complementaryLayer.setOpacity(0.0);
            } else {
                options.map.switchComplementaryLayer(layerId);
                options.map.complementaryLayer.setOpacity(1.0);
            }
            

        }
    }
})
