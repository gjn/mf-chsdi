/**
 * @include WmsBrowser/lib/WmsBrowserWindow.js
 */

Ext.namespace('GeoAdmin');


/** api: (define)
 *  module = GeoAdmin
 *  class = WmsBrowser
 *  base_link = `Ext.Action <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Action>`_
 */

/** api: example
 *  Sample code to create a permalink (see also :ref:`permalink`):
 *
 *  .. code-block:: javascript
 *
 *     var mapPanel = new GeoAdmin.MapPanel({
 *         renderTo: "map",
 *         map: new GeoAdmin.Map(),
 *         tbar: ["->"]
 *     });
 *   mapPanel.getTopToolbar().add(new GeoAdmin.WmsBrowser(mapPanel, {}));
 *
 */

/** api: constructor
 *  .. class:: WmsBrowser(mappanel, config)
 *
 *  :param mappanel: ``Object`` mappanel
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.WmsBrowser``
 *
 *  Create a WmsBrowser
 */

GeoAdmin.WmsBrowser = Ext.extend(Ext.Action, {

    /**
     */
    constructor : function(mappanel, config) {

        var wmsbrowserWindow = new GeoAdmin.WmsBrowserWindow(mappanel, {
            renderTo: Ext.getBody()
        });

        config = Ext.apply({
            allowDepress: false,
            iconCls: 'wmsbrowser',
            text: OpenLayers.i18n('WmsBrowser'),
            handler: function() {
                wmsbrowserWindow.show();
            }
        }, config);

        GeoAdmin.WmsBrowser.superclass.constructor.call(this, config);
    }
});

/** api: xtype = ga_wmsbrowser */
Ext.reg("ga_wmsbrowser", GeoAdmin.WmsBrowser);
