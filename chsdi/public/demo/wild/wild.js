// You need to put the print button outside the ini
var api, wrmap, buttonPrint;



function qualifyURL(url){
    var img = document.createElement('img');
    img.src = url; 
    url = img.src; 
    img.src = null; 
    return url.replace(/\/$/, "");;
}

window.GeoAdmin.version="2609111920";
window.GeoAdmin.OpenLayersImgPath="../../GeoAdmin.ux/Map/img/";
window.GeoAdmin.webServicesUrl= "../..";


function init() {
  var popupRendered = false;
  OpenLayers.ProxyHost = "ogcproxy?url=";
  api = new GeoAdmin.API({});  // French: fr
	
	var o = {
		renderTo: 'mymap'
	};
	
  wrmap = api.createMapPanel(o);
		
	// LOADING THE WMTS LAYERS
	// using this function, the WMTS layers are loaded
	wrmap.map.addLayerByName('ch.bafu.wildruhezonen-jagdbanngebiete', {opacity: 0.60});
	wrmap.map.addLayerByName('ch.bafu.wege-wildruhezonen-jagdbanngebiete', {opacity: 1});
	
	// define a print button
	var printAction = new GeoAdmin.Print({
		text: 'Print',
		//printBaseUrl: 'wsgi/print/',
		map: new GeoAdmin.Map(),
		renderTo: 'wrmapbuttons',
		printPanelOptions: {
		   mapPanel: wrmap
		},
		windowOptions: {
		   id: 'printPopup',
		   height: 300,
		   title: 'Print map'
		},
		renderTo: 'wrmapbuttons',
		configureTitle: true, 
		mapTitle: "Wildruhezonen Schweiz"
		// You need to set a mapLogo per default
		//mapLogo: 'http://www.wild.uzh.ch/pi/ti/wildtier_logo_gruen.gif'
	});
  
	this.buttonPrint = new Ext.Button(printAction);
  // Check customParams beforeprint and edit it according to data label
	buttonPrint.baseAction.printProvider.on('beforeprint', function() {
		
	    var formatPrint = buttonPrint.baseAction.printProvider.layout.data.label;
	     buttonPrint.baseAction.printProvider.customParams.app = 'wrz';
	    
	    /* if (formatPrint === 'A4 Querformat') {
	        buttonPrint.baseAction.printProvider.customParams.mapLogo = 'http://www.wild.uzh.ch/pi/ti/wildtier_logo_gruen.gif';
	    } else if (formatPrint === 'A4 Hochformat') {
	        buttonPrint.baseAction.printProvider.customParams.mapLogo = 'http://mf1t.bgdi.admin.ch/~ltgal/515x100.png';
	    } else if (formatPrint === 'A3 Querformat') {                      
	        buttonPrint.baseAction.printProvider.customParams.mapLogo = 'http://mf1t.bgdi.admin.ch/~ltgal/762x100.png';      
	    } else if (formatPrint === 'A3 Hochformat') {                      
	        buttonPrint.baseAction.printProvider.customParams.mapLogo = 'http://dribbble.com/system/users/1130/screenshots/11898/log_rendered2.png';
	    } */
	});                                                                  
	wrmap.map.setCenter(new OpenLayers.LonLat(672000,180000),1);
}
                                      
