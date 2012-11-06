GeoAdmin.OpenLayersImgPath = "../../Map/img/";

var mapPanel;

function init() {
   GeoAdmin.webServicesUrl = (GeoAdmin.protocol ? GeoAdmin.protocol : 'http:') + '//mf-chsdi0t.bgdi.admin.ch';
    
    mapPanel = new GeoAdmin.MapPanel({renderTo: Ext.getBody(),
        region: "center",
        width: 800,
        height: 600,
        map: new GeoAdmin.Map()});
    
    mapPanel.map.addLayerByName("ch.bafu.swissprtr");
    
    mapPanel.map.addControls([new GeoAdmin.ExtendedTooltip({autoActivate: true})]);
}
