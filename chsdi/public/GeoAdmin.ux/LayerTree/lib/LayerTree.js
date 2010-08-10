/*
 * @requires OpenLayers/Lang.js
 *
 * @include GeoExt/data/LayerStore.js
 * @include GeoExt/widgets/tree/LayerContainer.js
 * @include GeoExt/widgets/LayerOpacitySlider.js
 * @include LayerTree/lib/LayerNode.js
 * @include LayerTree/lib/ActionsMixin.js
 * @include LayerTree/lib/ComponentMixin.js
 */

/**
 */
GeoAdmin.LayerTree = Ext.extend(Ext.tree.TreePanel, {

    map: null,

    // default settings
    title: OpenLayers.i18n("Layer Selection"),
    rootVisible: false,
    autoScroll: true,
    containerScroll: true,
    height: 262,
    lines: false,
    cls: "geoadmin-layertree",
    loader: {
        applyLoader: false
    },

    /**
     */
    initComponent: function() {

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
                    actions: [{
                        action: "close",
                        qtip: OpenLayers.i18n("hide layer options")
                    }, {
                        action: "open",
                        qtip: OpenLayers.i18n("show layer options")
                    }, {
                        action: "pipe-up",
                        qtip: "",
                        update: function(el) {
                            // "this" references the tree node
                            this.hideIfFirst(el);
                        }
                    }, {
                        action: "up",
                        qtip: OpenLayers.i18n("move layer up"),
                        update: function(el) {
                            // "this" references the tree node
                            this.hideIfFirst(el);
                        }
                    }, {
                        action: "pipe-down",
                        qtip: "",
                        update: function(el) {
                            // "this" references the tree node
                            this.hideIfLast(el);
                        }
                    }, {
                        action: "down",
                        qtip: OpenLayers.i18n("move layer down"),
                        update: function(el) {
                            // "this" references the tree node
                            this.hideIfLast(el);
                        }
                    }, {
                        action: "pipe",
                        qtip: ""
                    }, {
                        action: "delete",
                        qtip: OpenLayers.i18n("remove layer")
                    }, {
                        action: "pipe",
                        qtip: ""
                    }],
                    component: this.createNodeComponent
                }
            }
        };

        // the action listener
        this.listeners = {
            "action": this.onNodeActionClick,
            scope: this
        };

        GeoAdmin.LayerTree.superclass.initComponent.apply(this, arguments);
    },

    /**
     */
    onNodeActionClick: function(node, action, evt) {
        var layer = node.layer;
        switch (action) {
            case "down":
                layer.map.raiseLayer(layer, -1);
                break;
            case "up":
                layer.map.raiseLayer(layer, +1);
                break;
            case "delete":
                layer.destroy();
                break;core
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

    /**
     */
    createNodeComponent: function(node, ct) {
        return new Ext.Toolbar({
            cls: "geoadmin-toolbar",
            ctCls: "line-height-zero",
            hidden: false,
            buttons: [
                OpenLayers.i18n("Opacity:"),
                new GeoExt.LayerOpacitySlider({
                    layer: node.layer,
                    aggressive: true,
                    // layer.bodid doesn't exist at this point. See this with
                    // our favorite main developer...
                    //plugins: new GeoAdmin.LayerTree.LayerOpacitySliderLabel(
                    //    node.layer.bodid + '-opacity-lbl'
                    //),
                    width: 100
                }),
                // layer.bodid doesn't exist at this point. See this with
                // our favorite main developer...
                //new GeoAdmin.LayerTree.TextItem({
                //    id: node.layer.bodid + "-opacity-lbl",
                //    opacity: node.layer.opacity
                //}),
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
                    // we need to couple this with the search combo. See this
                    // with our favorite main developer...
                    handler: function() {
                    }
                })
            ]
        });
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
 */
GeoAdmin.LayerTree.LayerOpacitySliderLabel = Ext.extend(Ext.Component, {
    target: null,
    el: null,
    constructor: function(target) {
        this.target = target;
    },
    init: function(slider) {
        slider.on("change", this.change, this);
    },
    change: function(slider, value) {
        if (!this.el) {
            this.el = Ext.get(this.target);
        }
        this.el.dom.innerHTML = value + "%";
    }
});

/**
 */
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
