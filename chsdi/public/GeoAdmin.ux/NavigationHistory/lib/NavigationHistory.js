/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @include OpenLayers/Lang.js
 * @include OpenLayers/Control/NavigationHistory.js
 * @include GeoExt/widgets/Action.js
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
