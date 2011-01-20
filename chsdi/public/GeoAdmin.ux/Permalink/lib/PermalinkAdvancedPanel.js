/**
 * @include Permalink/lib/PermalinkField.js
 */
 
/** api: (define)
 *  module = GeoAdmin
 *  class = PermalinkAdvancedPanel
 *  base_link = `Ext.form.FormPanel <http://dev.sencha.com/deploy/dev/docs/?class=Ext.form.FormPanel>`_
 */
 

/** api: constructor
 *  .. class:: PermalinkAdvancedPanel(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.PermalinkAdvancedPanel``
 *
 *  Create a permalink panel for the advanced functions window
 */

GeoAdmin.PermalinkAdvancedPanel = Ext.extend(Ext.form.FormPanel, {
    border: false,
    width: 460,
    cls: "permalink-advanced-panel",
    ctCls: "permalink-advanced-panel-ct",
    baseCls: "permalink-advanced-panel",
    labelAlign: "top",
    closeButtonToggleGroup: "export",

    initComponent: function() {
        this.title = OpenLayers.i18n("Map URL");
        this.items = new GeoAdmin.PermalinkField({width: 440});
        GeoAdmin.PermalinkAdvancedPanel.superclass.initComponent.apply(
            this, arguments);
    },

    afterRender: function() {
        GeoAdmin.PermalinkAdvancedPanel.superclass.afterRender.apply(
            this, arguments);
        // we want to swallow events not to have the map move
        // when mouse actions occur on this panel
        this.body.swallowEvent([
            "mousedown", "mousemove", "mouseup", "click", "dblclick"
        ]);
    }
});

/** api: xtype = ga_permalinkadvancedpanel */
Ext.reg("ga_permalinkadvancedpanel", GeoAdmin.PermalinkAdvancedPanel);
