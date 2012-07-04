/*global Ext, OpenLayers, GeoExt, GeoAdmin*/

/*
 * @include GeoExt/data/LayerStore.js
 * @include Layers/lib/Layers.js
 * @include BodSearch/lib/BodSearchWindow.js
 */

/** api: (define)
 *  module = GeoAdmin
 *  class  = CatalogTree
 *  base_link = `Ext.tree.TreePanel <http://dev.sencha.com/deploy/dev/docs/?class=Ext.tree.TreePanel>`_
 */

/** api: example
 *  Sample code to create a catalog tree (see also `demo <http://api.geo.admin.ch/main/wsgi/doc/build/widgets/sdiwidgetsexamples2.html#catalog-tree>`_):
 *
 *  .. code-block:: javascript
 *
 *     var tree = new GeoAdmin.CatalogTree({
 *           renderTo: "catalogtreediv",
 *           map: map
 *     });
 *
 */

/** api: constructor
 *  .. class:: CatalogTree(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.CatalogTree``
 *
 *  Create a tree structure presented according to INSPIRE and containing the available layers
 */

Ext.namespace("GeoAdmin");

GeoAdmin.CatalogTree = Ext.extend(Ext.tree.TreePanel, {

    cls: "geoadmin-catalog-tree",

    animate: false,
    border: false,
    rootVisible: false,

    /** api: config[singleUnfold]
     *  ``Boolean`` true if only 1 node per branch may be expanded. Defaults to
     *  true.
     *  Be careful, is similar to singleExpand (Ext.tree.Treepanel) property,
     *  but slightly different.
     */
    singleUnfold: true,

    // Big hack to avoid problem of this.getSelectionModel().getSelectedNode(); which provides the previous selected node...
    // FIXME check this hack is still necessary
    selectedNode: null,
    selectedNodeId: '',

    /** api: config[stateId]
     *  ``String`` The state id. Default value is "catalog".
     */
    /** private: property[catalog]
     *  ``String``
     */
    stateId: "catalog",

    /** private: property[stateEvents]
     *  ``Array(String)`` Array of state events.
     */
    stateEvents: ["afterselection"],

    /** api: config[infoWindowClass]
     * ``String``
     * The info window class to be used when user clicks on 'i'.
     * Defaults to 'GeoAdmin.BodSearchWindow'.
     */
    infoWindowClass: 'GeoAdmin.BodSearchWindow',

    layers: null,

    layerStore: null,

    /** api: config[map]
     *  ``OpenLayers.Map``
     *  A `OpenLayers.Map <http://dev.openlayers.org/docs/files/OpenLayers/Map-js.html>`_ instance
     */
    map: null,

    listeners: {
        dblclick: function(node, e) {
            this.selectNode(node);
            this.selectedNodeId = node.id;
            this.fireEvent("afterselection");
        },
        click: function(node, e) {
            this.selectNode(node);
            this.selectedNodeId = node.id;
            this.fireEvent("afterselection");
        },
        checkchange: function(node, state) {
            if (state) {
                var layerCount = 0;
                for (var i = 0; i < this.layerStore.map.layers.length; i++) {
                    if (this.layerStore.map.layers[i].displayInLayerSwitcher) {
                        layerCount++;
                    }
                }
                if (layerCount == 5) {
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
                this.updateCustomizedCheckbox(node, false);
                this.destroyLayer(node.id);
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

    /** private: method[afterRender]
     */
    afterRender: function() {
        GeoAdmin.CatalogTree.superclass.afterRender.apply(this, arguments);
        // call setSelectedNode to handle the case where
        // selectedNode has been set before render
        if (this.map) {
            this.setCheckNodes(this.map);
        }
        this.setSelectedNode();
    },

    /** private: method[applyState]
     *  :param state: ``Object`` The state to apply.
     *
     *  Apply the state to the catalog tree.
     */
    applyState: function(state) {
        this.selectedNodeId = this.id + '_' + state.selected;
    },

    /** private: method[getState]
     *  :return: ``Object`` The state.
     *
     *  Returns the state of the catalog tree.
     */
    getState: function() {
        var selectedNodeId = this.getSelectedNode(),
            selectedValue = selectedNodeId.replace(this.id + '_', '');
        return {selected: selectedValue};
    },

    updateCustomizedCheckbox: function(node, state) {
        Ext.get(node.id + '_cb').dom.className = state ? 'checkboxOn' : 'checkboxOff';
    },

    addtreeLayerLink: function(id, nodeId) {
        var iconTypeClass;
        if (this.layers[id].queryable) {
            iconTypeClass = "treelayericon-queryable";
        } else {
            iconTypeClass = "treelayericon";
        }
        var layerlink = '<div class="' + iconTypeClass + '"></div>';
        layerlink += '<div class="layerNodeTools">';
        layerlink += '  <div class="treelayerpipe"></div>';
        layerlink += '  <div class="treelayerlink" onclick="' + this.infoWindowClass + '.show(\'' + id + '\');"></div>';
        layerlink += '  <div class="treelayerpipe"></div>';
        layerlink += '  <div class="checkboxOff" id="' + nodeId + '_cb" onclick="Ext.getCmp(\'' + this.id + '\').getNodeById(\'' + nodeId + '\').getUI().toggleCheck();"></div>';
        layerlink += '  <div class="treelayerpipe"></div>';
        layerlink += '</div>';
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
        this.root.cascade(function(n) {
            var expanded = n.isExpanded();
            if (!expanded) {
                n.expand();
            }
            if (n.id == this.selectedNodeId) {
                this.selectNode(n);
                n.ensureVisible();
                this.selectedNode = n;
                this.fireEvent('afterselection');
                return false;
            } else if (!expanded) {
                n.collapse();
            }
        }, this);
    },

    /** private: method[getLayerIdFromNodeId]
     *  :param nodeId: ``String`` The node id.
     *  :returns: ``String`` The layer identifier.
     */
    getLayerIdFromNodeId: function(nodeId) {
        return nodeId.replace(this.id + '_node_', '').slice(0, -1);
    },

    /** private: method[addLayer]
     *  :param nodeId: ``String`` the node id.
     */
    addLayer: function(nodeId) {
        var callback = OpenLayers.Function.bind(function(layer) {
            this.layerStore.loadData([layer])
        }, this);
        var layerId = this.getLayerIdFromNodeId(nodeId);
        var layer = GeoAdmin.layers.buildLayerByName(layerId, {},
            OpenLayers.Function.bind(function(layer) {
                this.layerStore.loadData([layer], /* append */ true);
            }, this)
        );
    },

    /** private: method[destroyLayer]
     *  :param nodeId: ``String`` the node id.
     */
    destroyLayer: function(nodeId) {
        var layerId = this.getLayerIdFromNodeId(nodeId);
        var map = this.layerStore.map;
        var layer = map.getLayerByLayerName(layerId);
        if (layer) {
            layer.destroy();
        }
    },

    setCheckNodes: function(map) {
        this.root.cascade(function(n) {
            var expanded = n.isExpanded();
            if (!expanded) {
                n.expand();
            }
            if (n.isLeaf()) {
                var layers = map.getLayersBy(
                    'layername',
                    this.getLayerIdFromNodeId(n.id));
                var check = layers.length > 0;
                this.suspendEvents();
                n.getUI().toggleCheck(check);
                this.updateCustomizedCheckbox(n, check);
                this.resumeEvents();
            }
            if (!expanded) {
                n.collapse();
            }
        }, this);
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

    selectNode: function(node) {
        if (this.singleUnfold) {
            var cls = node.attributes.cls, ui = node.getUI();
            ui.addClass('nodeBackgroundSelected');
            ui.removeClass(cls);
            ui.addClass(cls + 'selected');
            node.parentNode.cascade(function(n) {
                if (n != node && n != node.parentNode) {
                    cls = n.attributes.cls;
                    ui = n.getUI();
                    n.collapse();
                    ui.removeClass('nodeBackgroundSelected');
                    ui.addClass(cls);
                    ui.removeClass(cls + 'selected');
                }
            }, this);
            node.bubble(function(n) {
                if (n != node && n != this.root) {
                    cls = n.attributes.cls;
                    ui = n.getUI();
                    ui.removeClass('nodeBackgroundSelected');
                    ui.removeClass(cls);
                    ui.addClass(cls + 'selected');
                }
            }, this);
        }
    },

    getNodeText: function(layerId, nodeId) {
        return this.addtreeLayerLink(layerId, nodeId) + ' ' +
               this.layers[layerId].name;
    },

    adaptNodeConfig: function(node, level, ids) {
        level = level || 0; ids = ids || {};
        if (node.children && node.children.length > 0) {
            if (level > 0) {
                ids['LT' + level] = ids['LT' + level] || 0;
                node.id = this.id + '_LT' + level +
                           '_' + (++ids['LT' + level]);
                node.cls = 'nodeLT' + level;
                node.singleClickExpand = true;
                node._text = node.text; // store the original text,
                                        // used in the tests
                node.text = Array(level).join('') +
                            OpenLayers.i18n(node.text);
            }
            // for some reason the nodes in the catalog tree may not correspond to
            // any layer in GeoAdmin.layer.layers. Let's avoid errors if it's
            // the case.
            var nodesToRemove = [],
                i, l, child;
            for(i=0, l=node.children.length; i<l; i++) {
                child = node.children[i];
                if (child.layerId && !this.layers[child.layerId]) {
                    nodesToRemove.push(i);
                    continue;
                }
                this.adaptNodeConfig(node.children[i], level + 1, ids);
            }
            for (l=nodesToRemove.length, i=l; i>0; i--) {
                node.children.splice(nodesToRemove[i - 1],1);
            }
        } else if (node.layerId == undefined) {
            // node has no children and doesn't reference a layer,
            // we still increment ids['LT' + level] not to mess up
            // with node ids and break existing permalinks
            ids['LT' + level]++;
        } else {
            ids[node.layerId] = ids[node.layerId] || 0;
            var nodeId = this.id + '_node_' +
                         node.layerId + (++ids[node.layerId]);
            node.id = nodeId;
            node.cls = 'nodeLT' + level;
            node.text = this.getNodeText(node.layerId, nodeId);
            node.leaf = true;
            // we always want checkable nodes, if checked isn't
            // defined in the node config we add an unchecked
            // checkbox
            if (node.checked == null) {
                node.checked = false;
            }
            delete node.layerId;
        }
    },

    initComponent: function() {

        this.layers = GeoAdmin.layers.init();

        if (!this.layerStore) {
            this.layerStore = this.map;
            delete this.map;
        }
        if (!(this.layerStore instanceof GeoExt.data.LayerStore)) {
            this.layerStore = new GeoExt.data.LayerStore(
                {map: this.layerStore}
            );
        }

        this.registerMapEvent(this.layerStore.map);

        this.root = this.root || {};
        this.root.nodeType = 'async';

        this.root.children = this.root.children || 
                             GeoAdmin.CatalogTree.createDefaultConfig();
        this.adaptNodeConfig(this.root);
        GeoAdmin.CatalogTree.superclass.initComponent.call(this);

        this.addEvents("afterselection");
    },

    constructor: function(config) {
        GeoAdmin.CatalogTree.superclass.constructor.call(this, config);
        this.map = config.map;
    }
});

/** api: xtype = ga_catalogtree */
Ext.reg("ga_catalogtree", GeoAdmin.CatalogTree);

/** private: function[createDefaultConfig]
 *  :return: ``Array`` The default config. An array of
 *      litterals.
 */
GeoAdmin.CatalogTree.createDefaultConfig = function() {
    return [{
        text: 'Basisdaten',
        children: [
            {
                text: 'Referenzsysteme',  // Id Inspire 11
                children: [
                    {
                        layerId: "ch.swisstopo.fixpunkte-agnes"
                    },
                    {
                        layerId: "ch.swisstopo.fixpunkte-lage"
                    },
                    {
                        layerId: "ch.swisstopo.fixpunkte-hoehe"
                    },
                    {
                        layerId: "ch.swisstopo-vd.spannungsarme-gebiete"
                    }
                ]
            },
            {
                text: 'Geografische Gittersysteme',  // Id Inspire ??
                hidden: true
            },
            {
                text: 'Geografische Namen',  // Id Inspire 13 ??
                children: [
                     {
                        layerId: "ch.swisstopo.hiks-dufour"
                     },
                     {
                        layerId: "ch.swisstopo.hiks-siegfried"
                     },
                     {
                        layerId: "ch.swisstopo.vec200-miscellaneous"
                     },
                     {
                        layerId: "ch.swisstopo.pixelkarte-pk25.metadata"
                     },
                     {
                        layerId: "ch.swisstopo.pixelkarte-pk50.metadata"
                     },
                     {
                        layerId: "ch.swisstopo.pixelkarte-pk100.metadata"
                     },
                     {
                        layerId: "ch.swisstopo.pixelkarte-pk200.metadata"
                     },
                     {
                        layerId: "ch.swisstopo.pixelkarte-pk500.metadata"
                     },
                     {
                        layerId: "ch.swisstopo.pixelkarte-farbe-pk25.noscale"
                     },
                     {
                        layerId: "ch.swisstopo.pixelkarte-farbe-pk50.noscale"
                     },
                     {
                        layerId: "ch.swisstopo.pixelkarte-farbe-pk100.noscale"
                     },
                     {
                        layerId: "ch.swisstopo.pixelkarte-farbe-pk200.noscale"
                     },
                     {
                        layerId: "ch.swisstopo.pixelkarte-farbe-pk500.noscale"
                     },
                     {
                        layerId: "ch.swisstopo.vec200-names-namedlocation"
                     },
                     {
                        layerId: "ch.swisstopo.swisstlm3d-karte"
                     }
                ]
            },
            {
                text: 'Administrative Einheiten',  // Id Inspire 14 ??
                children: [
                    {
                        layerId: "ch.are.agglomerationen_isolierte_staedte-2000"
                    },
                    {
                        layerId: "ch.are.alpenkonvention"
                    },
                    {
                        layerId: "ch.are.gemeindetyp-1990-9klassen"
                    },
                    {
                        layerId: "ch.swisstopo.swissboundaries3d-land-flaeche.fill"
                    },
                    {
                        layerId: "ch.swisstopo.swissboundaries3d-kanton-flaeche.fill"
                    },
                    {
                        layerId: "ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill"
                    },
                    {
                        layerId: "ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill"
                    },
                    {
                        layerId: "ch.swisstopo.vec200-adminboundaries-protectedarea"
                    },
                    {
                        layerId: "ch.swisstopo-vd.ortschaftenverzeichnis_plz"
                    },
                    {
                        layerId: "ch.swisstopo-vd.geometa-los"
                    },
                    {
                        layerId: "ch.swisstopo-vd.geometa-standav"
                    }
                ]
            },
            {
                text: 'Adressen',  // Id Inspire 15 ??
                children: [
                    {
                        layerId: "ch.bfs.gebaeude_wohnungs_register"
                    },
                    {
                        layerId: "ch.swisstopo-vd.ortschaftenverzeichnis_plz"
                    }
                ]
            },
            {
                text: 'Flurstücke / Grundstücke',  // Id Inspire 16 ??
                children: [
                    {
                        layerId: "ch.kantone.cadastralwebmap-farbe"
                    },
                    {
                        layerId: "ch.swisstopo-vd.spannungsarme-gebiete"
                    }
                ]
            }
        ]
    },
    {
        text: 'Oberflächendarstellung',
        children: [
            {
                text: 'Gewässernetz',  // Id Inspire 18 ??
                children: [
                    {
                        layerId: "ch.bfe.kleinwasserkraftpotentiale"
                    },
                    {
                        layerId: "ch.swisstopo.vec200-hydrography"
                    },
                    {
                        layerId: "ch.swisstopo.vec25-gewaessernetz"
                    }
                ]
            },
            {
                text: 'Höhe',  // Id Inspire 21
                  children: [
                    {
                        layerId: "ch.swisstopo.vec200-miscellaneous-geodpoint"
                    },
                    {
                        layerId: "ch.bazl.luftfahrtkarten-icao"
                    },
                    {
                        layerId: "ch.bazl.segelflugkarte"
                    },
                    {
                        layerId: "ch.swisstopo.swissalti3d-reliefschattierung"
                    }
                ]
            },
            {
                text: 'Bodenbedeckung',  // Id Inspire 22
                children: [
                    {
                        layerId: "ch.bfs.arealstatistik-1985"
                    },
                    {
                        layerId: "ch.bfs.arealstatistik-1997"
                    },
                    {
                        layerId: "ch.bfs.arealstatistik-hintergrund"
                    },
                    {
                        layerId: "ch.bfs.arealstatistik-waldmischungsgrad"
                    },
                    {
                        layerId: "ch.swisstopo.vec200-landcover"
                    },
                    {
                        layerId: "ch.swisstopo.vec25-heckenbaeume"
                    },
                    {
                        layerId: "ch.swisstopo.vec25-primaerflaechen"
                    }
                ]
            },
            {
                text: 'Luft und Satellitenbilder',  // Id Inspire ??
                children: [
                    {
                        layerId: "ch.swisstopo.images-swissimage.metadata"
                    }
                ]
            }
        ]
    },
    {
        text: 'Raum und Bevölkerung',
        children: [
            {
                text: 'Gesundheit une Sicherheit',  // Id Inspire 35 ??
                children: [
                    {
                        layerId: "ch.bafu.laerm-bahnlaerm_nacht"
                    },
                    {
                        layerId: "ch.bafu.laerm-bahnlaerm_tag"
                    },
                    {
                        layerId: "ch.bafu.laerm-strassenlaerm_nacht"
                    },
                    {
                        layerId: "ch.bafu.laerm-strassenlaerm_tag"
                    },
                    {
                        layerId: "ch.bafu.nabelstationen"
                    },
                    {
                        layerId: "ch.bafu.swissprtr"
                    },
                    {
                        layerId: "ch.bav.laerm-emissionplan_eisenbahn_2015"
                    },
                    {
                        layerId: "ch.ensi.zonenplan-notfallschutz-kernanlagen"
                    }
                ]
            },
            {
                text: 'Bevölkerungsdichte',
                hidden: true
            },
            {
                text: 'Raumplanung',  // Id Inspire 311
                children: [
                    {
                        layerId: "ch.bak.bundesinventar-schuetzenswerte-ortsbilder"
                    },
                    {
                        layerId: "ch.blw.ursprungsbezeichnungen-fleisch"
                    },
                    {
                        layerId: "ch.blw.ursprungsbezeichnungen-kaese"
                    },
                    {
                        layerId: "ch.blw.ursprungsbezeichnungen-pflanzen"
                    },
                    {
                        layerId: "ch.blw.ursprungsbezeichnungen-spirituosen"
                    },
                    {
                        layerId: "ch.babs.kulturgueter"
                    },
                    {
                        layerId: "ch.blw.landwirtschaftliche-zonengrenzen"
                    },
                    {
                        layerId: "ch.vbs.territorialregionen"
                    }
                ]
            }
        ]
    },
    {
        text: 'Infrastruktur und Kommunikation',
        children: [
            {
                text: 'Verkehrsnetze',  // Id Inspire 17 ??
                children: [
                    {
                        layerId: "ch.astra.ausnahmetransportrouten"
                    },
                    {
                        layerId: "ch.astra.ivs-nat"
                    },
                    {
                        layerId: "ch.astra.ivs-reg_loc"
                    },
                    {
                        layerId: "ch.astra.ivs-gelaendekarte"
                    },
                    {
                        layerId: "ch.bazl.luftfahrtkarten-icao"
                    },
                    {
                        layerId: "ch.bazl.segelflugkarte"
                    },
                    {
                        layerId: "ch.swisstopo.vec200-transportation-oeffentliche-verkehr"
                    },
                    {
                        layerId: "ch.swisstopo.vec200-transportation-strassennetz"
                    },
                    {
                        layerId: "ch.swisstopo.vec25-anlagen"
                    },
                    {
                        layerId: "ch.swisstopo.vec25-eisenbahnnetz"
                    },
                    {
                        layerId: "ch.swisstopo.vec25-strassennetz"
                    },
                    {
                        layerId: "ch.swisstopo.vec25-uebrigerverkehr"
                    },
                    {
                        layerId: "ch.swisstopo.swisstlm3d-wanderwege"
                    },
                    {
                        layerId: "ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal"
                    },
                    {
                        layerId: "ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet"
                    }
                ]
            },
            {
                text: 'Gebäude',  // Id Inspire 32 ??
                children: [
                    {
                        layerId: "ch.bfs.gebaeude_wohnungs_register"
                    },
                    {
                        layerId: "ch.swisstopo.swissbuildings3d"
                    },
                    {
                        layerId: "ch.swisstopo.vec200-building"
                    },
                    {
                        layerId: "ch.swisstopo.vec25-gebaeude"
                    }
                ]
            },
            {
                text: 'Öffentliche Einrichtungen und Dienste', // Id Inspire 36 ??
                children: [
                    {
                        layerId: "ch.bfe.energieforschung"
                    },
                    {
                        layerId: "ch.astra.ausnahmetransportrouten"
                    } /*FIXME ltfoa 04.07.2012: layers ready but datenherr wants to wait for the deploy,
                    {
                        layerId: "ch.bakom.radio-fernsehsender"
                    },
                    {
                        layerId: "ch.bakom.mobil-antennenstandorte-gsm"
                    },
                    {
                        layerId: "ch.bakom.mobil-antennenstandorte-umts"
                    },
                    {
                        layerId: "ch.bakom.versorgungsgebiet-tv"
                    },
                    {
                        layerId: "ch.bakom.versorgungsgebiet-ukw"
                    } */
                ]

            }
        ]
    },
    {
        text: 'Umwelt, Biologie und Geologie',
        children: [
            {
                text: 'Schutzgebiete',  // Id Inspire 19
                children: [
                    {
                        layerId: "ch.bafu.bundesinventare-amphibien"
                    },
                    {
                        layerId: "ch.bafu.bundesinventare-amphibien_wanderobjekte"
                    },
                    {
                        layerId: "ch.bafu.bundesinventare-auen"
                    },
                    {
                        layerId: "ch.bafu.bundesinventare-bln"
                    },
                    {
                        layerId: "ch.bafu.bundesinventare-flachmoore"
                    },
                    {
                        layerId: "ch.bafu.bundesinventare-hochmoore"
                    },
                    {
                        layerId: "ch.bafu.bundesinventare-jagdbanngebiete"
                    },
                    {
                        layerId: "ch.bafu.bundesinventare-moorlandschaften"
                    },
                    {
                        layerId: "ch.bafu.schutzgebiete-schweizerischer_nationalpark"
                    },
                    {
                        layerId: "ch.bafu.schutzgebiete-paerke_nationaler_bedeutung"
                    },
                    {
                        layerId: "ch.bafu.schutzgebiete-ramsar"
                    },
                    {
                        layerId: "ch.bafu.bundesinventare-vogelreservate"
                    },/*
                    {
                        layerId: "ch.bafu.schutzgebiete-wildruhezonen"
                    },*/
                    {
                        layerId: "ch.bafu.unesco-weltnaturerbe"
                    }
                ]
            },
            {
                text: 'Geologie',  // Id Inspire 24
                children: [
                    {
                        layerId: "ch.swisstopo.geologie-geophysik-aeromagnetische_karte_schweiz"
                    },
                    {
                        layerId: "ch.swisstopo.geologie-geodaesie-bouguer_anomalien"
                    },
                    {
                        layerId: "ch.swisstopo.geologie-geophysik-deklination"
                    },
                    {
                        layerId: "ch.swisstopo.geologie-geologischer_atlas"
                    },
                    {
                        layerId: "ch.swisstopo.geologie-geologische_karte"
                    },
                    {
                        layerId: "ch.swisstopo.geologie-geophysik-geothermie"
                    },
                    {
                        layerId: "ch.swisstopo.geologie-geotope"
                    },
                    {
                        layerId: "ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen"
                    },
                    {
                        layerId: "ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet"
                    },
                    {
                        layerId: "ch.swisstopo.geologie-geophysik-inklination"
                    },
                    {
                        layerId: "ch.swisstopo.geologie-geodaesie-isostatische_anomalien"
                    },
                    {
                        layerId: "ch.swisstopo.geologie-eiszeit-lgm-raster"
                    },
                    {
                        layerId: "ch.swisstopo.geologie-geophysik-totalintensitaet"
                    },
                    {
                        layerId: "ch.swisstopo.geologie-geotechnik-gk500-genese"
                    },
                    {
                        layerId: "ch.swisstopo.geologie-geotechnik-gk500-gesteinsklassierung"
                    },
                    {
                        layerId: "ch.swisstopo.geologie-geotechnik-gk500-lithologie_hauptgruppen"
                    },
                    {
                        layerId: "ch.swisstopo.geologie-tektonische_karte"
                    }
                ]
            },
            {
                text: 'Boden',  // Inspire 33 ??
                children: [
                    {
                        layerId: "ch.bav.kataster-belasteter-standorte-oev"
                    },
                    {
                        layerId: "ch.blw.erosion"
                    },
                    {
                        layerId: "ch.blw.hang_steillagen"
                    },
                    {
                        layerId: "ch.blw.steil_terrassenlagen_rebbau"
                    }
                ]
            },
            {
                text: 'Umweltüberwachung',  // Id Inspire 37 ??
                children: [
                    {
                        layerId: "ch.are.alpenkonvention"
                    },
                    {
                        layerId: "ch.bav.kataster-belasteter-standorte-oev"
                    },
                    {
                        layerId: "ch.bafu.hydrologie-hydromessstationen"
                    },
                    {
                        layerId: "ch.bafu.wasser-entnahme"
                    },
                    {
                        layerId: "ch.bafu.wasser-leitungen"
                    },
                    {
                        layerId: "ch.bafu.wasser-rueckgabe"
                    }
                ]
            },
            {
                text: 'Natürliche Risikozonen',  // Id Inspire 312
                children: [
                    /*      FIXME 25.05.2011_ltfoa: maybe not allowed in geoadmin?
                     {
                     layerId: "ch.bafu.gefahren-gefaehrdungszonen"
                     },
                     */
                    {
                        layerId: "ch.bafu.permafrost"
                    },
                    {
                        layerId: "ch.bafu.showme-gemeinden_hochwasser"
                    },
                    {
                        layerId: "ch.bafu.showme-gemeinden_lawinen"
                    },
                    {
                        layerId: "ch.bafu.showme-gemeinden_rutschungen"
                    },
                    {
                        layerId: "ch.bafu.showme-gemeinden_sturzprozesse"
                    },
                    {
                        layerId: "ch.bafu.showme-kantone_hochwasser"
                    },
                    {
                        layerId: "ch.bafu.showme-kantone_lawinen"
                    },
                    {
                        layerId: "ch.bafu.showme-kantone_rutschungen"
                    },
                    {
                        layerId: "ch.bafu.showme-kantone_sturzprozesse"
                    }
                ]
            },
            {
                text: 'Atmosphärische Bedingungen',
                hidden: true
            },
            {
                text: 'Meteorologie', // Id Inspire = 314
                children: [
                    {
                        layerId: "ch.blw.bodeneignung-kulturland"
                    },
                    {
                        layerId: "ch.blw.bodeneignung-kulturtyp"
                    },
                    {
                        layerId: "ch.blw.bewaesserungsbeduerftigkeit"
                    },
                    {
                        layerId: "ch.blw.klimaeignung-futterbau"
                    },
                    {
                        layerId: "ch.blw.klimaeignung-getreidebau"
                    },
                    {
                        layerId: "ch.blw.klimaeignung-kartoffeln"
                    },
                    {
                        layerId: "ch.blw.klimaeignung-koernermais"
                    },
                    {
                        layerId: "ch.blw.klimaeignung-kulturland"
                    },
                    {
                        layerId: "ch.blw.klimaeignung-spezialkulturen"
                    },
                    {
                        layerId: "ch.blw.klimaeignung-typ"
                    },
                    {
                        layerId: "ch.blw.klimaeignung-zwischenfruchtbau"
                    },
                    {
                        layerId: "ch.blw.niederschlagshaushalt"
                    },
                    {
                        layerId: "ch.blw.alpprodukte"
                    },
                    {
                        layerId: "ch.blw.bergprodukte"
                    }
                ]
            },
            {
                text: 'Biogeografische Regionen',
                hidden: true
            },
            {
                text: 'Lebensräume une Biotope',  // Id Inspire 318
                children: [
                    {
                        layerId: "ch.bafu.bundesinventare-amphibien"
                    },
                    {
                        layerId: "ch.bafu.bundesinventare-amphibien_wanderobjekte"
                    },
                    {
                        layerId: "ch.bafu.bundesinventare-auen"
                    },
                    {
                        layerId: "ch.bafu.ren-extensive_landwirtschaftsgebiete"
                    },
                    {
                        layerId: "ch.bafu.ren-feuchtgebiete"
                    },
                    {
                        layerId: "ch.bafu.bundesinventare-flachmoore"
                    },
                    {
                        layerId: "ch.bafu.ren-fliessgewaesser_seen"
                    },
                    {
                        layerId: "ch.bafu.bundesinventare-hochmoore"
                    },
                    {
                        layerId: "ch.bafu.bundesinventare-jagdbanngebiete"
                    },
                    {
                        layerId: "ch.bafu.bundesinventare-moorlandschaften"
                    },
                    {
                        layerId: "ch.bafu.ren-trockenstandorte"
                    },
                    {
                        layerId: "ch.bafu.ren-wald"
                    },
                    {
                        layerId: "ch.bafu.bundesinventare-vogelreservate"
                    },
                    {
                        layerId: "ch.bafu.unesco-weltnaturerbe"
                    }
                ]
            },
            {
                text: 'Artenvielfalt',  // Id Inspire 319
                children: [
                    {
                        layerId: "ch.bafu.fauna-steinbockkolonien"
                    }
                ]
            },
            {
                text: 'Mineralische Bodenschätze',
                hidden: true
            }
        ]
    },
    {
        text: 'Energie und Wirtschaft',
        children: [
            {
                text: 'Statistische Einheiten',  // Id Inspire 31 ??
                children: [
                    {
                        layerId: "ch.are.agglomerationen_isolierte_staedte-2000"
                    },
                    {
                        layerId: "ch.are.gemeindetyp-1990-9klassen"
                    }
                ]
            },
            {
                text: 'Landnutzung', //Id Inspire = 34
                children: [
                    {
                        layerId: "ch.bfs.arealstatistik-hintergrund"
                    },
                    /* FIXME 25.05.2011_ltfoa: maybe not allowed in geoadmin?
                     {
                     layerId: "ch.bafu.holznutzung"
                     },
                     {
                     layerId: "ch.bafu.holzvorrat"
                     },
                     {
                     layerId: "ch.bafu.holzzuwachs"
                     },
                     */
                    {
                        layerId: "ch.swisstopo.vec25-einzelobjekte"
                    },
                    {
                        layerId: "ch.blw.alpprodukte"
                    },
                    {
                        layerId: "ch.blw.bergprodukte"
                    },
                    {
                        layerId: "ch.blw.bodeneignung-kulturland"
                    },
                    {
                        layerId: "ch.blw.bodeneignung-kulturtyp"
                    },
                    {
                        layerId: "ch.blw.klimaeignung-futterbau"
                    },
                    {
                        layerId: "ch.blw.klimaeignung-getreidebau"
                    },
                    {
                        layerId: "ch.blw.klimaeignung-kartoffeln"
                    },
                    {
                        layerId: "ch.blw.klimaeignung-koernermais"
                    },
                    {
                        layerId: "ch.blw.klimaeignung-kulturland"
                    },
                    {
                        layerId: "ch.blw.klimaeignung-spezialkulturen"
                    },
                    {
                        layerId: "ch.blw.klimaeignung-typ"
                    },
                    {
                        layerId: "ch.blw.klimaeignung-zwischenfruchtbau"
                    },
                    {
                        layerId: "ch.blw.niederschlagshaushalt"
                    },
                    {
                        layerId: "ch.blw.ursprungsbezeichnungen-fleisch"
                    },
                    {
                        layerId: "ch.blw.ursprungsbezeichnungen-kaese"
                    },
                    {
                        layerId: "ch.blw.ursprungsbezeichnungen-pflanzen"
                    },
                    {
                        layerId: "ch.blw.ursprungsbezeichnungen-spirituosen"
                    },
                    {
                        layerId: "ch.blw.landwirtschaftliche-zonengrenzen"
                    }
                ]
            },
            {
                text: 'Produktions- und Industrieanlagen',
                hidden: true
            },
            {
                text: 'Land- und Wassertwirtschaft', // Id Inspire 39 
                children: [
                    {
                        layerId: "ch.blw.bewaesserungsbeduerftigkeit"
                    }
                ] 
            },
            {
                text: 'Energiequellen',  // Id Inspire 320 ??
                children: [
                    {
                        layerId: "ch.bfe.energieforschung"
                    },
                    {
                        layerId: "ch.bfe.kleinwasserkraftpotentiale"
                    },
                    {
                        layerId: "ch.swisstopo.vec200-miscellaneous"
                    },
                    {
                        layerId: "ch.swisstopo.geologie-geophysik-geothermie"
                    },
                    {
                        layerId: "ch.bfe.statistik-wasserkraftanlagen"
                    },
                    {
                        layerId: "ch.bfe.stauanlagen-bundesaufsicht"
                    },
                    {
                        layerId: "ch.bfe.abgeltung-wasserkraftnutzung"
                    }

                ]
            }
        ]
    }];
};
