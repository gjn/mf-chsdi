/** api: (define)
 *  module = GeoAdmin
 *  class = PermalinkWindow
 *  base_link = `Ext.Window <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Window>`_
 */

GeoAdmin.AdvancedWindow = Ext.extend(Ext.Window, {

    initComponent: function(config) {

        Ext.apply(this,
        {
            layout: 'accordion',
            title: OpenLayers.i18n('AdvancedWindow.title'),
            closeAction: 'hide',
            //height: 200,
            width: 400,
            activeOnTop: true,
            cls: 'x-btn-no-over',
            id: 'advanced-window',
            iconCls: 'advanced-window',
            iconAlign: 'right',
            text: OpenLayers.i18n('print'),
            toggleGroup: 'tools',
            defaults: {
                // applied to each contained panel
                baseCls: 'advanced-window-panel'
            }
        });
        GeoAdmin.AdvancedWindow.superclass.initComponent.apply(
                this, arguments);
    }
});

/** api: xtype = ga_advancedwindow */
Ext.reg("ga_advancedwindow", GeoAdmin.AdvancedWindow);
