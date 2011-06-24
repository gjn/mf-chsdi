/**
 * @include LayerManager/lib/LayerManagerWindow.js
 */

Ext.namespace('GeoAdmin');


/** api: (define)
 *  module = GeoAdmin
 *  class = LayerManager
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
 *   mapPanel.getTopToolbar().add(new GeoAdmin.LayerManager(mapPanel, {}));
 *
 */

/** api: constructor
 *  .. class:: LayerManager(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.LayerManager``
 *
 *  Create a LayerManager (vector file importation)
 */

GeoAdmin.LayerManager = Ext.extend(Ext.Action, {

    /**
     */
    constructor : function(config) {

        var layerManangerWindow = new GeoAdmin.LayerManagerWindow(Ext.apply({
            renderTo: Ext.getBody()
        }, config));

        config = Ext.apply({
            allowDepress: false,
            iconCls: 'layermanager',
            text: OpenLayers.i18n('LayerManager'),
            handler: function() {
                layerManangerWindow.show();
            }
        }, config);

        GeoAdmin.LayerManager.superclass.constructor.call(this, config);
    }
});

/** api: xtype = ga_wmsbrowser */
Ext.reg("ga_layermanager", GeoAdmin.LayerManager);
