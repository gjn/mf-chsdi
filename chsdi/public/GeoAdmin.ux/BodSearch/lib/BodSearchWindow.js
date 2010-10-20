/*
 * @include Ext/src/ext-core/examples/jsonp/jsonp.js
 */

GeoAdmin.BodSearchWindow = {

    show: function(id) {
        var _window = new Ext.Window({
            layout: 'anchor',
            title: OpenLayers.i18n('infobox'),
            resizable: true,
            autoScroll: true,
            width: 525,
            bodyStyle: "max-height: 500px",
            items: {html: ''}
        });

        _window._url = GeoAdmin.webServicesUrl + '/bodsearch/details/' + id;

        Ext.ux.JSONP.request(_window._url, {
            callbackKey: "cb",
            params: {
                lang: OpenLayers.Lang.getCode(),
                h: GeoAdmin.webServicesUrl
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
