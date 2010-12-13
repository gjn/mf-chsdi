/** api: (define)
 *  module = GeoAdmin
 *  class = PermalinkWindow
 *  base_link = `Ext.Window <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Window>`_
 */

/** api: example
 *  Sample code to create a permalink window (see also :ref:`permalink`):
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
 *  .. class:: PermalinkWindow(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.PermalinkWindow``
 *
 *  Create a permalink window
 */

GeoAdmin.PermalinkWindow = Ext.extend(Ext.Window, {

    initComponent: function() {

        this.layout = 'fit';
        this.title = OpenLayers.i18n('Permalink.title');
        this.closeAction = 'hide';

        var permalinkField = new GeoAdmin.PermalinkField({hideLabel: true});
        this.items = permalinkField;

        this.buttons = [{
            text: OpenLayers.i18n('Permalink.openlink'),
            handler: function() {
                window.open(permalinkField.getValue());
                this.hide();
            },
            scope: this
        }, {
            text: OpenLayers.i18n('Permalink.close'),
            handler: function() {
                this.hide();
            },
            scope: this
        }];

        GeoAdmin.PermalinkWindow.superclass.initComponent.apply(
                this, arguments);
    }
});

/** api: xtype = ga_permalinkwindow */
Ext.reg("ga_permalinkwindow", GeoAdmin.PermalinkWindow);