/*
 * @include Ext/src/ext-core/examples/jsonp/jsonp.js
 */

GeoAdmin.BodSearchWindow = {

    show: function(id) {
        var _window = new Ext.Window({
            layout: 'anchor',
//            closeAction: 'hide',
            resizable: true,
            autoScroll: true,
            width: 525,
            items: {html: ''}
        });

        _window._url = GeoAdmin.webServicesUrl + '/bodsearch/details/' + id;

        Ext.ux.JSONP.request(_window._url, {
            callbackKey: "cb",
            params: {
                lang: OpenLayers.Lang.getCode()
            },
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
