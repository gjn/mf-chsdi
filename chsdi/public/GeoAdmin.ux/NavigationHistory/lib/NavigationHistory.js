/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @include OpenLayers/Lang.js
 * @include OpenLayers/Control/NavigationHistory.js
 * @include GeoExt/widgets/Action.js
 */

/** api: (define)
 *  module = GeoAdmin
 *  class = NavigationHistory
 *  base_link = `Ext.Container <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Container>`_
 */


/** api: example
 *  Sample code to create a map panel with a navigation history control (see also :ref:`navigation-history`):
 *
 *  .. code-block:: javascript
 *
 *     map = new GeoAdmin.Map();
 *     mapPanel = new GeoExt.MapPanel({
 *         title: "MapPanel",
 *          renderTo: "map",
 *          map: map,
 *          height: 400,
 *          width: 600,
 *          bbar: [
 *              new GeoAdmin.NavigationHistory({
 *                  map: map
 *               })
 *          ]
 *     });
 *
 */

/** api: constructor
 *  .. class:: NavigationHistory(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.NavigationHistory``
 *
 *  Create a navigation history control with two button to navigate forward and backward in history 
 */

GeoAdmin.NavigationHistory = Ext.extend(Ext.Container, {

    map: null,
    layout: 'column',

    initComponent: function() {
        var history = new OpenLayers.Control.NavigationHistory();
        history.activate();
        this.map.addControl(history);
        this.id = "geoadmin_navigation_history";

        this.items = [
            new Ext.Button(new GeoExt.Action(Ext.applyIf({
                tooltip: OpenLayers.i18n("previous"),
                control: history.previous,
                iconCls: 'navigationhistory_previous',
                disabled: true 
            }, this.defaults || {}))),
            new Ext.Button(new GeoExt.Action(Ext.applyIf({
                tooltip: OpenLayers.i18n("next"),
                control: history.next,
                iconCls: 'navigationhistory_next',
                disabled: true 
            }, this.defaults || {})))
        ];

        GeoAdmin.NavigationHistory.superclass.initComponent.apply(this, arguments);
    }
});
