var map,
swisssearch,
layertool;
var $;

if (!window.GeoAdmin) {
    window.GeoAdmin = {};
}

function init() {

    var parameters = OpenLayers.Util.getParameters();	
    if (parameters.lang) {
 	OpenLayers.Lang.setCode(parameters.lang);
        document.getElementById('lang').children[0].value = parameters.lang;
    }

    $ = OpenLayers.Util.getElement;
    map = new GeoAdmin.Map("mymap", {});
    map.switchComplementaryLayer('ch.swisstopo.pixelkarte-farbe', {
        opacity: 100
    });
    map.zoomTo(5);
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

   GeoAdmin.Translate();

}

toggle_accordion_visibility = function(id) {
    var el = OpenLayers.Util.getElement(id);
    var ar = OpenLayers.Util.getElement('arrow');
    var oc = OpenLayers.Util.getElement('open_close');
    if (el) {
        var  visibility = el.style.display;
        if (visibility == 'none') {
            el.style.display = 'block';
            ar.className = 'arrow down';
            oc.innerHTML = OpenLayers.i18n('Close');
        } else {
            el.style.display = 'none'
            ar.className = 'arrow up';
            oc.innerHTML = OpenLayers.i18n('Permalink.openlink');
        }
    }
}



GeoAdmin.Translate = function(lang) {
    var nodeList = document.querySelectorAll(".i18n");
    for (var i = 0, length = nodeList.length; i < length; i++) {
        var msgId =nodeList[i].innerHTML; 
        nodeList[i].innerHTML = OpenLayers.i18n(msgId); 

    }
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
