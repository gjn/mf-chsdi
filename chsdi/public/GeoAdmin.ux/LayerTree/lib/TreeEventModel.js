
/*
 * Overload Ext.tree.TreeEventModel.prototype.getNode not to
 * limit getTarget to 10 for the maximum search depth. Without
 * this tooltips don't work for the toolbar's buttons, because
 * they are more than 10 elements away from the node.
 */
Ext.tree.TreeEventModel.prototype.getNode = function(e) {
    var t;
    if(t = e.getTarget('.x-tree-node-el', 50)){
        var id = Ext.fly(t, '_treeEvents').getAttribute('tree-node-id', 'ext');
        if(id){
            return this.tree.getNodeById(id);
        }
    }
    return null;
};
