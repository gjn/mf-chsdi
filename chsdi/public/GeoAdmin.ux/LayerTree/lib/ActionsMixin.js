/**
 * Copyright (c) 2008-2009 The Open Source Geospatial Foundation
 * 
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

Ext.namespace("GeoAdmin");

/** api: (define)
 *  module = GeoAdmin
 *  class = ActionsMixin
 */

/** api: constructor
 *  A mixin to create tree node UIs with actions.
 *
 *  An action is a clickable image in a tree node, which, when clicked,
 *  leads to an "action" event being triggered by the node.
 *
 *  To set actions in a node an ``actions`` property must be provided in
 *  the node config options. This property references is an array of 
 *  action objects, each action objects has the following property:
 *
 *  * "action" ``String`` the name of the action. It is used as
 *    the name of the ``<img>`` class. The ``img`` tag being placed in a
 *    div whose class is "gx-tree-layer-actions" a CSS selector for the
 *    action is ``.gx-tree-layer-actions .action-name``. The name of the
 *    action is also provided in the "action" event for listeners to know
 *    which action got clicked. (required)
 *  * "qtip" ``String`` the tooltip displayed when the action
 *    image is hovered. (required)
 *  * "update" ``Function`` a function executed after the action is
 *    rendered in the node, it receives the ``Ext.Element`` object
 *    representing the image and executes with the node as its
 *    scope. For example, this function can be used to hide the
 *    action based on some condition. (optional)
 */

/** api: example
 *  Sample code to create a layer node UI with an actions mixin:
 *
 *  .. code-block:: javascript
 *
 *      var uiClass = Ext.extend(
 *          GeoExt.tree.LayerNodeUI,
 *          new GeoAdmin.ActionsMixin()
 *      );
 *
 *  Sample code to create a tree node UI with an actions mixin:
 *
 *  .. code-block:: javascript
 *
 *      var uiClass = Ext.extend(
 *          Ext.tree.TreeNodeUI,
 *          new GeoAdmin.ActionsMixin()
 *      );
 */

GeoAdmin.ActionsMixin = function() {
    return (function() {
        /** private: property[superclass]
         *  ``Ext.tree.TreeNodeUI`` A reference to the superclass that is
         *  extended with this mixin object.
         */
        var superclass;
        
        return {
            /** private: constant[actionsCls]
             */
            actionsCls: "gx-tree-layer-actions",
         
            /** private: constant[actionCls]
             */
            actionCls: "gx-tree-layer-action",

            /** private: method[constructor]
             *  :param node: ``Ext.tree.TreeNode`` The tree node.
             */
            constructor: function(node) {
                node.addEvents("action");
                superclass = arguments.callee.superclass;
                superclass.constructor.apply(this, arguments);
            },

            /** private: method[render]
             *  :param bulkRender: ``Boolean``
             */
            render: function(bulkRender) {
                var rendered = this.rendered;
                superclass.render.apply(this, arguments);
                if(!rendered) {
                    var attr = this.node.attributes;
                    var actions = attr.actions || this.actions;
                    if(actions && actions.length > 0) {
                        var html = ['<div class="', this.actionsCls, '">'];
                        for(var i=0,len=actions.length; i<len; i++) {
                            var a = actions[i];
                            html = html.concat([
                                '<img id="'+this.node.id+'_'+a.action,
                                '" ext:qtip="'+a.qtip,
                                '" src="'+this.emptyIcon,
                                '" class="'+this.actionCls+' '+a.action+'" />'
                            ]);
                        }
                        html.concat(['</div>']);
                        Ext.DomHelper.insertFirst(this.elNode, html.join(""));
                    }
                    this.updateActions();
                }
            },

            /** private: method[updateActions]
             *
             *  Update all the actions.
             */
            updateActions: function() {
                var n = this.node;
                var actions = n.attributes.actions || this.actions || [];
                Ext.each(actions, function(a, index) {
                    var el = Ext.get(n.id + '_' + a.action);
                    if (el && typeof a.update == "function") {
                        a.update.call(n, el);
                    }
                });
            },
         
            /** private: method[onClick]
             *  :param e: ``Object``
             */
            onClick: function(e) {
              if(e.getTarget('.' + this.actionCls, 1)) {
                    var t = e.getTarget('.' + this.actionCls, 1);
                    var action = t.className.replace(this.actionCls + ' ', '');
                    this.fireEvent("action", this.node, action, e);
                } else {
                    superclass.onClick.apply(this, arguments);
                }
            }
        };
    })();
};
