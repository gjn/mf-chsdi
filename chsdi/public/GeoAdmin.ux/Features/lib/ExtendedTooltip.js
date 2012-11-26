/*
 * @include Ext/src/ext-core/examples/jsonp/jsonp.js
 *
 * @requires OpenLayers/Control/GetFeature.js
 * @include OpenLayers/Format/GeoJSON.js
 * 
 * @include GeoExt/widgets/Popup.js
 * @include GeoExt/data/FeatureStore.js
 * @requires GeoExt/widgets/grid/FeatureSelectionModel.js
 */

/** api: (define)
 *  module = GeoAdmin
 *  class = ExtendedTooltip
 *  base_link = `OpenLayers.Control.GetFeature <http://dev.openlayers.org/apidocs/files/OpenLayers/Control/GetFeature-js.html>`_
 */

/** api: example
 *  Sample code to create a tooltip (click with left mouse button or press Ctrl + left click to perform a selection by rectangle)
 *
 *  .. code-block:: javascript
 *
 *     var map7 = new GeoAdmin.Map("mymap7", {doZoomToMaxExtent: true});
 *     map7.addLayerByName("ch.swisstopo.gg25-kanton-flaeche.fill");
 *     var tooltip = new GeoAdmin.ExtendedTooltip({
 *         box: true, 
 *         handlerOptions : { 'box': { keyMask: Ext.isMac ? OpenLayers.Handler.MOD_META : OpenLayers.Handler.MOD_CTRL } }
 *      });
 *     map7.addControl(tooltip);
 *     tooltip.activate();
 *
 *
 */

 /** api: constructor
  *  .. class:: ExtendedTooltip(options)
  *
  *  :param options: ``Object`` options
  *
  *  Create a GetFeature control used to show feature information on left mouse click or Ctrl + left mouse click. This control consumes the feature services described `here <http://api.geo.admin.ch/main/wsgi/doc/build/services/sdiservices.html#feature-search>`_
  */
GeoAdmin.ExtendedTooltip = OpenLayers.Class(OpenLayers.Control.GetFeature, {

    id: 'getFeatureRectangle',
    
    layer: null,

    url: null,

    params: {},

    // Animate the first time the window with multiple results opens
    firstAnimate: true,

    // Activate the click function
    click: true,

    // Activate the selection by rectangle
    box: false,

    clickTolerance: 15,

    clickout: true,

    popup: null,

    // List of queryable layers visible in the map
    queryable: [],

    // List of timestamps for the queryable layers
    timestamps: [],

    initialize: function (options) {
        OpenLayers.Control.GetFeature.prototype.initialize.apply(this, arguments);

        if (GeoAdmin.webServicesUrl) {
            this.url = GeoAdmin.webServicesUrl + "/feature/search";
        }
        // This parameter is used to define whether the selection was made with a click or a rectangle
        this.clicked = false;
        this.format = new OpenLayers.Format.GeoJSON({ignoreExtraDims: true});

        this.events.register("featuresselected", this, this.onSelect);
        this.events.register("featureunselected", this, this.onUnselect);   
    },

    setMap: function (map) {
        OpenLayers.Control.GetFeature.prototype.setMap.apply(this, arguments);

        this.map.events.on({
            addlayer: this.updateLayersList,
            removelayer: this.updateLayersList,
            changelayer: this.updateLayersList,
            "scope": this
        });
        this.updateLayersList();
    },

    updateLayersList: function (layer) {
        if (this.map) {
            this.queryable = [];
            this.timestamps = [];
            var layers = this.map.getLayersBy("geoadmin_queryable", true);
            for (var i = 0, len = layers.length; i < len; i++) {
                if (layers[i].visibility) {
                    if (!layers[i].opacity) {
                        this.queryable.push(layers[i].layername);
                        this.timestamps.push(layers[i].timestamp !== undefined ? layers[i].timestamp : 'no');
                    } else {
                        if (layers[i].opacity > 0) {
                            this.queryable.push(layers[i].layername);
                            this.timestamps.push(layers[i].timestamp !== undefined ? layers[i].timestamp : 'no');
                        }
                    }
                }
            }
            // Hide the popup when a layer is added or removed from the map
            if (typeof layer !== 'undefined' && this.popup !== null) {
                if (layer.type === 'removelayer' || layer.type === 'changelayer' 
                        && this.popup && typeof layer.layer.aggregate === 'undefined') {
                    this.popup.hide();
                }
            }
        }
    },

    request: function (bounds, options) {
        this.lastClick = bounds.getCenterLonLat();

        if (this.queryable.length > 0) {
            if (this.popup !== null) { this.popup.hide(); }
            // Set the cursor to "wait" to tell the user we're working.
            OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");

            this.lastClick = bounds.getCenterLonLat();
            this.params = {
                lang: OpenLayers.Lang.getCode(),
                layers: this.queryable.join(","),
                timestamps: this.timestamps.join(","),
                bbox: bounds.toBBOX(),
                scale: Math.round(this.map.getScale()/100) * 100
            };
            
            Ext.ux.JSONP.request(this.url, {
                callbackKey: "cb",
                params: this.params,
                scope: this,
                callback: function(response) {
                    var features = this.format.read(response);
                    this.unselectAll();
                    if (features.length > 0) {
                        this.select(features);
                    } else if (features.length === 0) {
                        this.clicked = false;
                    }
                    // reset the cursor.
                    OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
                }
            });
        }
    },

    activate: function () {
        if (!this.layer) {
            this.layer = this.map.vector;
            if (typeof this.layer === 'undefined') {
                 this.layer = new OpenLayers.Layer.Vector("fake drawing", {
                     displayInLayerSwitcher: false});
            }
            this.map.addLayer(this.layer);
        }
        return OpenLayers.Control.GetFeature.prototype.activate.apply(this, arguments);
    },

    deactivate: function () {
        if (this.popup) {
            this.popup.hide();
        }
        return OpenLayers.Control.GetFeature.prototype.deactivate.apply(this, arguments);
    },

    destroy: function () {
        this.deactivate();
        OpenLayers.Control.GetFeature.prototype.destroy.apply(this, arguments);
    },
    
    // private methode triggers only when the map is clicked, used to parametrize the window
    selectClick: function (evt) {
        OpenLayers.Control.GetFeature.prototype.selectClick.apply(this, arguments);
        this.clicked = true;
    },
    
    onSelect: function (evt) {
        if (this.layer.features.length > 0) { this.layer.removeAllFeatures(); }
        this.layer.addFeatures(evt.features);

        // Define whether the selection was made thanks to a click or a selection by rectangle
        if (!this.clicked && this.box) {
            var item = this.onSelectRectangle(evt);
        } else {
            var item = this.onSelectClick(evt);
        }
        this.createPopup(item);
    },
    
    onSelectClick: function (evt) {
        var html = [];

        for (var i = 0, len = evt.features.length; i < len; i++) {
            html.push(evt.features[i].attributes.html);
        }
        var item = [{ xtype: 'box', html: html }];
        return item;
    },

    numKeys: function(obj) {
        var count = 0;
        for (var prop in obj) {
            count++;
        }
        return count;
    },
    
    //private methode use to prepare the results of the selection by rectangle
    onSelectRectangle: function (evt) {
        //control fo the hoovering
        var hoverControl = new OpenLayers.Control.SelectFeature(this.layer, {
            id: 'hover',
            hover: true,
            highlightOnly: true,
            renderIntent: 'hover',
            allowSelection: false,
            autoActivate: true,
            scope: this
        });
        
        this.map.addControl(hoverControl);
        
        //control for the click
        var clickControl = new OpenLayers.Control.SelectFeature(this.layer, {
            id: 'click',
            hover: false,
            toggle: true
        });
        
        this.map.addControl(clickControl);
        
        // list containing the fids 
        var list_fid = this.list_fid = {};

        // Translate the layer_id and store id in case extended tooltip exists
        Ext.each(evt.features, function(feature) {
            var layer_id = feature.attributes.layer_id;
            if (feature.attributes.extended_info) {
                if (!list_fid.hasOwnProperty(layer_id)) {
                    list_fid[layer_id] = [];
                    list_fid[layer_id] = feature.fid;
                } else {
                    list_fid[layer_id] = list_fid[layer_id] + ',' + feature.fid; 
                }
            }
            feature.attributes.layer_id = OpenLayers.i18n(layer_id);
        });

        var FeatureGroupingStore = Ext.extend(
            Ext.data.GroupingStore,
            GeoExt.data.FeatureStoreMixin()
        );

        var store = new FeatureGroupingStore({
            features: evt.features,
            groupField: 'layer_id',
            fields: [
                'layer_id',
                'preview',
                'html'
            ],
            sortInfo: {
                field: 'preview',
                direction: 'ASC'
            }
        });
        
        var grid = new Ext.grid.GridPanel({
            map: this.map,
            border: false,
            store: store,
            columns: [{
                dataIndex: 'layer_id',
                hidden: true
            }, {
                dataIndex: 'preview'
            }],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                showGroupName: false,
                groupTextTpl: [
                    '{text}',
                    ' (' ,
                    '{[values.rs.length >= 50 ? "',
                    '<a href=\'javascript:void(0);\'',
                    ' qtip=\'', OpenLayers.i18n('Max features notice'), '\'',
                    '> &gt;= </a>" : ""]}',
                    '{[values.rs.length]}',
                    ' {[values.rs.length > 1 ? "Items" : "Item"]})'
                ].join('')
            }),
            hideHeaders: true,
            sm: new GeoExt.grid.FeatureSelectionModel({
                singleSelect: true,
                previousSelectedRow: null,
                selectControl: clickControl,
                autoActivateControl: true,
                el: null,
                toggled: false,
                handleMouseDown: function(g, rowIndex, e) {
                    if(e.button !== 0 || this.isLocked()) {
                        return;
                    }
                    var view = this.grid.getView();
                    if(e.shiftKey && !this.singleSelect && this.last !== false) {
                        var last = this.last;
                        this.selectRange(last, rowIndex, e.ctrlKey);
                        this.last = last;
                        view.focusRow(rowIndex);
                    } else {
                        var isSelected = this.isSelected(rowIndex);
                        if ( e.ctrlKey && isSelected) { 
                            this.deselectRow(rowIndex);
                        } else if (!isSelected || this.getCount() > 1) { 
                            if (!this.toggled) { // avoid to reselect the row after mouse down         
                                this.selectRow(rowIndex, e.ctrlKey || e.shiftKey);
                                view.focusRow(rowIndex);
                            }
                        }
                    }
                },
                listeners: {
                    rowselect: function(sm, index, feature) {
                        var el = Ext.get(grid.getView().getRow(index));     
                        this.el = el; 
                        this.el.tooltip = el.tooltip;
                        if (this.el.tooltip.hidden) {
                            this.el.tooltip.show.defer(1, this.el.tooltip, [this.el]);
                        } 
                    },
                    rowdeselect: function(sm, index, feature) {
                        if (!this.el.tooltip.hidden) {
                            this.el.tooltip.hide.defer(1, this.el.tooltip, [this.el]);
                        }
                    }
                }
            }),
            listeners: { 
                viewready: function(grid) {
                    var view = grid.getView();
                    var index = 0;
                    var map = this.map;
                    grid.store.each(function(record) {
                        var el = view.getRow(index);
                        var html = record.get('html');
                        var tooltip = new GeoAdmin.ClickToolTip({
                            cls: 'geoadmin-click-tooltip',
                            autoHide: false,
                            closable: true,
                            width: 430, // required by the service (the html contains a table with fixed size)
                            showDelay: 5,
                            hideDelay: 100000,
                            target: el, 
                            html: html,
                            anchor: 'left'
                        }); 
                        index++;
                        // keep a reference to the tooltip to show it
                        // programmatically later
                        Ext.get(el).tooltip = tooltip;

                        // Add the buttons in the rows
                        var row = Ext.get(el).dom.childNodes[0].rows[0].childNodes[1];
                        
                        var zoomButton = document.createElement('input');
                        zoomButton.className = "zoom-button-out";
                        zoomButton.type = 'button';
                        zoomButton.style.cssFloat = 'right !important';
                        zoomButton.style.height = '17px';
                        zoomButton.style.width = '17px';
                        zoomButton.title = OpenLayers.i18n('Zoom to object');
                        
                        var bounds = this.data.feature.bounds;
                        zoomButton.onclick = function() {
                            if (bounds.left === bounds.right) {
                                var center = bounds.getCenterLonLat();
                                map.setCenter(center, 7);
                            } else {
                                map.zoomToExtent(bounds);
                            }
                        }
                        zoomButton.onmouseover = function () {
                            zoomButton.className = "zoom-button-over";
                        }
                        zoomButton.onmouseout = function () {
                            zoomButton.className = "zoom-button-out";
                        }
                        row.appendChild(zoomButton);
                    });
                },
                rowmousedown: function(grid, index, feature) {
                    var el = Ext.get(grid.getView().getRow(index));
                    var sm = grid.selModel;
                    sm.toggled = false; // per default toggeled is false
                    if (index != -1 && sm.isSelected(index)) {
                        sm.toggled = true;
                        sm.deselectRow(index, false);
                    }
                },
                scope: this
            }
        });
        
        return [grid];
    },
    
    createPopup: function (item, showFeature) {
        // Extra parameter showFeature set to true when this method is called from GeoAdmin.Feature.prototype.showCb
        if (showFeature === true) {
            this.clicked = true;
        }
        this.popup = new Ext.Window({
            animateTarget: this.firstAnimate && !this.clicked ? this.map.getViewport() : null,
            cls: this.clicked ? 'click-popup' : 'box-popup',
            layout: 'fit',
            width: this.clicked ? 450 : 320,
            height: this.clicked ? 'auto' : 285,
            footer: this.clicked ? true : false,
            footerCfg: this.clicked && this.box ? {
               tag: 'span',
               cls: 'window-feature-footer',
               html: Ext.isMac ? 
                    OpenLayers.i18n('QueryByRect.MetaKeyUsageNotice') :
                    OpenLayers.i18n('QueryByRect.CtrlKeyUsageNotice')
               } : null,
            title: OpenLayers.i18n('Feature tooltip'),
            toolTemplate: new Ext.XTemplate(
                '<tpl if="id==\'export_all\' && extended_info==true">',
                '<div class="x-window-export_all-tool">'+OpenLayers.i18n('Info+')+'</div>',
                '</tpl>',
                '<tpl if="id==\'print\'">',
                '<div class="x-window-print-tool">'+OpenLayers.i18n('print')+'</div>',
                '</tpl>',
                '<tpl if="id==\'close\'">',
                '<div class="x-tool x-tool-{id}">&#160;</div>',
                '</tpl>'
            ),
            tools:[{
                id: 'export_all',
                // if there are objects in list_fid -> extended info exists
                extended_info: this.numKeys(this.list_fid) && !this.clicked > 0 ? true : false,
                scope: this,
                qtip: OpenLayers.i18n('Export all'),
                handler: function(evt, toolEl, panel, tc) {
                    var layers = this.params.layers.split(',');
                    for (var i = 0; i < layers.length; i++) {
                        var url = this.url.split('search')[0];
                        var layer = layers[i];
                        if (this.list_fid.hasOwnProperty(layer)) {
                            var par = encodeURIComponent(this.list_fid[layer] + '.html?layer=' + layer + '&lang=' + this.params.lang);
                            url = url + par;
                            window.open(url, '_blank');
                        }
                    }}
                },{
                id: 'print',
                scope: this,
                qtip: OpenLayers.i18n('Print all'),
                handler: function(evt, toolEl, panel, tc) {
                    delete this.params['cb'];
                    this.params['print'] = true;
                    var url = Ext.urlAppend(this.url, Ext.urlEncode(this.params));
                    window.open(url, '', 'width=500, height=400, toolbar=no, location=no,' +
                                         'directories=no, status=no, menubar=no, scrollbars=yes,' +
                                         'copyhistory=no, resizable=no');
                    }
            }],
            closeAction: 'hide',
            items: item,
            listeners : {
                hide: function(evt) {
                    if (this.layer.features.length > 0) { this.layer.removeAllFeatures(); }
                    
                    var hooverControl = this.map.getControl('hover');
                    if (hooverControl instanceof OpenLayers.Control.SelectFeature) {
                        hooverControl.deactivate();
                        this.map.removeControl(hooverControl);
                    }
                    var clickControl = this.map.getControl('click');
                    if (clickControl instanceof OpenLayers.Control.SelectFeature) {
                        clickControl.deactivate();
                        this.map.removeControl(clickControl);
                    }
                    if (typeof this.popup !== 'undefined' && this.popup !== null && this.popup.footer !== null && typeof this.popup.footer !== 'undefined') {
                        var sm = evt.items.items[0].selModel;
                        if (typeof sm !== 'undefined' && sm.el !== null && typeof sm.el.tooltip !== 'undefined') {
                            if (!sm.el.tooltip.hidden) {
                                sm.el.tooltip.hide();
                            }
                        }
                    }
                    this.popup = null;
                },
                show: function(evt) {
                    if (this.popup.footer && this.lastClick !== undefined) { 
                        var mapBox = Ext.fly(this.map.div).getBox(true);
                        this.popup.setPosition(mapBox.x + mapBox.width/2 - this.popup.width/2, mapBox.y);
                    } else {
                        // First animation performed
                        this.firstAnimate = false;
                        var mapViewPort = this.map.getViewport();
                        if (mapViewPort) { 
                            var OffsetTop = 0;
                            if (mapViewPort.offsetParent) {
                                do {
                                    OffsetTop += mapViewPort.offsetTop;
                                } while (mapViewPort = mapViewPort.offsetParent);
                            } 
                            this.popup.setPosition(40, OffsetTop + 54);
                        }
                   }
                   this.popup.doLayout();            
                },
                move: function (evt) {
                    if (!this.popup.footer) {
                        var sm = evt.items.items[0].selModel;
                        if (sm.el) {
                            if (!sm.el.tooltip.hidden) {
                                sm.el.tooltip.hide();
                            }
                        }
                    }
                },
                scope: this
            }
         });
         this.popup.show();
         // return clicked to intial value
         this.clicked = false;
    },

    onUnselect: function (evt) {
        if (evt && evt.feature) {
            this.layer.removeFeatures([evt.feature]);
        } 
        if (this.popup) {
            this.popup.hide();
        }
    }
});

// The following code fixes a bug in ExtJS with which the 'ext:anchor'
// attribute is not taken into account
Ext.sequence(Ext.QuickTip.prototype, 'onTargetOver', function (e) {
    var t = e.getTarget();
    if(!t || t.nodeType !== 1 || t == document || t == document.body){
        return;
    }
    this.origAnchor = this.anchor;
});

GeoAdmin.ClickToolTip = Ext.extend(Ext.ToolTip,{
    initTarget : function(target){ 
        var t; 
        if((t = Ext.get(target))){ 
            if(this.target){
                var tg = Ext.get(this.target);
                this.mun(tg, 'click', this.onTargetOver, this);
                this.mun(tg, 'mouseover', this.onTargetOver, this); 
                this.mun(tg, 'mouseout', this.onTargetOut, this);
                this.mun(tg, 'mousemove', this.onMouseMove, this);                          
            }
            this.target = t;
        }
        if(this.anchor){
            this.anchorTarget = this.target;
        }
    }
});
Ext.reg('ClickToolTip', GeoAdmin.ClickToolTip);
