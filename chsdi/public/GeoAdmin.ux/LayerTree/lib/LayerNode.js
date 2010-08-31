/*
 * @requires GeoExt/widgets/tree/LayerNode.js
 */

GeoAdmin.LayerNode = Ext.extend(GeoExt.tree.LayerNode, {

    constructor: function(config) {
        if (config.layer.layerType) {
            config.iconCls = 'tree-layer-icon-' + config.layer.layerType;
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
