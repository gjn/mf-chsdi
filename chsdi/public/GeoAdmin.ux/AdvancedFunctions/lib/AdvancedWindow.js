/** api: (define)
 *  module = GeoAdmin
 *  class = PermalinkWindow
 *  base_link = `Ext.Window <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Window>`_
 */

GeoAdmin.AdvancedWindow = Ext.extend(Ext.Window, {

    initComponent: function() {

        this.layout = 'accordion';
        this.title = OpenLayers.i18n('AdvancedWindow.title');
        this.closeAction = 'hide';
        this.height = 200;
        this.width = 600;
        this.activeOnTop = true;
        this.cls = 'x-btn-no-over';
        this.id = 'advanced-window';
        this.iconCls = 'advanced-window';
        this.iconAlign = 'right';
        this.text = OpenLayers.i18n('print');
        this.toggleGroup = 'tools';
      
        GeoAdmin.AdvancedWindow.superclass.initComponent.apply(
                this, arguments);
    }
});

/** api: xtype = ga_advancedwindow */
Ext.reg("ga_advancedwindow", GeoAdmin.AdvancedWindow);