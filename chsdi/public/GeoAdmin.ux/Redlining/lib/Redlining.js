/**
 * @include Redlining/lib/RedliningWindow.js
 */

Ext.namespace('GeoAdmin');


/** api: (define)
 *  module = GeoAdmin
 *  class = Redlining
 *  base_link = `Ext.Action <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Action>`_
 */

/** api: example
 *  Sample code to create a layer mananger (see also :ref:`permalink`):
 *
 *  .. code-block:: javascript
 *
 *     var mapPanel = new GeoAdmin.MapPanel({
 *         renderTo: "map",
 *         map: new GeoAdmin.Map(),
 *         tbar: ["->"]
 *     });
 *   mapPanel.getTopToolbar().add(new GeoAdmin.Redlining(mapPanel, {}));
 *
 */

/** api: constructor
 *  .. class:: Redlining(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.Redlining``
 *
 *  Create a Redlining (vector file importation)
 */

GeoAdmin.Redlining = Ext.extend(Ext.Action, {
	
	  map: null,

    /**
     */
    constructor : function(config) {
        this.map = config.map || null;
        var redliningWindow = new GeoAdmin.RedliningWindow(Ext.apply({
            renderTo: Ext.getBody()
        }, config));
        config = Ext.apply({
            allowDepress: false,
            iconCls: 'redlining',
            text: OpenLayers.i18n('Redlining'),
            handler: function() {
                redliningWindow.show();
            },
            map: this.map
        }, config);

        GeoAdmin.Redlining.superclass.constructor.call(this, config);
    }
});

/** api: xtype = ga_redlining */
Ext.reg("ga_redlining", GeoAdmin.Redlining);
