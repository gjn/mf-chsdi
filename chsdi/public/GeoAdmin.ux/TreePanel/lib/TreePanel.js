/*global GeoAdmin:true, OpenLayers: true, GeoExt: true */

/*
 * @include GeoExt/widgets/tree/LayerContainer.js
 * @include LegendWindow/lib/LegendWindow.js
 * @include GeoExt/widgets/tree/TreeNodeUIEventMixin.js
 * @include GeoExt/plugins/TreeNodeComponent.js
 * @include GeoExt/widgets/tree/LayerParamNode.js
 * @include BodSearch/lib/BodSearchWindow.js
 */

Ext.namespace("GeoAdmin");

/** api: (define)
 *  module =  GeoAdmin
 *  class = TreePanel
 *  base_link = `Ext.tree.TreePanel <http://dev.sencha.com/deploy/dev/docs/?class=Ext.tree.TreePanel>`
 */

/** api: constructor
 *  .. class:: GeoAdmin.TreePanel(config)
 *
 *  :param config: ``Object`` options.
 *
 *  Valid properties for the options argument:
 *   * ``layerStore`` - ``GeoExt.data.LayerStore``
 *   * ``model`` - ``Array``
 *
 *  :return: ``GeoAdmin.TreePanel``
 *
 *  Create a tree panel using a model. The following layerType values are supported:
 *  - tilecache : an OpenLayers.Layer.TileCache layer
 *  - tilemerge : a WMS-C layer, one OpenLayers.Layer.WMS object is used for multiple items in the tree.
 *  Specify showMetadata true to get metadata links on all subnodes.
 */
GeoAdmin.TreePanel = Ext.extend(Ext.tree.TreePanel, {

    /** api: config[addLegend]
     *  ``Boolean``
     * Should we add a legend button in the title header?
     */
    addLegend: false,

    /** api: config[legendSize]
     *  ``Array(Integer)``
     *  Size of the legend window: [width, height]
     */
    legendSize: [600, 400],

    /** api: config[layerStore]
     *  ``GeoExt.data.LayerStore``
     * The layer store to be used.
     */
    layerStore: null,

    /** api: config[model]
     *  ``Array``
     * The model which contains to configuration of the layer tree.
     */
    model: null,


    /** private: method[constructor]
     */
    constructor: function(config) {
        Ext.apply(this, config);
        GeoAdmin.TreePanel.superclass.constructor.call(this);
    },





    listeners: {
        dblclick: function(node, e) {
            this.fireEvent("afterselection");
        },
        click: function(node, e) {

            this.fireEvent("afterselection");
        },
        checkchange: function(node, state) {
            if (state) {
                this.updateCustomizedCheckbox(node.id, true);
                node.ui.removeClass('nodeTP3');
                node.ui.addClass('nodeTP3selected');
                node.attributes.cls = 'nodeTP3selected';
            } else {
                this.updateCustomizedCheckbox(node.id, false);
                node.ui.addClass('nodeTP3');
                node.ui.removeClass('nodeTP3selected');
                node.attributes.cls = 'nodeTP3';
            }
        }
    },
    /** private: method[initComponent]
     *  Initializes the tree panel. It will apply the model to the tree, and
     *  also add in the legend button.
     */
    initComponent: function() {
        this.autoScroll = true;
        if (this.addLegend === true) {
            this.title += '<span id="legendAction" qtip="' + OpenLayers.i18n("legendTooltip") + '">L</span>';
        }
        this.cls = 'geoadmin-treepanel';
        this.rootVisible = false;
        this.plugins = [
            {
                ptype: "gx_treenodecomponent"
            }
        ];
        // recursively walk the model
        var allItems = [];
        if (this.model !== null) {
            this.applyModel(this.model, allItems);
        }
        // we need to reverse allItems to get the proper layer sequence
        allItems.reverse();
        this.root = {
            children: this.model
        };
        this.provider = Ext.state.Manager.getProvider();
        GeoAdmin.TreePanel.superclass.initComponent.call(this);
    },

    /** private: method[getMetadataLoader]
     *  :return: ``Ext.tree.TreeLoader`` The tree loader which adds in the
     *      metadata plugin.
     *
     *  Get the tree loader to plugin the metadata component.
     */
    getMetadataLoader: function() {
        if (!this.metadataLoader) {
            var MetadataUI = Ext.extend(GeoExt.tree.LayerNodeUI,
                    new GeoExt.tree.TreeNodeUIEventMixin());
            this.metadataLoader = new Ext.tree.TreeLoader({
                uiProviders: {
                    "metadataui": MetadataUI
                },
                baseAttrs: {
                    uiProvider: "metadataui"
                },
                createNode: function(attr) {
                    if (attr.nodeType != "gx_layer" && attr.nodeType != "gx_layerparam") {
                        attr.uiProvider = Ext.tree.TreeNodeUI;
                    }
                    // no attr.component

                    return Ext.tree.TreeLoader.prototype.createNode.call(this, attr);
                }
            });
        }
        return this.metadataLoader;
    },

    /** private: method[applyModel]
     *  :param items: ``Array`` The children in a tree config.
     *  :param allItems: ``Array(String)`` The array of all sublayers,
     *      filled up by this function.
     *
     *  Recursive function to apply the model. This function hides the complicated
     *  GeoExt internals from the API user.
     */
    applyModel: function(items, allItems) {
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            if (item.layertype === "tilecache" || item.layertype == "wmts" ) {
                item.nodeType = "gx_layer";  // checkbox
                item._layer = item.layer;
                item.id = item.layer;
                item.cls = 'nodeTP3';
                item.text = this.addtreeLayerLink(item.layer, "TileCache_128");

                // We cannot use a string layer, since layer names are sometimes
                // not unique. Yet, we assume layer names are unique for
                // TileCache et WMTS layers.
                var index = this.layerStore.findBy(function(r) {
                    var layer = r.getLayer();
                    return (layer instanceof OpenLayers.Layer.TileCache ||
                            layer instanceof OpenLayers.Layer.WMTS) &&
                           (layer.layername === item.layer ||
                            layer.layer == item.layer);
                });
                if (index > -1) {
                    item.layer = this.layerStore.getAt(index).getLayer();
                }
                item.leaf = true;
                delete item.layerType;

            }
            if (item.showMetadata === true) {
                item.loader = this.getMetadataLoader();
                delete item.showMetadata;
            }
            if (item.layerType === "tilemerge") {
                allItems.push(item.item);
                item.allItems = allItems;
                item.nodeType = "gx_layerparam";
                item.param = "LAYERS";
                item.text = OpenLayers.i18n(item.item);
                delete item.layerType;
            }
            if (item.children) {
                this.applyModel(item.children, allItems);
            }
        }
    },

    /** private: method[updateCustomizedCheckbox]
     * Update style for the visible (custom) checkbox
     */
    updateCustomizedCheckbox: function(nodeId, state) {
        var node = Ext.get(nodeId + '_cb');
        if (node) {
            node.dom.className = state ? 'checkboxOn' : 'checkboxOff';
        }
    },

    addtreeLayerLink: function(id, nodeId) {
        var layerlink = OpenLayers.i18n(id) + '<div class="layerNodeTools">' +
                '<div class="treelayerpipe"></div><div class="nodeTP3">' +
                '<div class="treelayerlink" onclick="GeoAdmin.BodSearchWindow.show(\'' + id + '\');"></div></div>' +
                '<div class="treelayerpipe"></div>' + //<div class="checkboxOff" id="' + id +
                '<div class="checkboxOff" id="' + id + '_cb" onclick="Ext.getCmp(\'' + this.id + '\').getNodeById(\'' + id + '\').getUI().toggleCheck();">' +
                '</div><div class="treelayerpipe"></div></div>';

        return layerlink;
    },

    /** private: method[afterRender]
     *  Override afterRender to add a click action to the legendAction span.
     */
    afterRender: function() {
        GeoAdmin.TreePanel.superclass.afterRender.apply(this, arguments);
        var legendAction = Ext.get('legendAction');
        if (legendAction) {
            legendAction.on("click", this.showLegend, this);
        }
        var map = this.layerStore.data.items[0].data.layer.map;
        if (map) {
            this.setCheckNodes(map);
        }

        for (var i = 0, len = map.layers.length; i < len; i++) {
            var layer = map.layers[i];
            if (layer.visibility) {
                this.updateCustomizedCheckbox(layer.layername, true);
            }
        }
    },

    setCheckNodes: function(map) {
        // Found node since getNodeById has bugs (http://extjs.com/forum/showthread.php?t=27178&highlight=children)
        // FIXME: is this workaround still required?

        var i, j, k, childNode, childChildNode, childChildChildNode;
        for (i = 0; i < this.root.childNodes.length; i++) {
            childNode = this.root.childNodes[i];
            if (childNode.isExpandable()) childNode.expand();
            for (j = 0; j < childNode.childNodes.length; j++) {
                childChildNode = childNode.childNodes[j];
                if (childChildNode.isExpandable()) childChildNode.expand();
                for (k = 0; k < childChildNode.childNodes.length; k++) {
                    childChildChildNode = childChildNode.childNodes[k];
                    if (childChildChildNode) {
                        //this.suspendEvents();
                        var layers = map.getLayersBy('layername', childChildNode.id);
                        /*if (layers[0]) {
                         this.suspendEvents();
                         childChildChildNode.getUI().toggleCheck(true);
                         this.updateCustomizedCheckbox(childChildChildNode, true);
                         this.resumeEvents();
                         } else {
                         this.suspendEvents();
                         childChildChildNode.getUI().toggleCheck(false);
                         this.updateCustomizedCheckbox(childChildChildNode, false);
                         this.resumeEvents();
                         } */

                    }
                }
                ;
                //this.suspendEvents();
                if (childChildNode.isExpandable() && !this.model[i].children[j].expanded) childChildNode.collapse();
            }
            //this.suspendEvents();
            if (childChildNode.isExpandable() && !this.model[i].expanded) childNode.collapse();
        }
    },

    /** private: method[showLegend]
     *  Open up the legend window.
     */
    showLegend: function(evt) {
        new GeoAdmin.LegendWindow(
        {
            layerStore: this.layerStore,
            title: OpenLayers.i18n("legendTitle"),
            width: this.legendSize[0],
            height: this.legendSize[1]
        }
                ).show();
        evt.stopEvent();
        return false;
    },

    /** private: method[destroy]
     *  Destructor.
     */
    destroy: function() {
        this.model = null;
        this.layerStore = null;
        this.metadataLoader = null;
        GeoAdmin.TreePanel.superclass.destroy.apply(this, arguments);
    }

});

