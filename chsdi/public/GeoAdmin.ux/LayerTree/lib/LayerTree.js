/*
 * @requires OpenLayers/Lang.js
 *
 * @include GeoExt/data/LayerStore.js
 * @include GeoExt/widgets/tree/LayerContainer.js
 * @include GeoExt/widgets/LayerOpacitySlider.js
 * @include LayerTree/lib/LayerNode.js
 * @include LayerTree/lib/ActionsMixin.js
 * @include LayerTree/lib/ComponentMixin.js
 * @include LayerTree/lib/TreeEventModel.js
 *
 * @include BodSearch/lib/BodSearchWindow.js
 */

/** api: (define)
 *  module = GeoAdmin
 *  class  = LayerTree
 *  base_link = `Ext.tree.TreePanel <http://dev.sencha.com/deploy/dev/docs/?class=Ext.tree.TreePanel>`_
 */

/** api: example
 *  Sample code to create a layer tree (see also `demo <//api.geo.admin.ch/main/wsgi/doc/build/widgets/sdiwidgetsexamples2.html#>`_):
 *
 *  .. code-block:: javascript
 *
 *     var map6 = new GeoAdmin.Map("mymap6", {doZoomToMaxExtent: true});
 *     map6.addLayerByName("ch.swisstopo.gg25-kanton-flaeche.fill");
 *     var layertree = new GeoAdmin.LayerTree({
 *         map: map6,
 *         renderTo: "mylayertree6",
 *         width: 300
 *     });
 *
 */

/** api: constructor
 *  .. class:: LayerTree(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.LayerTree``
 *
 *  Create a GeoAdmin layer tree. Visibility, opacity, metadata and display can be managed with this layer tree.
 */

GeoAdmin.LayerTree = Ext.extend(Ext.tree.TreePanel, {

    /** api: config[map]
     *  ``OpenLayers.Map``
     *  A `OpenLayers.Map <http://dev.openlayers.org/docs/files/OpenLayers/Map-js.html>`_ instance
     */
    map: null,

    /** api: config[showZoomToExtentAction]
     *  ``Boolean``
     *  Tells whether to show the 'zoomtoextent' action. Defaults to false.
     */
    showZoomToExtentAction: false,

    /** api: config[infoWindowClass]
     * ``String``
     * The info window class to be used when user clicks on 'i'.
     * Defaults to 'GeoAdmin.BodSearchWindow'
     */
    infoWindowClass: 'GeoAdmin.BodSearchWindow',

    // default settings
    rootVisible: false,
    autoScroll: true,
    containerScroll: true,
    height: 262,
    lines: false,
    cls: "geoadmin-layertree",
    loader: {
        applyLoader: false
    },

    initComponent: function() {
        this.title = OpenLayers.i18n("Layer Selection");

        // the layer node UI class - a GeoExt LayerNodeUI with
        // actions and component
        var uiClass = Ext.extend(
                Ext.extend(
                        GeoExt.tree.LayerNodeUI,
                        GeoAdmin.ActionsMixin()
                        ),
                GeoAdmin.ComponentMixin()
                );

        // create a layer store for the GeoExt layer container
        var layerStore = new GeoExt.data.LayerStore({map: this.map});

        var actions = [
            {
                action: "close",
                qtip: OpenLayers.i18n("hide layer options")
            },
            {
                action: "open",
                qtip: OpenLayers.i18n("show layer options")
            },
            {
                action: "pipe-up",
                qtip: "",
                update: function(el) {
                    // "this" references the tree node
                    this.hideIfFirst(el);
                }
            },
            {
                action: "up",
                qtip: OpenLayers.i18n("move layer up"),
                update: function(el) {
                    // "this" references the tree node
                    this.hideIfFirst(el);
                }
            },
            {
                action: "pipe-down",
                qtip: "",
                update: function(el) {
                    // "this" references the tree node
                    this.hideIfLast(el);
                }
            },
            {
                action: "down",
                qtip: OpenLayers.i18n("move layer down"),
                update: function(el) {
                    // "this" references the tree node
                    this.hideIfLast(el);
                }
            },
            {
                action: "pipe",
                qtip: ""
            },
            {
                action: "delete",
                qtip: OpenLayers.i18n("remove layer")
            },
            {
                action: "pipe",
                qtip: ""
            }
        ];

        // the tree content
        this.root = {
            nodeType: "gx_layercontainer",
            layerStore: layerStore,
            loader: {
                uiProviders: {
                    "ui": uiClass
                },
                baseAttrs: {
                    nodeType: "geoadmin_layer",
                    uiProvider: "ui",
                    checked: null,
                    actions: actions,
                    component: this.createNodeComponent.createDelegate(this)
                }
            }
        };

        // the action listener
        this.listeners = {
            "action": this.onNodeActionClick,
            scope: this
        };

        GeoAdmin.LayerTree.superclass.initComponent.apply(this, arguments);

        this.getRootNode().on({
            "insert": function(tree, root, node) {
                this.checkInRange(node);
            },
            "append": function(tree, root, node) {
                this.checkInRange(node);
            },
            scope: this
        });
        layerStore.map.events.on({
            "zoomend": function() {
                this.root.cascade(this.checkInRange);
            },
            "moveend": function() {
                this.root.cascade(this.checkInRange);
            },
            scope: this
        });
    },

    /**
     */
    onNodeActionClick: function(node, action, evt) {
        var layer = node.layer;
        switch (action) {
            case "down":
                // Determine the step intervall in order to support aggregated layers
                var counter = 0;
                var step = 1;
                var notFound = true;
                for (var z = parseInt(layer.div.style.zIndex) - 5; z > 105; z = z - 5) {
                    counter++;
                    for (var i = 0; i < layer.map.layers.length; i++) {
                        if (z == layer.map.layers[i].div.style.zIndex) {
                            if (notFound) {
                                step = counter;
                                notFound = false;
                            }
                            break;
                        }
                    }

                }
                layer.map.raiseLayer(layer, -step);

                // Fix the zIndex of the aggregated layers
                for (var i = 0; i < layer.map.layers.length; i++) {
                    if (layer.map.layers[i].layers) {
                        for (var j = 0; j < layer.map.layers[i].layers.length; j++) {
                            layer.map.layers[i].layers[j].div.style.zIndex = layer.map.layers[i].div.style.zIndex - 1 - j;
                        }
                    }
                }
                break;
            case "up":
                // Determine the step intervall in order to support aggregated layers
                var counter = 0;
                var step = 1;
                var notFound = true;
                    
                for (var z = parseInt(layer.div.style.zIndex) + 5; z < 300; z = z + 5) {

                    counter++;
                    for (var i = 0; i < layer.map.layers.length; i++) {
                        if (z == layer.map.layers[i].div.style.zIndex) {
                            if (notFound) {
                                step = counter;
                                notFound = false;
                            }
                            break;
                        }
                    }

                }

                layer.map.raiseLayer(layer, step);

                // Fix the zIndex of the aggregated layers
                for (var i = 0; i < layer.map.layers.length; i++) {
                    if (layer.map.layers[i].layers) {
                        for (var j = 0; j < layer.map.layers[i].layers.length; j++) {
                            layer.map.layers[i].layers[j].div.style.zIndex = layer.map.layers[i].div.style.zIndex - 1 - j;
                        }
                    }
                }
                break;
            case "delete":
                var vector = layer.map.vector;
                if (vector instanceof OpenLayers.Layer.Vector) {
                    vector.destroyFeatures(layer.map.vector.getFeaturesByAttribute('layer_id', layer.layername));
                }
                layer.destroy();
                break;
            case "close":
                node.component.hide();
                var openBtn = Ext.get(node.id + "_open");
                var closeBtn = Ext.get(node.id + "_close");
                closeBtn.hide();
                openBtn.show();
                break;
            case "open":
                node.component.show();
                var openBtn = Ext.get(node.id + "_open");
                var closeBtn = Ext.get(node.id + "_close");
                openBtn.hide();
                closeBtn.show();
                break;
        }
    },

    createNodeComponent: function(node, ct) {
        var uniqueId = node.id + '-opacity-lbl';

        var buttons = [
            OpenLayers.i18n("Opacity:"),
            new GeoExt.LayerOpacitySlider({
                layer: node.layer,
                aggressive: true,
                plugins: new GeoAdmin.LayerTree.SliderLabel(
                        uniqueId
                        ),
                width: 100
            }),
            new GeoAdmin.LayerTree.TextItem({
                id: uniqueId,
                opacity: node.layer.opacity
            }),
            "->",
            new Ext.Action({
                iconCls: node.layer.visibility ? "visibility-on" : "visibility-off",
                tooltip: OpenLayers.i18n("Layer visibility"),
                handler: function() {
                    GeoAdmin.LayerTree.toggleVisibility(node.layer, this);
                }
            }),
            new Ext.Action({
                iconCls: "layer-info",
                tooltip: OpenLayers.i18n("about that layer"),
                handler: function() {
                    if (typeof(node.layer.layername) == "undefined") {
                       alert(OpenLayers.i18n("Meta information are not available for this layer"));
                    } else {
                        // get a reference to the singleton (Function) 
                        // using its name (String)
                        var fn = Ext.namespace(this.infoWindowClass);
                        fn.show(node.layer.layername);
                    }
                },
                scope: this
            })
        ];

        if (this.showZoomToExtentAction) {
            buttons.splice(4, 0, new Ext.Action({
                iconCls: 'zoomtoextent',
                tooltip: OpenLayers.i18n("zoom to extent"),
                handler: function() {
                    var layerConfig = GeoAdmin.layers.layers[node.layer.layername];
                    layerConfig.extent && node.layer.map.zoomToExtent(layerConfig.extent);
                }
            }));
        }

        return new Ext.Toolbar({
            cls: "geoadmin-toolbar",
            ctCls: "line-height-zero",
            hidden: false,
            buttons: buttons
        });
    },

    /**
     * Method: checkInRange
     * Checks if node's layer's max/min scales match current map scale. Also
     * checks if the layer and map extents match.
     *
     * Parameters:
     * node {GeoExt.tree.LayerNode}
     */
    checkInRange: function(node) {
        if (!node.layer) {
            return;
        }
        var layer = node.layer;
        if (node.getUI().rendered) {
            if (!layer.inRange) {
                node.getUI().addClass("gx-tree-layer-outofrange");
            } else {
                node.getUI().removeClass("gx-tree-layer-outofrange");
            }
        } else if (!layer.inRange) {
            node.attributes.cls = "gx-tree-layer-outofrange";
        }
    }
});

/**
 */
GeoAdmin.LayerTree.TextItem = Ext.extend(Ext.Toolbar.Item, {
    constructor: function(config) {
        var s = document.createElement("span");
        s.id = config.id;
        s.className = "ytb-text";

        if (config.opacity == null) {
            s.innerHTML = "100%";
        } else {
            s.innerHTML = parseInt(config.opacity * 100) + "%";
        }
        GeoAdmin.LayerTree.TextItem.superclass.constructor.call(this, s);
    },
    enable: Ext.emptyFn,
    disable: Ext.emptyFn,
    focus: Ext.emptyFn
});

/**
 * A slider plugin that displays the slider value in a DOM
 * element.
 */
GeoAdmin.LayerTree.SliderLabel = function(target) {
    this.target = target;
};

GeoAdmin.LayerTree.SliderLabel.prototype = {
    init: function(slider) {
        slider.on({
            "change": function(slider, value) {
                if (!this.el) {
                    this.el = Ext.get(this.target);
                }
                if (this.el) {
                    this.el.dom.innerHTML = value + "%";
                }
            },
            scope: this
        });
    }
};

GeoAdmin.LayerTree.toggleVisibility = function(layer, action) {
    layer.setVisibility(!layer.visibility);
    if (action) {
        if (layer.visibility) {
            action.setIconClass("visibility-on");
        } else {
            action.setIconClass("visibility-off");
        }
    }
};

/** api: xtype = ga_layertree */
Ext.reg("ga_layertree", GeoAdmin.LayerTree);
