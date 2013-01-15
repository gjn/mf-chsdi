/*
 * @requires GeoExt/widgets/tree/LayerNode.js
 */

/** api: (define)
 *  module = GeoAdmin
 *  class  = LayerNode
 *  base_link = `GeoExt.tree.LayerNode <http://www.geoext.org/lib/GeoExt/widgets/tree/LayerNode.html>`_
 */

/** api: constructor
 *  .. class:: LayerNode(config)
 *
 *  :param config: ``Object`` config
 *
 *  GeoAdmin layer node
 */
  
GeoAdmin.LayerNode = Ext.extend(GeoExt.tree.LayerNode, {

    constructor: function(config) {
        if(config.layer.geoadmin_queryable){
            config.iconCls = 'tree-layer-icon-queryable';
        }else{
            config.iconCls = 'tree-layer-icon';
        }
        // String has a max length of 30
        var layerName = config.layer.name;
        config.layer.name = layerName.length > 30 ? layerName.substring(0, 30) + '...' : layerName;

        // This could be done also in createLayer from Layers.js
        if (config.layer.timestamp) {
            if (!config.layer.isActualTimestamp(config.layer.timestamp)) {
                if (!config.layer.isTimeStamped) {
                    config.layer.name = config.layer.name + ' ' + config.layer.timestamp;
                }
                config.layer.isTimeStamped = true;

            }
        }
        GeoAdmin.LayerNode.superclass.constructor.apply(this, arguments);
    },

    hideIfFirst: function(el) {
        var isFirst = this.isFirst();
        if (isFirst && !this._updating && this.nextSibling &&
            this.nextSibling.hidden === false) {
            this._updating = true; // avoid recursion
            var next = this.nextSibling;
            if (next) {
                next.getUI().updateActions();
            }
            delete this._updating;
        }
        if (isFirst) {
            el.hide();
        } else {
            el.show();
        }
    },

    hideIfLast: function(el) {
        var isLast = this.isLast();
        if (isLast && !this._updating && this.previousSibling &&
            this.previousSibling.hidden === false) {
            this._updating = true; // avoid recursion
            var previous = this.previousSibling;
            if (previous) {
                previous.getUI().updateActions();
            }
            delete this._updating;
        }
        if (isLast) {
            el.hide();
        } else {
            el.show();
        }
    }
});

Ext.tree.TreePanel.nodeTypes.geoadmin_layer = GeoAdmin.LayerNode;
