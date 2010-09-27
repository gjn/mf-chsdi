/*
 * @include GeoExt/data/LayerStore.js
 * @include Map/lib/layers
 */

Ext.namespace("GeoAdmin");

GeoAdmin.CatalogTree = Ext.extend(Ext.tree.TreePanel, {

    //id: 'inspire_catalog_panel', //fix this shit [ELE]
    animate: false,
    root: {
        nodeType: 'async'
    },
    border: false,
    rootVisible: false,
    // Big hack to avoid problem of this.getSelectionModel().getSelectedNode(); which provides the previous selected node...
    selectedNode: null,
    selectedNodeId: '',

    layers: null,

    /**
     */
    layerStore: null,

    /**
     */
    map: null,

    listeners: {
        dblclick: function(node, e) {
            this.nodeSelectionManagement(node);
            this.selectedNodeId = node.id;
        },
        click: function(node, e) {
            this.nodeSelectionManagement(node);
            this.selectedNodeId = node.id;
        },
        checkchange: function(node, state) {
            if (state) {
                if (this.layerStore.getCount() == 8) {
                    this.suspendEvents();
                    node.getUI().toggleCheck(false);
                    this.updateCustomizedCheckbox(node, false);
                    alert(OpenLayers.i18n('You can add only 5 layers in the layer tree.'));
                    this.resumeEvents();
                } else {
                    this.updateCustomizedCheckbox(node, true);
                    this.addLayer(node.id);
                }
            } else {
                this.removeLayer(node.id);
            }
        },
        beforeclick:  function(node, event) {
            if (event.getTarget().className == 'treelayerlink') {
                return false;
            } else {
                this.selectedNode = node;
                this.selectedNodeId = node.id;
                return true;
            }
        },
        beforedblclick:  function(node, event) {
            if (event.getTarget().className == 'treelayerlink') {
                return false;
            } else {
                this.selectedNode = node;
                this.selectedNodeId = node.id;
                return true;
            }
        }
    },

    updateCustomizedCheckbox: function(node, state) {
        Ext.get(node.id + '_cb').dom.className = state ? 'checkboxOn' : 'checkboxOff';
    },

    nodeSelectionManagement: function(node) {
        if (node.attributes.cls == 'nodeLT1' || node.attributes.cls == 'nodeLT1selected') {
            this.selectLT1node(node);
        }
        if (node.attributes.cls == 'nodeLT2' || node.attributes.cls == 'nodeLT2selected') {
            this.selectLT2node(node);
        }
        if (node.attributes.cls == 'nodeLT3' || node.attributes.cls == 'nodeLT3selected') {
            this.selectLT3node(node);
        }
    },

    addtreeLayerLink: function(id, nodeId) {
        var iconTypeClass = "treelayericon-" + this.layers[id].type;
        var layerlink = '<div class="' + iconTypeClass + '"></div><div class="layerNodeTools"><div class="treelayerpipe"></div><div class="treelayerlink" onclick="GeoAdmin.BODSearchCombo.openDetails(\'' + id + '\');"></div><div class="treelayerpipe"></div><div class="checkboxOff" id="' + nodeId + '_cb" onclick="api.inspireCatalogPanel.toggleCheckbox(\'' + nodeId + '\');"></div><div class="treelayerpipe"></div></div>';
        return layerlink;
    },

    toggleCheckbox: function(nodeId) {
        this.getNodeById(nodeId).ui.toggleCheck();
    },

    getSelectedNode: function() {
        if (this.selectedNode) {
            return this.selectedNode.id;
        } else {
            return '';
        }
    },

    setSelectedNode: function() {
        var node = null;
        // Found node since getNodeById has bugs (http://extjs.com/forum/showthread.php?t=27178&highlight=children)
        for (i = 0; i < this.root.childNodes.length; i++) {
            childNode = this.root.childNodes[i];
            if (childNode.id == this.selectedNodeId) {
                node = childNode;
            }
            childNode.expand();
            for (j = 0; j < childNode.childNodes.length; j++) {
                childChildNode = childNode.childNodes[j];
                if (childChildNode.id == this.selectedNodeId) {
                    node = childChildNode;
                }
                childChildNode.expand();
                for (k = 0; k < childChildNode.childNodes.length; k++) {
                    childChildChildNode = childChildNode.childNodes[k];
                    if (childChildChildNode.id == this.selectedNodeId) {
                        node = childChildChildNode;
                    }
                }
                childChildNode.collapse();
            }
            childNode.collapse();
        }
        if (node) {
            this.nodeSelectionManagement(node);
            node.expand();
            node.ensureVisible();
            this.selectedNode = node;
        }
    },

    getLayerIdFromNodeId: function(nodeId) {
        return nodeId.replace('node_', '').slice(0, -1);
    },

    /**
     */
    addLayer: function(nodeId) {
        var layerId = this.getLayerIdFromNodeId(nodeId);
        var layer = GeoAdmin.layers.buildLayerByName(layerId);
        this.layerStore.loadData([layer], /* append */ true);
    },

    /**
     */
    removeLayer: function(nodeId) {
        var layerId = this.getLayerIdFromNodeId(nodeId);
        var map = this.layerStore.map;
        map.removeLayer(map.getLayerByLayerName(layerId));
    },

    setCheckNodes: function(map) {
        // Found node since getNodeById has bugs (http://extjs.com/forum/showthread.php?t=27178&highlight=children)
        for (i = 0; i < this.root.childNodes.length; i++) {
            childNode = this.root.childNodes[i];
            childNode.expand();
            for (j = 0; j < childNode.childNodes.length; j++) {
                childChildNode = childNode.childNodes[j];
                childChildNode.expand();
                for (k = 0; k < childChildNode.childNodes.length; k++) {
                    childChildChildNode = childChildNode.childNodes[k];
                    var layer = map.getLayersBy('bodid', this.getLayerIdFromNodeId(childChildChildNode.id));
                    if (layer[0]) {
                        this.suspendEvents();
                        childChildChildNode.getUI().toggleCheck(true);
                        this.updateCustomizedCheckbox(childChildChildNode, true);
                        this.resumeEvents();
                    } else {
                        this.suspendEvents();
                        childChildChildNode.getUI().toggleCheck(false);
                        this.updateCustomizedCheckbox(childChildChildNode, false);
                        this.resumeEvents();
                    }
                }
                childChildNode.collapse();
            }
            childNode.collapse();
        }
    },

    registerMapEvent: function(map) {
        map.events.on({
            'removelayer': function(layer) {
                if (map) {
                    this.setCheckNodes(map);
                    this.setSelectedNode();
                }
            },
            'addlayer': function(layer) {
                if (map) {
                    this.setCheckNodes(map);
                    this.setSelectedNode();
                }
            },
            scope: this
        });
    },


    selectLT1node: function (node) {
        node.ui.addClass('nodeBackgroundSelected');

        if (node.attributes.cls == 'nodeLT1') {
            node.ui.removeClass('nodeLT1');
            node.ui.addClass('nodeLT1selected');
        } else {
            node.ui.addClass('nodeLT1');
            node.ui.removeClass('nodeLT1selected');
            node.ui.removeClass('nodeBackgroundSelected');
        }
        for (i = 0; i < this.root.childNodes.length; i++) {
            childNode = this.root.childNodes[i];
            if (childNode.attributes.cls == 'nodeLT1' || childNode.attributes.cls == 'nodeLT1selected') {
                for (j = 0; j < childNode.childNodes.length; j++) {
                    childChildNode = childNode.childNodes[j];
                    childChildNode.collapse();
                    childChildNode.ui.addClass('nodeLT2');
                    childChildNode.ui.removeClass('nodeLT2selected');
                    childChildNode.ui.removeClass('nodeBackgroundSelected');
                    for (k = 0; k < childChildNode.childNodes.length; k++) {
                        childChildChildNode = childChildNode.childNodes[k];
                        childChildChildNode.collapse();
                        childChildChildNode.ui.addClass('nodeLT3');
                        childChildChildNode.ui.removeClass('nodeLT3selected');
                        childChildChildNode.ui.removeClass('nodeBackgroundSelected');
                    }
                }
                if (node.attributes.id != childNode.attributes.id) {
                    childNode.collapse();
                    childNode.ui.addClass('nodeLT1');
                    childNode.ui.removeClass('nodeLT1selected');
                    childNode.ui.removeClass('nodeBackgroundSelected');
                }
            }
        }
    },

    selectLT2node: function (node) {
        node.ui.addClass('nodeBackgroundSelected');

        if (node.attributes.cls == 'nodeLT2') {
            node.ui.removeClass('nodeLT2');
            node.ui.addClass('nodeLT2selected');
        } else {
            node.ui.addClass('nodeLT2');
            node.ui.removeClass('nodeLT2selected');
            node.ui.removeClass('nodeBackgroundSelected');
        }

        for (i = 0; i < node.parentNode.childNodes.length; i++) {
            childNode = node.parentNode.childNodes[i];
            if (childNode.attributes.cls == 'nodeLT2' || childNode.attributes.cls == 'nodeLT2selected') {
                for (j = 0; j < childNode.childNodes.length; j++) {
                    childChildNode = childNode.childNodes[j];
                    childChildNode.collapse();
                    childChildNode.ui.addClass('nodeLT3');
                    childChildNode.ui.removeClass('nodeLT3selected');
                    childChildNode.ui.removeClass('nodeBackgroundSelected');
                }
                if (node.attributes.id != childNode.attributes.id) {
                    childNode.collapse();
                    childNode.ui.addClass('nodeLT2');
                    childNode.ui.removeClass('nodeLT2selected');
                    childNode.ui.removeClass('nodeBackgroundSelected');

                }
            }
        }
        node.parentNode.ui.addClass('nodeLT1selected');
        node.parentNode.ui.removeClass('nodeLT1');
        node.parentNode.ui.removeClass('nodeBackgroundSelected');
    },

    selectLT3node: function (node) {
        node.ui.addClass('nodeBackgroundSelected');

        if (node.attributes.cls == 'nodeLT3') {
            node.ui.removeClass('nodeLT3');
            node.ui.addClass('nodeLT3selected');
        } else {
            node.ui.addClass('nodeLT3');
            node.ui.removeClass('nodeLT3selected');
            node.ui.removeClass('nodeBackgroundSelected');
        }

        for (i = 0; i < node.parentNode.childNodes.length; i++) {
            childNode = node.parentNode.childNodes[i];
            if (childNode.attributes.cls == 'nodeLT3' || childNode.attributes.cls == 'nodeLT3selected') {
                if (node.attributes.id != childNode.attributes.id) {
                    childNode.collapse();
                    childNode.ui.addClass('nodeLT3');
                    childNode.ui.removeClass('nodeLT3selected');
                    childNode.ui.removeClass('nodeBackgroundSelected');
                }
            }
        }
        node.parentNode.ui.addClass('nodeLT2selected');
        node.parentNode.ui.removeClass('nodeLT2');
        node.parentNode.ui.removeClass('nodeBackgroundSelected');
        node.parentNode.parentNode.ui.addClass('nodeLT1selected');
        node.parentNode.parentNode.ui.removeClass('nodeLT1');
        node.parentNode.parentNode.ui.removeClass('nodeBackgroundSelected');
    },

    initComponent: function() {

        this.layers = GeoAdmin.layers.init();

        if(!this.layerStore) {
            this.layerStore = this.map;
        }
        if (!(this.layerStore instanceof GeoExt.data.LayerStore)) {
            this.layerStore = new GeoExt.data.LayerStore(
                {map: this.layerStore}
            );
        }

        this.root.children = [
            {
                text: OpenLayers.i18n('Basisdaten'),
                cls: 'nodeLT1',
                singleClickExpand: true,
                id: "LT1_1",
                children: [
                    {
                        text: ' ' + OpenLayers.i18n('Referenzsysteme'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_1",
                        children: [
                            {
                                text: this.addtreeLayerLink("ch.swisstopo.fixpunkte-agnes", "node_ch.swisstopo.fixpunkte-agnes1") + ' ' + this.layers["ch.swisstopo.fixpunkte-agnes"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.swisstopo.fixpunkte-agnes1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.swisstopo.fixpunkte-lage", "node_ch.swisstopo.fixpunkte-lage1") + ' ' + this.layers["ch.swisstopo.fixpunkte-lage"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.swisstopo.fixpunkte-lage1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.swisstopo.fixpunkte-hoehe", "node_ch.swisstopo.fixpunkte-hoehe1") + ' ' + this.layers["ch.swisstopo.fixpunkte-hoehe"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.swisstopo.fixpunkte-hoehe1"
                            }
                        ]
                    },
                   /* {
                        text: ' ' + OpenLayers.i18n('Geografische Gittersysteme'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_2"
                    },*/
                    {
                        text: ' ' + OpenLayers.i18n('Geografische Namen'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_3",
                        children: [
                            {
                                text: this.addtreeLayerLink("ch.swisstopo.hiks-dufour", "node_ch.swisstopo.hiks-dufour1") + ' ' + this.layers["ch.swisstopo.hiks-dufour"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.swisstopo.hiks-dufour1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.swisstopo.hiks-siegfried", "node_ch.swisstopo.hiks-siegfried1") + ' ' + this.layers["ch.swisstopo.hiks-siegfried"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.swisstopo.hiks-siegfried1"
                            }
                        ]
                    },
                    {
                        text: ' ' + OpenLayers.i18n('Administrative Einheiten'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_4",
                        children: [
                            {
                                text: this.addtreeLayerLink("ch.swisstopo.gg25-land-flaeche.fill", "node_ch.swisstopo.gg25-land-flaeche.fill1") + ' ' + this.layers["ch.swisstopo.gg25-land-flaeche.fill"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.swisstopo.gg25-land-flaeche.fill1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.swisstopo.gg25-kanton-flaeche.fill", "node_ch.swisstopo.gg25-kanton-flaeche.fill1") + ' ' + this.layers["ch.swisstopo.gg25-kanton-flaeche.fill"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.swisstopo.gg25-kanton-flaeche.fill1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.swisstopo.gg25-bezirk-flaeche.fill", "node_ch.swisstopo.gg25-bezirk-flaeche.fill1") + ' ' + this.layers["ch.swisstopo.gg25-bezirk-flaeche.fill"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.swisstopo.gg25-bezirk-flaeche.fill1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.swisstopo.gg25-gemeinde-flaeche.fill", "node_ch.swisstopo.gg25-gemeinde-flaeche.fill1") + ' ' + this.layers["ch.swisstopo.gg25-gemeinde-flaeche.fill"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.swisstopo.gg25-gemeinde-flaeche.fill1"
                            }
                        ]
                    },
                    {
                        text: ' ' + OpenLayers.i18n('Adressen'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_5",                
                        children: [
                            {
                                text: this.addtreeLayerLink("ch.bfs.gebaeude_wohnungs_register", "node_ch.bfs.gebaeude_wohnungs_register1") + ' ' + this.layers["ch.bfs.gebaeude_wohnungs_register"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bfs.gebaeude_wohnungs_register1"
                            }
                        ]
                    }/*,
                    {
                        text: ' ' + OpenLayers.i18n('Flurstücke / Grundstücke'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_6"
                    }*/
                ]
            },
            {
                text: OpenLayers.i18n('Oberflächendarstellung'),
                cls: 'nodeLT1',
                singleClickExpand: true,
                id: "LT1_2",
                children: [
                   {
                        text: ' ' + OpenLayers.i18n('Gewässernetz'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_7",
                        children: [
                            {
                                text: this.addtreeLayerLink("ch.swisstopo.vec25-gwn-gewassernetz", "node_ch.swisstopo.vec25-gwn-gewassernetz1") + ' ' + this.layers["ch.swisstopo.vec25-gwn-gewassernetz"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.swisstopo.vec25-gwn-gewassernetz1"
                            }
                        ]
                    },
                   /*{
                        text: ' ' + OpenLayers.i18n('Höhe'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_8"
                    },*/
                    {
                        text: ' ' + OpenLayers.i18n('Bodenbedeckung'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_9",
                        children: [
                            {
                                text: this.addtreeLayerLink("ch.bfs.arealstatistik-1985", "node_ch.bfs.arealstatistik-19851") + ' ' + this.layers["ch.bfs.arealstatistik-1985"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bfs.arealstatistik-19851"
                            },
                            {
                                text: this.addtreeLayerLink("ch.bfs.arealstatistik-1997", "node_ch.bfs.arealstatistik-19971") + ' ' + this.layers["ch.bfs.arealstatistik-1997"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bfs.arealstatistik-19971"
                            },
                            {
                                text: this.addtreeLayerLink("ch.bfs.arealstatistik-hintergrund", "node_ch.bfs.arealstatistik-hintergrund1") + ' ' + this.layers["ch.bfs.arealstatistik-hintergrund"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bfs.arealstatistik-hintergrund1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.bfs.arealstatistik-waldmischungsgrad", "node_ch.bfs.arealstatistik-waldmischungsgrad1") + ' ' + this.layers["ch.bfs.arealstatistik-waldmischungsgrad"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bfs.arealstatistik-waldmischungsgrad1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.swisstopo.vec25-primaerflaechen", "node_ch.swisstopo.vec25-primaerflaechen1") + ' ' + this.layers["ch.swisstopo.vec25-primaerflaechen"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.swisstopo.vec25-primaerflaechen1"
                            }
                        ]
                    }/*,
                    {
                        text: ' ' + OpenLayers.i18n('Luft und Satellitenbilder'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_10"
                    }*/
                ]
            },
            /*{
                text: OpenLayers.i18n('Raum und Bevölkerung'),
                cls: 'nodeLT1',
                singleClickExpand: true,
                id: "LT1_3",
                children: [
                    {
                        text: ' ' + OpenLayers.i18n('Gesundheit une Sicherheit'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_11"
                    },
                    {
                        text: ' ' + OpenLayers.i18n('Bevölkerungsdichte'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_12"
                    },
                    {
                        text: ' ' + OpenLayers.i18n('Raumplanung'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_13"
                    }
                ]
            },*/
            {
                text: OpenLayers.i18n('Infrastrucktur une Kommunikation'),
                cls: 'nodeLT1',
                singleClickExpand: true,
                id: "LT1_4",
                children: [
                    {
                        text: ' ' + OpenLayers.i18n('Verkehrsnetze'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_14",
                        children: [
                            {
                                text: this.addtreeLayerLink("ch.swisstopo.vec200-transportation-oeffentliche-verkehr", "node_ch.swisstopo.vec200-transportation-oeffentliche-verkehr1") + ' ' + this.layers["ch.swisstopo.vec200-transportation-oeffentliche-verkehr"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.swisstopo.vec200-transportation-oeffentliche-verkehr1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.swisstopo.vec200-transportation-strassennetz", "node_ch.swisstopo.vec200-transportation-strassennetz1") + ' ' + this.layers["ch.swisstopo.vec200-transportation-strassennetz"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.swisstopo.vec200-transportation-strassennetz1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.swisstopo.vec25-anlagen", "node_ch.swisstopo.vec25-anlagen1") + ' ' + this.layers["ch.swisstopo.vec25-anlagen"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.swisstopo.vec25-anlagen1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.swisstopo.vec25-eisenbahnnetz", "node_ch.swisstopo.vec25-eisenbahnnetz1") + ' ' + this.layers["ch.swisstopo.vec25-eisenbahnnetz"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.swisstopo.vec25-eisenbahnnetz1"
                            }
                        ]
                    },
                    {
                        text: ' ' + OpenLayers.i18n('Gebäude'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_15",
                        children: [
                            {
                                text: this.addtreeLayerLink("ch.bfs.gebaeude_wohnungs_register", "node_ch.bfs.gebaeude_wohnungs_register2") + ' ' + this.layers["ch.bfs.gebaeude_wohnungs_register"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bfs.gebaeude_wohnungs_register2"
                            },
                            {
                                text: this.addtreeLayerLink("ch.swisstopo.vec25-gebaeude", "node_ch.swisstopo.vec25-gebaeude1") + ' ' + this.layers["ch.swisstopo.vec25-gebaeude"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.swisstopo.vec25-gebaeude1"
                            }
                        ]
                    }/*,
                    {
                        text: ' ' + OpenLayers.i18n('Öffentliche Einrichtungen und Dienste'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_16"
                    }*/
                ]
            },
            {
                text: OpenLayers.i18n('Umwelt, Biologie und Geologie'),
                cls: 'nodeLT1',
                singleClickExpand: true,
                id: "LT1_5",
                children: [
                    {
                        text: ' ' + OpenLayers.i18n('Schutzgebiete'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_17",
                        children: [
                            {
                                text: this.addtreeLayerLink("ch.bafu.bundesinventare-amphibien", "node_ch.bafu.bundesinventare-amphibien1") + ' ' + this.layers["ch.bafu.bundesinventare-amphibien"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.bundesinventare-amphibien1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.bafu.bundesinventare-auen", "node_ch.bafu.bundesinventare-auen1") + ' ' + this.layers["ch.bafu.bundesinventare-auen"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.bundesinventare-auen1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.bafu.bundesinventare-bln", "node_ch.bafu.bundesinventare-bln1") + ' ' + this.layers["ch.bafu.bundesinventare-bln"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.bundesinventare-bln1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.bafu.bundesinventare-flachmoore", "node_ch.bafu.bundesinventare-flachmoore1") + ' ' + this.layers["ch.bafu.bundesinventare-flachmoore"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.bundesinventare-flachmoore1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.bafu.bundesinventare-hochmoore", "node_ch.bafu.bundesinventare-hochmoore1") + ' ' + this.layers["ch.bafu.bundesinventare-hochmoore"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.bundesinventare-hochmoore1"
                            },
			    {
                                text: this.addtreeLayerLink("ch.bafu.bundesinventare-jagdbanngebiete", "node_ch.bafu.bundesinventare-jagdbanngebiete1") + ' ' + this.layers["ch.bafu.bundesinventare-jagdbanngebiete"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.bundesinventare-jagdbanngebiete1"
                            },
			    {
                                text: this.addtreeLayerLink("ch.babs.kulturgueter", "node_ch.babs.kulturgueter1") + ' ' + this.layers["ch.babs.kulturgueter"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.babs.kulturgueter1"
                            },
			    {
                                text: this.addtreeLayerLink("ch.bafu.bundesinventare-moorlandschaften", "node_ch.bafu.bundesinventare-moorlandschaften1") + ' ' + this.layers["ch.bafu.bundesinventare-moorlandschaften"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.bundesinventare-moorlandschaften1"
                            },
			    {
                                text: this.addtreeLayerLink("ch.bafu.schutzgebiete-schweizerischer_nationalpark", "node_ch.bafu.schutzgebiete-schweizerischer_nationalpark1") + ' ' + this.layers["ch.bafu.schutzgebiete-schweizerischer_nationalpark"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.schutzgebiete-schweizerischer_nationalpark1"
                            },
			    {
                                text: this.addtreeLayerLink("ch.bafu.schutzgebiete-paerke_nationaler_bedeutung", "node_ch.bafu.schutzgebiete-paerke_nationaler_bedeutung1") + ' ' + this.layers["ch.bafu.schutzgebiete-paerke_nationaler_bedeutung"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.schutzgebiete-paerke_nationaler_bedeutung1"
                            },
			    {
                                text: this.addtreeLayerLink("ch.bafu.schutzgebiete-ramsar", "node_ch.bafu.schutzgebiete-ramsar1") + ' ' + this.layers["ch.bafu.schutzgebiete-ramsar"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.schutzgebiete-ramsar1"
                            },
	                    {
                                text: this.addtreeLayerLink("ch.bafu.bundesinventare-vogelreservate", "node_ch.bafu.bundesinventare-vogelreservate1") + ' ' + this.layers["ch.bafu.bundesinventare-vogelreservate"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.bundesinventare-vogelreservate1"
                            }
                        ]
                    },
                    /*{
                        text: ' ' + OpenLayers.i18n('Geologie'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_18"
                    },
                    {
                        text: ' ' + OpenLayers.i18n('Boden'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_19"
                    },*/
                    {
                        text: ' ' + OpenLayers.i18n('Umweltüberwachung'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_20",
                        children: [
			    {
                                text: this.addtreeLayerLink("ch.bafu.hydrologie-hydromessstationen",  "node_ch.bafu.hydrologie-hydromessstationen1") + ' ' + this.layers["ch.bafu.hydrologie-hydromessstationen"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.hydrologie-hydromessstationen1"
                            },
			    {
                                text: this.addtreeLayerLink("ch.bafu.wasser-entnahme",  "node_ch.bafu.wasser-entnahme1") + ' ' + this.layers["ch.bafu.wasser-entnahme"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.wasser-entnahme1"
                            },
			    {
                                text: this.addtreeLayerLink("ch.bafu.wasser-leitungen",  "node_ch.bafu.wasser-leitungen1") + ' ' + this.layers["ch.bafu.wasser-leitungen"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.wasser-leitungen1"
                            },
			    {
                                text: this.addtreeLayerLink("ch.bafu.wasser-rueckgabe",  "node_ch.bafu.wasser-rueckgabe1") + ' ' + this.layers["ch.bafu.wasser-rueckgabe"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.wasser-rueckgabe1"
                            }			
                        ]
                    },
                    {
                        text: ' ' + OpenLayers.i18n('Natürliche Risikozonen'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_21",
                        children: [
			   {
                                text: this.addtreeLayerLink("ch.bafu.showme-gemeinden_hochwasser", "node_ch.bafu.showme-gemeinden_hochwasser1") + ' ' + this.layers["ch.bafu.showme-gemeinden_hochwasser"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.showme-gemeinden_hochwasser1"
                            }, 
			    {
                                text: this.addtreeLayerLink("ch.bafu.showme-gemeinden_lawinen", "node_ch.bafu.showme-gemeinden_lawinen1") + ' ' + this.layers["ch.bafu.showme-gemeinden_lawinen"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.showme-gemeinden_lawinen1"
                            },
			    {
                                text: this.addtreeLayerLink("ch.bafu.showme-gemeinden_rutschungen", "node_ch.bafu.showme-gemeinden_rutschungen1") + ' ' + this.layers["ch.bafu.showme-gemeinden_rutschungen"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.showme-gemeinden_rutschungen1"
                            },
			    {
                                text: this.addtreeLayerLink("ch.bafu.showme-gemeinden_sturzprozesse", "node_ch.bafu.showme-gemeinden_sturzprozesse1") + ' ' + this.layers["ch.bafu.showme-gemeinden_sturzprozesse"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.showme-gemeinden_sturzprozesse1"
                            },
			    {
                                text: this.addtreeLayerLink("ch.bafu.showme-kantone_hochwasser", "node_ch.bafu.showme-kantone_hochwasser1") + ' ' + this.layers["ch.bafu.showme-kantone_hochwasser"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.showme-kantone_hochwasser1"
                            },
			    {
                                text: this.addtreeLayerLink("ch.bafu.showme-kantone_lawinen", "node_ch.bafu.showme-kantone_lawinen1") + ' ' + this.layers["ch.bafu.showme-kantone_lawinen"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.showme-kantone_lawinen1"
                            },
			    {
                                text: this.addtreeLayerLink("ch.bafu.showme-kantone_rutschungen", "node_ch.bafu.showme-kantone_rutschungen1") + ' ' + this.layers["ch.bafu.showme-kantone_rutschungen"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.showme-kantone_rutschungen1"
                            },
			    {
                                text: this.addtreeLayerLink("ch.bafu.showme-kantone_sturzprozesse", "node_ch.bafu.showme-kantone_sturzprozesse1") + ' ' + this.layers["ch.bafu.showme-kantone_sturzprozesse"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.showme-kantone_sturzprozesse1"
                            } 
			]
                    },
                    /*{
                        text: ' ' + OpenLayers.i18n('Atmosphärische Bedingungen'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_22"
                    },
                    {
                        text: ' ' + OpenLayers.i18n('Meteorologie'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_23"
                    },
                    {
                        text: ' ' + OpenLayers.i18n('Biogeografische Regionen'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_24"
                    },*/
                    {
                        text: ' ' + OpenLayers.i18n('Lebensräume une Biotope'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_25",
                        children: [
                            {
                                text: this.addtreeLayerLink("ch.bafu.bundesinventare-amphibien", "node_ch.bafu.bundesinventare-amphibien2") + ' ' + this.layers["ch.bafu.bundesinventare-amphibien"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.bundesinventare-amphibien2"
                            },
                            {
                                text: this.addtreeLayerLink("ch.bafu.bundesinventare-auen", "node_ch.bafu.bundesinventare-auen2") + ' ' + this.layers["ch.bafu.bundesinventare-auen"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.bundesinventare-auen2"
                            },
                            {
                                text: this.addtreeLayerLink("ch.bafu.ren-extensive_landwirtschaftsgebiete", "node_ch.bafu.ren-extensive_landwirtschaftsgebiete1") + ' ' + this.layers["ch.bafu.ren-extensive_landwirtschaftsgebiete"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.ren-extensive_landwirtschaftsgebiete1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.bafu.ren-feuchtgebiete", "node_ch.bafu.ren-feuchtgebiete1") + ' ' + this.layers["ch.bafu.ren-feuchtgebiete"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.ren-feuchtgebiete1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.bafu.bundesinventare-flachmoore", "node_ch.bafu.bundesinventare-flachmoore2") + ' ' + this.layers["ch.bafu.bundesinventare-flachmoore"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.bundesinventare-flachmoore2"
                            },
                            {
                                text: this.addtreeLayerLink("ch.bafu.ren-fliessgewaesser_seen",  "node_ch.bafu.ren-fliessgewaesser_seen1") + ' ' + this.layers["ch.bafu.ren-fliessgewaesser_seen"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.ren-fliessgewaesser_seen1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.bafu.bundesinventare-hochmoore", "node_ch.bafu.bundesinventare-hochmoore2") + ' ' + this.layers["ch.bafu.bundesinventare-hochmoore"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.bundesinventare-hochmoore2"
                            },
                            {
                                text: this.addtreeLayerLink("ch.bafu.bundesinventare-jagdbanngebiete", "node_ch.bafu.bundesinventare-jagdbanngebiete2") + ' ' + this.layers["ch.bafu.bundesinventare-jagdbanngebiete"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.bundesinventare-jagdbanngebiete2"
                            },
			    {
                                text: this.addtreeLayerLink("ch.bafu.bundesinventare-moorlandschaften", "node_ch.bafu.bundesinventare-moorlandschaften2") + ' ' + this.layers["ch.bafu.bundesinventare-moorlandschaften"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.bundesinventare-moorlandschaften2"
                            },
                            {
                                text: this.addtreeLayerLink("ch.bafu.ren-trockenstandorte", "node_ch.bafu.ren-trockenstandorte1") + ' ' + this.layers["ch.bafu.ren-trockenstandorte"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.ren-trockenstandorte1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.bafu.ren-wald_unter_1000_meter", "node_ch.bafu.ren-wald_unter_1000_meter1") + ' ' + this.layers["ch.bafu.ren-wald_unter_1000_meter"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.ren-wald_unter_1000_meter1"
                            },
                            {
                                text: this.addtreeLayerLink("ch.bafu.ren-wald_ueber_1000_meter", "node_ch.bafu.ren-wald_ueber_1000_meter1") + ' ' + this.layers["ch.bafu.ren-wald_ueber_1000_meter"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.ren-wald_ueber_1000_meter1"
                            },
			    {
                                text: this.addtreeLayerLink("ch.bafu.bundesinventare-vogelreservate", "node_ch.bafu.bundesinventare-vogelreservate2") + ' ' + this.layers["ch.bafu.bundesinventare-vogelreservate"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.bundesinventare-vogelreservate2"
                            }
                        ]
                    },
                    {
                        text: ' ' + OpenLayers.i18n('Artenvielfalt'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_26",
                        children: [
                            {
                                text: this.addtreeLayerLink("ch.bafu.fauna-steinbockkolonien", "node_ch.bafu.fauna-steinbockkolonien1") + ' ' + this.layers["ch.bafu.fauna-steinbockkolonien"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bafu.fauna-steinbockkolonien1"
                            }
                        ]
                    }/*,
                    {
                        text: ' ' + OpenLayers.i18n('Mineralische Bodenschätze'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_27"
                    }*/
                ]
            },
            {
                text: OpenLayers.i18n('Energie und Wirtschaft'),
                cls: 'nodeLT1',
                singleClickExpand: true,
                id: "LT1_6",
                children: [
                   /* {
                        text: ' ' + OpenLayers.i18n('Statistische Einheiten'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_28"
                    },*/
                    {
                        text: ' ' + OpenLayers.i18n('Landnutzung'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_29",
                        children: [
                            {
                                text: this.addtreeLayerLink("ch.bfs.arealstatistik-1985", "node_ch.bfs.arealstatistik-19852") + ' ' + this.layers["ch.bfs.arealstatistik-1985"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bfs.arealstatistik-19852"
                            },
                            {
                                text: this.addtreeLayerLink("ch.bfs.arealstatistik-1997", "node_ch.bfs.arealstatistik-19972") + ' ' + this.layers["ch.bfs.arealstatistik-1997"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bfs.arealstatistik-19972"
                            },                           
                            {
                                text: this.addtreeLayerLink("ch.bfs.arealstatistik-hintergrund", "node_ch.bfs.arealstatistik-hintergrund2") + ' ' + this.layers["ch.bfs.arealstatistik-hintergrund"].name,
                                leaf: true,
                                checked: false,
                                cls: 'nodeLT3',
                                id: "node_ch.bfs.arealstatistik-hintergrund2"
                            }
                        ]
                    }/*,
                    {
                        text: ' ' + OpenLayers.i18n('Produktions- und Industrieanlagen'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_30"
                    },
                    {
                        text: ' ' + OpenLayers.i18n('Land- und Wassertwirtschaft'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_31"
                    },
                    {
                        text: ' ' + OpenLayers.i18n('Energiequellen'),
                        cls: 'nodeLT2',
                        singleClickExpand: true,
                        id: "LT2_32"
                    }*/
                ]
            }
        ];
        GeoAdmin.CatalogTree.superclass.initComponent.call(this);
    },

    constructor: function(config) {
        GeoAdmin.CatalogTree.superclass.constructor.call(this, config);
    }
});

