/**
 * @include Permalink/lib/PermalinkField.js
 */
 
/** api: (define)
 *  module = GeoAdmin
 *  class = PermalinkPanel
 *  base_link = `Ext.form.FormPanel <http://dev.sencha.com/deploy/dev/docs/?class=Ext.form.FormPanel>`_
 */
 
/** api: example
 *  Sample code to use a permalink panel:
 *
 *  .. code-block:: javascript
 *
 *    permalinkPanel1 = new GeoAdmin.PermalinkPanel({hidden: true});
 *    permalinkPanel2 = new GeoAdmin.PermalinkPanel({hidden: true});
 *
 *    mapPanel = new GeoAdmin.MapPanel({
 *        region: "center",
 *        border: false,
 *        width: 600,
 *        map: new GeoAdmin.Map(),
 *        tbar: ["->", {
 *            text: "permalink 1",
 *            enableToggle: true,
 *           toggleGroup: "export",
 *            allowDepress: true,
 *            toggleHandler: function(btn, state) {
 *                permalinkPanel1.setVisible(state);
 *            }
 *        }, {
 *            text: "permalink 2",
 *            enableToggle: true,
 *            toggleGroup: "export",
 *            allowDepress: true,
 *            toggleHandler: function(btn, state) {
 *                permalinkPanel2.setVisible(state);
 *            }
 *        }],
 *        items: [permalinkPanel1, permalinkPanel2]
 *    });
 *
 *    mainPanel = new Ext.Panel({
 *        renderTo: Ext.getBody(),
 *        layout: "border",
 *        width: 800,
 *        height: 400,
 *        items: [{
 *            region: "west",
 *            width: 200,
 *            collapsible: true,
 *            html: ["<p>If you collapse this panel,",
 *                   "the permalink panel should not be",
 *                   "resized</p>"].join(" ")
 *        }, 
 *            mapPanel
 *        ]
 *    });
 *    
 */
 
/** api: constructor
 *  .. class:: PermalinkPanel(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.PermalinkPanel``
 *
 *  Create a permalink panel
 */

GeoAdmin.PermalinkPanel = Ext.extend(Ext.form.FormPanel, {
    border: false,
    width: 460,
    cls: "permalink-panel",
    ctCls: "permalink-panel-ct",
    baseCls: "permalink-panel",
    labelAlign: "top",
    closeButtonToggleGroup: "export",

    initComponent: function() {
        this.title = OpenLayers.i18n("Map URL");
        this.items = new GeoAdmin.PermalinkField({width: 440});
        this.tbar = ["->", {
            iconCls: "close-button", 
            toggleGroup: this.closeButtonToggleGroup,
            handler: function() { this.hide(); },
            scope: this
        }];
        GeoAdmin.PermalinkPanel.superclass.initComponent.apply(
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

/** api: xtype = ga_permalinkpanel */
Ext.reg("ga_permalinkpanel", GeoAdmin.PermalinkPanel);
