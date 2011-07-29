/** api: (define)
 *  module = GeoAdmin
 *  class = AdvancedPanel
 *  base_link = `Ext.form.FormPanel <http://dev.sencha.com/deploy/dev/docs/?class=Ext.form.FormPanel>`_
 */
 
/** api: constructor
 *  .. class:: AdvancedPanel(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.AdvancedPanel``
 *
 *  Create an advanced panel
 */

GeoAdmin.AdvancedPanel = Ext.extend(Ext.form.FormPanel, {
    border: false,
    width: 460,
    cls: "advanced-panel",
    ctCls: "advanced-panel-ct",
    baseCls: "advanced-panel",
    labelAlign: "top",
    closeButtonToggleGroup: "export",

    initComponent: function() {
        var lbl2 = new Ext.form.Label({
           id:"fpl2",
           html: "Employee Configuration2 ",
           listeners: {
              render: function(c){
                 c.getEl().on('click', function(){
                    Ext.Msg.alert('Hello', 'World');
                 }, c);
              }
           }
        });
        this.items = [lbl2]
        GeoAdmin.AdvancedPanel.superclass.initComponent.apply(
            this, arguments);
    },

    afterRender: function() {
        GeoAdmin.PermalinkPanel.superclass.afterRender.apply(
            this, arguments);
        // we want to swallow events not to have the map move
        // when mouse actions occur on this panel
        this.body.swallowEvent([
            "mousedown", "mousemove", "mouseup", "click", "dblclick"
        ]);
    }
});

/** api: xtype = ga_advancedpanel */
Ext.reg("ga_advancedpanel", GeoAdmin.AdvancedPanel);
