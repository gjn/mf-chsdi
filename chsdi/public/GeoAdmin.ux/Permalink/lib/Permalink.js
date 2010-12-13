/**
 * @include Permalink/lib/PermalinkField.js
 * @include Permalink/lib/PermalinkWindow.js
 * @requires Permalink/lib/PermalinkProvider.js
 */

Ext.namespace('GeoAdmin');

// create the permalink provider and set it into
// the state manager
Ext.state.Manager.setProvider(new GeoAdmin.PermalinkProvider());

/** api: (define)
 *  module = GeoAdmin
 *  class = Permalink
 *  base_link = `Ext.Action <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Action>`_
 */
 
/** api: example
 *  Sample code to create a permalink (see also :ref:`permalink`):
 *
 *  .. code-block:: javascript
 *
 *     var mapPanel = new GeoAdmin.MapPanel({
 *         renderTo: "map",
 *         width: 600,
 *         height: 400,
 *         map: new GeoAdmin.Map(),
 *         stateId: "map",
 *         tbar: ["->", new GeoAdmin.Permalink()]
 *     });
 *
 */

/** api: constructor
 *  .. class:: Permalink(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.Permalink``
 *
 *  Create a permalink
 */
 
GeoAdmin.Permalink = Ext.extend(Ext.Action, {

    /**
     */
    constructor : function(config) {

        var permalinkWindow = new GeoAdmin.PermalinkWindow({
            width: 400,
            renderTo: Ext.getBody()
        });

        config = Ext.apply({
            allowDepress: false,
            iconCls: 'permalink',
            text: OpenLayers.i18n('Permalink'),
            handler: function() {
                permalinkWindow.show()
            }
        }, config);

        GeoAdmin.Permalink.superclass.constructor.call(this, config);
    }
});

/** api: xtype = ga_permalink */
Ext.reg("ga_permalink", GeoAdmin.Permalink);
