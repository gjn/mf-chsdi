/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/*
 * @include OpenLayers/Lang.js
 */
/** api: (define)
 *  module = GeoAdmin
 *  class = GeoCatSearch
 *  base_link = `Ext.Container <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Container>`_
 */

/** api: example
 *  Sample code for geocat search combo
 *
 *  .. code-block:: javascript

 *     var geocatsearch = new GeoAdmin.GeoCatSearch({
 *         width: 500,
 *         renderTo: "mysearch4"
 *        });
 *
 *
 */

/** api: constructor
 *  .. class:: GeoCatSearch(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.GeoCatSearch``
 *
 *  Create a geocat search combo box
 */
GeoAdmin.GeoCatSearch = Ext.extend(Ext.Container, {


    /** private: property[store]
     *  ``Ext.data.JsonStore``
     */
    store: null,

    /** private: property[searchResultsWindow]
     *  ``Ext.Window`` The search results window.
     */
    searchResultsWindow: null,

    initComponent: function() {
        this.layout = 'hbox';

        if (!this.url && GeoAdmin.webServicesUrl !== null) {
            this.url = GeoAdmin.webServicesUrl + "/geocatsearch";
        }
        this.store = new Ext.data.JsonStore({
            proxy: new Ext.data.ScriptTagProxy({
                url: this.url,
                method: 'GET',
                callbackParam: 'cb',
                nocache: false,
                autoAbort: true
            }),
            baseParams: {
                lang: OpenLayers.Lang.getCode()
            },
            root: 'results',
            fields: ['uuid', 'name', 'layers', 'abstract', 'url', 'layertype']
        });
        var view = new Ext.DataView({
            store: this.store,
            itemSelector:'div.x-results-view-item',
            overClass:'x-view-over',
            autoScroll: true,
            tpl: new Ext.XTemplate(
                '<tpl for="."><div class="x-results-view-item">',
                '<p><b>{name}</b></p>',
                '<p class="abstract">{abstract:ellipsis(150)}</p>',
                '<a href="javascript:void(0);" class="addmetadata"></a>',
                '<a href="javascript:void(0);" class="metadata"></a>',
                '</div></tpl>').compile()
        });
        view.on('click', this.onViewClick, this);
        this.searchResultsWindow = new Ext.Window({
            layout: 'fit',
            cls: 'geocatsearch-results',
            items: view,
            width: 350,
            height: 300,
            closeAction: 'hide'
        });

        var searchField = new Ext.form.TextField({
            flex: 1,
            listeners: {
                specialkey: function(field, e){
                    if (e.getKey() == e.ENTER) {
                        this.searchGeoCat(searchField.getValue());
                    }
                },
                scope: this
            }
        });
        var button = new Ext.Button({
            text: OpenLayers.i18n('geocatsearch.search'),
            handler: function() {
                this.searchGeoCat(searchField.getValue());
            },
            scope: this
        });

        this.items = [searchField, button];

        GeoAdmin.GeoCatSearch.superclass.initComponent.call(this);

        this.addEvents(
            /**
             * @event add
             * Fires when the user clicks on the "+" button in a search result item. 
             * @param {Object} the metadata parameters 
             */
            'addmetadata' 
        );
    },

    /** private: method[searchGeoCat]
     *  :param keyword: ``String`` The text the user is searching for. 
     *
     *  Calls the GeoCat searching service.
     */
    searchGeoCat: function(keyword) {
        this.searchResultsWindow.show();
        this.store.load({
            params: {
                q: keyword
            },
            callback: function(r, options, success) {
            }
        });
    },

    /** private: method[onViewClick]
     *  :param dataview: ``Ext.DataView`` The view 
     *  :param index: ``Integer``
     *  :param node: ``Ext.tree.TreeNode``
     *  :param e: ``Ext.Event``
     *
     *  Called a result is clicked.
     */
    onViewClick: function(dataview, index, node, e) {
        var t = e.getTarget('.metadata');
        var r = dataview.getRecord(node);
        if(t) {
            this.showMetadataPopup(r.get('uuid'));
        }

        t = e.getTarget('.addmetadata');
        if(t) {
            this.fireEvent('addmetadata', r.data);
        }
    },

    /** private: method[showMetadataPopup]
     *  :param uuid: ``String`` The metadata uuid 
     *
     *  Opens a window to show the metadata. 
     */
    showMetadataPopup: function(uuid) {
        new Ext.Window({
            title: OpenLayers.i18n('geocatsearch.metadata'),
            layout: 'fit',
            maximizable: false,
            modal: true,
            width: 1055,
            height: 500,
            items: {
                xtype: 'box',
                autoEl: {
                    tag: 'iframe',
                    src: "http://www.geocat.ch/geonetwork/srv/fra/metadata.show?uuid=" + uuid + "&printview",
                    align: 'left',
                    scrolling: 'auto',
                    marginheight: 0,
                    marginwidth: 0,
                    frameborder: 0
                }
            }
        }).show();
    }
});

/** api: xtype = ga_geocatsearch */
Ext.reg("ga_geocatsearch", GeoAdmin.GeoCatSearch);
