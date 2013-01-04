var map1, map2, splitted;

window.GeoAdmin.OpenLayersImgPath="../../GeoAdmin.ux/Map/img/";
window.GeoAdmin.webServicesUrl= "../..";

Ext.onReady( function () {
    splitted = false;    

    map1 = new GeoAdmin.Map("mymap1", {doZoomToMaxExtent: true, ratio: 1});
    map2 = new GeoAdmin.Map("mymap2", {doZoomToMaxExtent: true, ratio: 1});

    var tree1 = new GeoAdmin.CatalogTree({renderTo: "mycatalogtree1", map: map1});
    var tree2 = new GeoAdmin.CatalogTree({renderTo: "mycatalogtree2", map: map2});

    var layertree1 = new GeoAdmin.LayerTree({
        map: map1,
        renderTo: "mylayertree1",
        width: 300
    });

    var layertree2 = new GeoAdmin.LayerTree({
        map: map2,
        renderTo: "mylayertree2",
        width: 300
    });

    var selectMap1 = function (event) {
        var mapDiv1 = document.getElementById('mymap1');
        var mapDiv2 = document.getElementById('mymap2');

        var treeDiv1 = document.getElementById('mycatalogtree1');
        var treeDiv2 = document.getElementById('mycatalogtree2');
        
        var layerTreeDiv1 = document.getElementById('mylayertree1');
        var layerTreeDiv2 = document.getElementById('mylayertree2');
 
        treeDiv1.style.display = 'block';
        treeDiv2.style.display = 'none';

        layerTreeDiv1.style.display = 'block';
        layerTreeDiv2.style.display = 'none';

        if (splitted) {
            mapDiv1.style.borderWidth = 2;
            mapDiv2.style.borderWidth = 0;
        }
    };

    var selectMap2 = function (event) {
        var mapDiv1 = document.getElementById('mymap1');
        var mapDiv2 = document.getElementById('mymap2');

        var treeDiv1 = document.getElementById('mycatalogtree1');
        var treeDiv2 = document.getElementById('mycatalogtree2');

        var layerTreeDiv1 = document.getElementById('mylayertree1');
        var layerTreeDiv2 = document.getElementById('mylayertree2');

        treeDiv1.style.display = 'none';
        treeDiv2.style.display = 'block';

        layerTreeDiv1.style.display = 'none';
        layerTreeDiv2.style.display = 'block';

        mapDiv1.style.borderWidth = 0;
        mapDiv2.style.borderWidth = 2;
    };

    map1.events.register('click', map1, selectMap1);
    map2.events.register('click', map1, selectMap2);

    simpleMap = function () {
        var mapDiv1 = document.getElementById('mymap1');
        var mapDiv2 = document.getElementById('mymap2');

        mapDiv1.style.width = 600;
        mapDiv2.style.display = 'none';
        mapDiv1.style.borderWidth = 0;
        mapDiv2.style.borderWidth = 0;
        splitted = false;
    };

    var doubleMap = function () {
        var mapDiv1 = document.getElementById('mymap1');
        var mapDiv2 = document.getElementById('mymap2');

        mapDiv1.style.width = 297;
        mapDiv2.style.display = 'block';
        mapDiv1.style.borderWidth = 2;
        splitted = true;
    };

    var button_simple = new Ext.Button({
        text: 'Simple',
        renderTo: 'simple',
        handler: simpleMap
    });

    var button_double = new Ext.Button({
        text: 'Double',
        renderTo: 'double',
        handler: doubleMap
    });
});

