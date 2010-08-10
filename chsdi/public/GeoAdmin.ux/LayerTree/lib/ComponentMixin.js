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
 *  class = ComponentMixin
 */

/** api: constructor
 *  ``Ext.Component or Object or Function`` This property is to be used
 *  when an Ext component is to be inserted in the node. This property can
 *  be used in several ways, it can reference
 *  * ``Ext.Component`` a component instance. In this case the provided
 *    component is just rendered in the node.
 *  * ``Object`` a component config (using ``xtype``). In this case the
 *    component is instantiated and then rendered in the node.
 *  * ``Function`` a function returning a component instance or config.
 *    This function is passed a reference to the layer node and to the Ext
 *    element (``Ext.Element``) into which the component is to be rendered,
 *    it must returned a component instance or config.
 *  * ``Object`` an object with a ``fn`` and ``scope`` properties. ``fn``
 *    references a function returning a component instance or config (like
 *    previously), ``scope`` is its execution scope.
 *  This property applies only if the node is configured with a
 *  :class:`GeoAdmin.LayerNodeUI` UI instance (which is the default).
 */

/** api: example
 *  Sample code to create a layer node UI with a radio button:
 *
 *  .. code-block:: javascript
 *
 *      var uiClass = Ext.extend(
 *          GeoExt.tree.LayerNodeUI,
 *          new GeoAdmin.ComponentMixin()
 *      );
 *
 *  Sample code to create a tree node UI with a radio button:
 *
 *  .. code-block:: javascript
 *
 *      var uiClass = Ext.extend(
 *          Ext.tree.TreeNodeUI,
 *          new GeoAdmin.ComponentMixin()
 *      );
 */

GeoAdmin.ComponentMixin = function() {
    return (function() {
        /** private: property[superclass]
         *  ``Ext.tree.TreeNodeUI`` A reference to the superclass that is
         *  extended with this mixin object.
         */
        var superclass;

        return {
            /** private: method[constructor]
             *  :param node: ``Ext.tree.TreeNode`` The tree node.
             */
            constructor: function(node) {
                superclass = arguments.callee.superclass;
                superclass.constructor.apply(this, arguments);
            },

            /** private: method[render]
             *  :param bulkRender: ``Boolean``
             */
            render: function(bulkRender) {
                var rendered = this.rendered;
                superclass.render.apply(this, arguments);
                var attr = this.node.attributes;
                var component = attr.component || this.component;
                if(!rendered && component) {
                    var elt = Ext.DomHelper.append(this.elNode, [
                        {"tag": "div"}
                    ]);
                    if(typeof component == "function") {
                        component = component(this.node, elt);
                    } else if (typeof component == "object" &&
                               typeof component.fn == "function") {
                        component = component.fn.apply(
                            component.scope, [this.node, elt]
                        );
                    }
                    if(typeof component == "object" &&
                       typeof component.xtype == "string") {
                        component = Ext.ComponentMgr.create(component);
                    }
                    if(component instanceof Ext.Component) {
                        component.render(elt);
                        this.node.component = component;
                    }
                }
            }
        };
    })();
};
