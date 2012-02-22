Ext.namespace('App');

App.Tools = function(map) {
    var getTbarItems = function(map) {
         return [new GeoAdmin.BaseLayerTool({map: map, slider: {width: 100}}),
           new GeoAdmin.NavigationHistory({defaults: {cls: 'x-btn-no-over'}, map: map}),
           new GeoAdmin.SwissSearchComboBox({map: map, width: 200}),
           '->'];
    };


     Ext.apply(this, {
        tbar: null
     });
     this.tbar = getTbarItems(map);
};
