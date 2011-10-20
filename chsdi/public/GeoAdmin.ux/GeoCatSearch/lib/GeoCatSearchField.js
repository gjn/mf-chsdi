/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/*
 * @include OpenLayers/Lang.js
 * @include GeoCatSearch/lib/showGeoCatMetadataPopup.js
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

 *     var geocatsearch = new GeoAdmin.GeoCatSearchField({
 *         width: 500,
 *         renderTo: "mysearch4"
 *        });
 *
 *
 */

/** api: constructor
 *  .. class:: GeoCatSearchField(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.GeoCatSearchField``
 *
 *  Create a geocat search field, and the conresponding results window.
 */
GeoAdmin.GeoCatSearchField = Ext.extend(Ext.Container, {


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
            fields: ['id', 'name', 'layers', 'abstract', 'url', 'layertype']
        });
        var view = new Ext.DataView({
            store: this.store,
            itemSelector:'div.x-results-view-item',
            overClass:'x-view-over',
            autoScroll: true,
            loadingText: OpenLayers.i18n('geocatsearch.loading'),
            emptyText: OpenLayers.i18n('geocatsearch.noresult'),
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

        GeoAdmin.GeoCatSearchField.superclass.initComponent.call(this);

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
            GeoAdmin.showGeoCatMetadataPopup(r.get('id'));
        }

        t = e.getTarget('.addmetadata');
        if(t) {
            this.fireEvent('addmetadata', r.data);
        }
    },

});

/** api: xtype = ga_geocatsearch */
Ext.reg("ga_geocatsearchfield", GeoAdmin.GeoCatSearchField);
