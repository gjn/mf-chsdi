var map, vector, reader;
window.GeoAdmin.OpenLayersImgPath="../../GeoAdmin.ux/Map/img/";

function handleFileSelect(evt) {
    var files = evt.target.files;

    for (var i = 0; i < files.length; i++) {
        f = files[i];
        reader = new FileReader();

        reader.readAsText(f);
        reader.onloadend = function(evt) {
            if (evt.target.readyState == FileReader.DONE) {
                // Add the kml layer here                
                var format = new OpenLayers.Format.KML();
                var features = format.read(reader.result);
                for (var j = 0; j < features.length; j++) {
                    features[j].geometry.transform("EPSG:4326","EPSG:21781");
                }
                vector.addFeatures(features);
            }
        }
    }
 
}

function init() {

    map = new GeoAdmin.Map("mymap", {doZoomToMaxExtent: true});
    vector = new OpenLayers.Layer.Vector('KML Layer');
    map.addLayer(vector);
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
}

