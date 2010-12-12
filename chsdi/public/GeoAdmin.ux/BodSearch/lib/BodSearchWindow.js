/*
 * @include Ext/src/ext-core/examples/jsonp/jsonp.js
 */

/** api: (define)
 *  module =  GeoAdmin
 *  class = BodSearchWindow
 */

/** api: example
 *  Sample code to create a bod search window (see also `demo <http://api.geo.admin.ch/main/wsgi/doc/build/widgets/sdiwidgetsexamples3.html#>`_)
 *
 *  .. code-block:: javascript
 *
 *     GeoAdmin.BodSearchWindow.show('ch.swisstopo.fixpunkte-agnes');
 *
 *  Show a layer metadata window
 */

GeoAdmin.BodSearchWindow = {

   /** api: method[show]
    *  :param id: ``String``: the layer id. The layer list can be found `here <http://api.geo.admin.ch/main/wsgi/doc/build/api/faq/index.html#which-layers-are-available>`_
    *
    *  Show a layer metadata window
    */
    show: function(id) {

        var _window = new Ext.Window({
            layout: 'anchor',
            title: OpenLayers.i18n('infobox'),
            resizable: true,
            autoScroll: true,
            border: false,
            width: 525,
            bodyStyle: "max-height: 500px",
            items: {html: ''},
            toolTemplate: new Ext.XTemplate(
                '<tpl if="id==\'print\'">',
                '<div class="x-window-printtool">'+OpenLayers.i18n('print')+'</div>',
                '</tpl>',
                '<tpl if="id!=\'print\'">',
                '<div class="x-tool x-tool-{id}">&#160;</div>',
                '</tpl>'
            ),
            tools: [{
                id: 'print',
                handler: function(evt, toolEl, panel, tc) {
                    // remove the callbackKey introduced by
                    // Ext.ux.JSONP.request and add the print key.
                    delete panel._params['cb'];
                    panel._params['print'] = true;
                    var url = Ext.urlAppend(panel._url, Ext.urlEncode(panel._params));
                    window.open(url, '', 'width=500, height=400, toolbar=no, location=no,' +
                                         'directories=no, status=no, menubar=no, scrollbars=yes,' +
                                         'copyhistory=no, resizable=no');
                }
            }]
        });
        
        _window._url = GeoAdmin.webServicesUrl + '/bodsearch/details/' + id;

        _window._params = {
            lang: OpenLayers.Lang.getCode(),
            h: GeoAdmin.webServicesUrl
        };

        Ext.ux.JSONP.request(_window._url, {
            callbackKey: "cb",
            params: _window._params,
            scope: _window,
            callback: function(response) {
                this.removeAll();
                this.add({
                    html: response,
                    cls: 'bodsearch'
                });
                this.doLayout();
                this.show();
            }
        });
    }
};
