/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/*
 * @include OpenLayers/Projection.js
 * @include OpenLayers/Lang.js
 * @include OpenLayers/Geometry/Point.js
 * @include OpenLayers/Geometry/Polygon.js
 * @include OpenLayers/Feature/Vector.js
 * @include proj4js/lib/defs/EPSG21781.js
 * @include Map/lib/EPSG2056.js
 */
 
Ext.namespace('GeoAdmin');

GeoAdmin.Geolocation = Ext.extend(Ext.Button, {

    /** api: config[map]
     *
     *  ``OpenLayers.Map`` The map on which the geolocation is connected to
     *  Defaults to ``null``
     */
    map: null,
    
    /** api: property[zoomToExtentThresholdZoom]
     *
     *  ``Number`` The zoom level up to which we zoom to the extent of the
     *  geolocated position (including precision). If we have a very accurate
     *  geolocation that results in boundingbox in a very detailed zoomlevel, we
     *  might run into bad looking background layers if we would always simply
     *  zoom to the extent. If such a case (very high geolocation accuracy and
     *  the resulting zoomlevel exceeds the zoomToExtentThresholdZoom-property)
     *  occurs, we just set the center of the map instead of also zooming.
     */
    zoomToExtentThresholdZoom: 8,
    
    /** private: config[geolocationVectorLayer]
     *
     *  ``OpenLayers.Layer.Vector`` The layer to show geolocation information on
     */
    geolocationVectorLayer: null,
    	
    initComponent: function() {
       this.cls = "geolocation-btn";
       this.iconCls = "geolocation-icon";
       this.tooltip = OpenLayers.i18n('Use current location');
       this.enableToggle = true;
       this.handler = this.geolocate;  
       this.addGeolocationLayer(); 
       GeoAdmin.Geolocation.superclass.initComponent.call(this);
       
    },
    
    
    /** private: method[addGeolocationLayer]
     *
     *  Adds the geolocation vector layer
     */
    addGeolocationLayer: function() {
        this.geolocationVectorLayer = new OpenLayers.Layer.Vector(
            'geolocation-vector',
            {
              projection: this.map.getProjection(this.map),
              displayInLayerSwitcher: false
            }
        );
        this.map.addLayer(this.geolocationVectorLayer);
        this.map.setLayerIndex(this.geolocationVectorLayer, this.map.layers.length);      
    },
    
    /** private: method[addGeolocationFeatures]
     *
     * Add geolocation features
     */
     addGeolocationFeatures: function(coord, vector, accuracy) {
     
         circleStyle = {
             fillColor: '#FF8C00',
             strokeColor: '#FF8C00',
             fillOpacity: 0.3,
             strokeOpacity: 1,
             strokeWidth: 2
         };
         positionStyle = {
             fillColor: '#FF0000',
             strokeColor: '#FF0000',
             fillOpacity: 0.5,
             strokeOpacity: 1,
             strokeWidth: 2,
             pointRadius: 10
         };
         var point = new OpenLayers.Geometry.Point(coord.lon,coord.lat);
         precisionCircle = OpenLayers.Geometry.Polygon.createRegularPolygon(
            point,
            accuracy / 2,
            50,
            0
         );
         ptFeature = new OpenLayers.Feature.Vector(
             point,
             0,
             positionStyle
         );
         circleFeature = new OpenLayers.Feature.Vector(
             precisionCircle,
             {},
             circleStyle
         );
         vector.addFeatures([circleFeature, ptFeature]);
         
         var precisionExtent = vector.getDataExtent();
         var zoom = this.map.getZoomForExtent(precisionExtent);
         map.setCenter(positionCH, zoom);
         
     },
    
    
    /** private: method[geolocate]
     *
     *  Get the current posistion and recenter
     */
    geolocate: function() {
        me = this;
        if (this.pressed) {    
            if (navigator.geolocation) {
                /* geolocation is available  */
               navigator.geolocation.getCurrentPosition(function(position) {
                   var accuracy = position.coords.accuracy;
                   positionCH = new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude);
                   positionCH.transform("EPSG:4326", me.map.getProjection(map));
                   me.addGeolocationFeatures(positionCH, me.geolocationVectorLayer, accuracy); 
               });
           } else {
               alert(OpenLayers.i18n("Your browser doesn't support geolocation. Upgrade to a modern browser."));
           }
       } else {
           if (me.geolocationVectorLayer.features.length != 0) { me.geolocationVectorLayer.removeAllFeatures(); }
       }
    }
})

/** api: xtype = ga_geolocation */
Ext.reg("ga_geolocation", GeoAdmin.Geolocation);