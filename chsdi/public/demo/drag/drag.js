var api, buttonDrag;

window.GeoAdmin.version="2609111920";
window.GeoAdmin.OpenLayersImgPath="../../GeoAdmin.ux/Map/img/";
window.GeoAdmin.webServicesUrl= "../..";


function init() {
    //map = new GeoAdmin.Map("mymap", {doZoomToMaxExtent: true});

   api = new GeoAdmin.API();
   api.createMapPanel({
       renderTo: "mymap",
       tbar: new Ext.Toolbar(),
       height: 340
    });

    var controlDrawPoint =  new OpenLayers.Control.DrawFeature(api.map.vector, OpenLayers.Handler.Point, { id: 'draw_point'});
    var controlDragPoint =  new OpenLayers.Control.DragFeature(api.map.vector, { id: 'drag_point' });
    
    api.map.addControls([controlDrawPoint, controlDragPoint]);

    api.buttonDraw = new Ext.Button({
        text: "Draw Point",
        width: 55,
        enableToggle: true,
        allowDepress: true,
        handler: function () {
             var controlDraw = api.map.getControlsBy('id', 'draw_point')[0];
             var controlDrag = api.map.getControlsBy('id', 'drag_point')[0];
             
             if (!controlDraw.active) {
                 controlDraw.activate();
             } else {
                 controlDraw.deactivate();
             }
             if (controlDrag.active) {
                 api.buttonDrag.toggle();
                 controlDrag.deactivate();
             }
        }
    }); 

    api.buttonDrag = new Ext.Button({
        text: "Drag Point",
        width: 55,
        enableToggle: true,
        allowDepress: true,
        handler: function () {
             var controlDraw = api.map.getControlsBy('id', 'draw_point')[0];
             var controlDrag = api.map.getControlsBy('id', 'drag_point')[0];

             if (!controlDrag.active) {
                 controlDrag.activate();
             } else {
                 controlDrag.deactivate();
             }
             if (controlDraw.active) {
                 api.buttonDraw.toggle();
                 controlDraw.deactivate();
             }
        }
    });
    
    api.mapPanel.getTopToolbar().add([ "->",
        api.buttonDraw,
        api.buttonDrag
    ]);
}
