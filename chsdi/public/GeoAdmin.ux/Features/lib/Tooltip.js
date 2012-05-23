/*
 * @include Ext/src/ext-core/examples/jsonp/jsonp.js
 *
 * @requires OpenLayers/Control/GetFeature.js
 * @include OpenLayers/Format/GeoJSON.js
 *
 * @include GeoExt/widgets/Popup.js
 * @include GeoExt/data/FeatureStore.js
 * @requires FeatureSelectionModel/lib/GeoExt.ux/GeoExt.ux.FeatureSelectionModel.js
 * @include FeatureSelectionModel/lib/GeoExt.ux/Ext.ux.grid.GridMouseEvents.js
 */

/** api: (define)
 *  module = GeoAdmin
 *  class = Tooltip
 *  base_link = `OpenLayers.Control.GetFeature <http://dev.openlayers.org/apidocs/files/OpenLayers/Control/GetFeature-js.html>`_
 */

/** api: example
 *  Sample code to create a tooltip (click with left mouse button) (see also `demo <http://api.geo.admin.ch/main/wsgi/doc/build/widgets/sdiwidgetsexamples2.html#tooltip>`_)
 *
 *  .. code-block:: javascript
 *
 *     var map7 = new GeoAdmin.Map("mymap7", {doZoomToMaxExtent: true});
 *     map7.addLayerByName("ch.swisstopo.gg25-kanton-flaeche.fill");
 *     var tooltip = new GeoAdmin.Tooltip({});
 *     map7.addControl(tooltip);
 *     tooltip.activate();
 *
 *
 */
 
 /** api: constructor
  *  .. class:: Tooltip(options)
  *
  *  :param options: ``Object`` options
  *
  *  Create a GetFeature control used to show feature information on left mouse click. This control consumes the feature services described `here <http://api.geo.admin.ch/main/wsgi/doc/build/services/sdiservices.html#feature-search>`_
  */
GeoAdmin.Tooltip = OpenLayers.Class(OpenLayers.Control.GetFeature, {

    layer: null,

    url: null,

    params: {},
    
    hoverControl: null,

    firstAnimate: true,

    initialize: function(options) {
        OpenLayers.Control.GetFeature.prototype.initialize.apply(this, arguments);

        if (GeoAdmin.webServicesUrl) {
            this.url = GeoAdmin.webServicesUrl + "/feature/search";
        }
        this.format = new OpenLayers.Format.GeoJSON({ignoreExtraDims: true});

        this.events.register("featuresselected", this, this.onSelect);
        this.events.register("featureunselected", this, this.onUnselect);
    },

    setMap: function(map) {
        OpenLayers.Control.GetFeature.prototype.setMap.apply(this, arguments);

        this.map.events.on({
            addlayer: this.updateLayersList,
            removelayer: this.updateLayersList,
            changelayer: this.updateLayersList,
            "scope": this
        });
        this.updateLayersList();
    },

    updateLayersList: function(layer) {
        if (this.map) {
            this.queryable = [];
            var layers = this.map.getLayersBy("geoadmin_queryable", true);
            
            for (var i = 0, len = layers.length; i < len; i++) {
                if (layers[i].visibility) {
                    if (!layers[i].opacity) {
                        this.queryable.push(layers[i].layername);
                    } else {
                        if (layers[i].opacity > 0) {
                            this.queryable.push(layers[i].layername);
                        }
                    }
                }
            }
            if (typeof layer !== 'undefined' && typeof this.popup !== 'undefined') {
                if (layer.type === 'removelayer' || layer.type === 'changelayer' && this.popup) {
                        this.popup.hide();
                }
            }
        }
    },

    request: function(bounds, options) {
        if (this.box && !this.handlers.box.keyMask) {
            // we deactivate the control to get back to standard navigation
            this.deactivate();
        }

        this.popup && this.popup.removeAll();
        if (this.queryable.length > 0) {
            if (typeof this.popup !== 'undefined') {this.popup.hide();}
            // Set the cursor to "wait" to tell the user we're working.
            OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");

            this.lastClick = bounds.getCenterLonLat();
            this.params = {
                lang: OpenLayers.Lang.getCode(),
                layers: this.queryable.join(","),
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
                    }
                    // reset the cursor.
                    OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
                }
            });
        }
    },

    activate: function() {
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

    deactivate: function() {
        if (this.popup) {
            this.popup.hide();
        }
        return OpenLayers.Control.GetFeature.prototype.deactivate.apply(this, arguments);
    },

    destroy: function() {
        this.deactivate();
        OpenLayers.Control.GetFeature.prototype.destroy.apply(this, arguments);
    },

    onSelect: function(evt) {
        this.layer.addFeatures(evt.features);
        var item, height;
        if (evt.features.length > 1) {
            item = this.onSelectMulti(evt);
            this.singleResult = false;
        } else {
            item = this.onSelectSingle(evt);
            this.singleResult = true;
            var centerObject = evt.features[0].bounds.getCenterLonLat();
            var singlePosition = this.map.getPixelFromLonLat(centerObject);             
        }
        this.popup = new Ext.Window({
           animateTarget: this.firstAnimate && !this.singleResult ? this.map.getViewport() : null,
           cls: 'feature-popup',
           layout: 'fit',
           width: this.singleResult ? 430 : 300,
           height: this.singleResult ? 200 : 283,
           footer: true,
           footerCfg: {
              tag: 'span',
              cls: 'window-feature-footer',
              html: Ext.isMac ? 
                    OpenLayers.i18n('QueryByRect.MetaKeyUsageNotice') :
                    OpenLayers.i18n('QueryByRect.CtrlKeyUsageNotice')
                },
           title: OpenLayers.i18n('Feature tooltip'),
           toolTemplate: new Ext.XTemplate(
               '<tpl if="id==\'print\'">',
               '<div class="x-window-printtool">'+OpenLayers.i18n('print')+'</div>',
               '</tpl>',
               '<tpl if="id!=\'print\'">',
               '<div class="x-tool x-tool-{id}">&#160;</div>',
               '</tpl>'
           ),
           tools:[{
               id: 'print',
               scope: this,
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
           items: [item],
           listeners : {
               hide: function(popup) {
                   if (this.layer.features.length > 0) { this.layer.removeAllFeatures(); }
                   if (this.hoverControl) {
                        this.map.removeControl(this.hoverControl);
                        this.hoverControl.deactivate();
                        this.hoverControl = null;
                   }
                   if (this.clickControl) {
                        this.map.removeControl(this.clickControl);
                        this.clickControl.deactivate();
                        this.clickControl = null;
                   }
               },
               show: function(evt) {
                   if (this.singleResult) { 
                       this.popup.setPosition(singlePosition.x, singlePosition.y - 100);
                   } else {
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
               scope: this
           }
        });
        this.popup.show();
    },

    onSelectSingle: function(evt) {
        return new Ext.BoxComponent({
            html: evt.features[0].attributes.html 
        });
    },

    onSelectMulti: function(evt) {
        if (!this.hoverControl) {
            // control for hovering
            this.hoverControl = new OpenLayers.Control.SelectFeature(this.layer, {
                hover: true,
                highlightOnly: true,
                renderIntent: 'hover',
                allowSelection: false
            });
            this.map.addControl(this.hoverControl);
        }
        
        this.hoverControl.activate();
        
        if (!this.clickControl) {
            //control for the click (zoom in)
            this.clickControl = new OpenLayers.Control.SelectFeature(this.layer, {
                click: true,
                onSelect: function(evt) {
                    this.map.zoomToExtent(evt.bounds);
                    this.unselect(evt);
                    if (this.map.zoom === 13) {
                        this.map.zoomTo(12);
                    }
                }
            });
            this.map.addControl(this.clickControl);
        }
        
        this.clickControl.activate();
        
        // translate the layer_id
        Ext.each(evt.features, function(feature) {
            feature.attributes.layer_id = OpenLayers.i18n(feature.attributes.layer_id);
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
            disableSelection: true,
            sm: new GeoExt.ux.FeatureSelectionModel({
                singleSelect: true,
                hoverControl: this.hoverControl,
                selectControl: this.hoverControl, // required for getLayers to work
                controlMode: 'hover',
                // override handleMouseDown to prevent row click selection
                handleMouseDown: Ext.emptyFn,
                listeners: {
                    rowselect: function(sm, index, r) {
                        var el = Ext.get(grid.getView().getRow(index));
                        if (el) { 
                            // defer show so that it happens after the scroll to element
                            el.tooltip.show.defer(5, el.tooltip, [el]);
                        }
                    },
                    rowdeselect: function(sm, index, r) {
                        var el = Ext.get(grid.getView().getRow(index));
                        if (el) { 
                            // also defer hide to be sure that we don't hide
                            // tooltip before it has been show
                            el.tooltip.hide.defer(5, el.tooltip);
                        }
                    }
                }
            }),
            plugins: [
                Ext.ux.grid.GridMouseEvents
            ],
            listeners: { 
                viewready: function(grid) {
                    var view = grid.getView();
                    var index = 0;
                    grid.store.each(function(record) {
                        var el = view.getRow(index);
                        var html = record.get('html');
                        var tooltip = new Ext.ToolTip({
                            width: 430, // required by the service (the html contains a table with fixed size)
                            showDelay: 5,
                            hideDelay: 5,
                            target: el, 
                            html: html,
                            anchor: 'left'
                        }); 
                        index++;
                        // keep a reference to the tooltip to show it
                        // programmatically later
                        Ext.get(el).tooltip = tooltip;

                    }); 
                },
                rowclick: function(grid, index) {
                    var bounds = grid.store.data.items[index].data.feature.bounds;
                    this.map.zoomToExtent(bounds);
                    if (this.map.zoom === 13) {
                        this.map.zoomTo(12);
                    }
                }   
            }
        });
        return grid;
    },

    onUnselect: function(evt) {
        if (evt && evt.feature) {
            this.layer.removeFeatures([evt.feature]);
        } 
        if (this.popup) {
            this.popup.hide();
        }
    }
});

// The following code allows user to keep the tooltip shown when hovering it
Ext.sequence(Ext.ToolTip.prototype, 'afterRender', function () {
    this.mon(this.el, 'mouseover', function () {
        this.clearTimer('hide');
        this.clearTimer('dismiss');
    }, this);
    this.mon(this.el, 'mouseout', function () {
        this.clearTimer('show');
        if (this.autoHide !== false) {
            this.delayHide();
        }
    }, this);
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
