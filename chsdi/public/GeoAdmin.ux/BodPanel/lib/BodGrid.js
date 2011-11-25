/**
 * @include BodPanel/lib/BodGrid_Grid.js
 * @requires Permalink/lib/PermalinkProvider.js
 */

Ext.namespace('GeoAdmin');

GeoAdmin.BodGrid = Ext.extend(Ext.grid.GridPanel, {

    /**
     */



    constructor : function(config) {

        var encode = false; //filter query encoded by default?
        var local = true;   //filter performed locally by default?

        var bodStore = new Ext.data.JsonStore({
            proxy: new Ext.data.ScriptTagProxy({
                //url: 'http://api.geo.admin.ch/main/wsgi/cmslayer?',
                url: '../../../bodgrid?',
                callbackParam: 'callback',
                method: 'GET',
                nocache: false,
                autoAbort: true
            }),
            root: 'results',
            fields: ['tech_layer_name', 'abstract', 'datenstand', 'url_portale', 'geobasisdaten_num', 'wms_url', 'geoadmin_inspire_group', 'georeferenzdaten_bool', 'url_download', 'geocat', 'geobasisdaten_tech_number', 'rechtsgrundlage', 'datenherr', 'geoadmin_inspire_theme', 'projekte', 'bezeichnung_geobasisdaten_katalog', 'zustaendig', 'inspire_num', 'inspire_name_public', 'oereb_bool', 'geobasisdaten_sammlung_bundesrecht_bezeichnung', 'geoadmin_kurz_bez', 'geoadmin_bezeichnung']
            //fields: ['geobasisdaten_katalog_zugang', 'bod_layer_id', 'inspire_id', 'abstract', 'datenstand', 'url_portale', 'url_grodatenmodell', 'geobasisdatensatz_zustaendig', 'geocat_uuid', 'geobasisdatensatz_name', 'url_download', 'inspire_oberthema_abstract', 'geobasisdaten_katalog_rechtsgrundlage', 'inspire_abstract', 'inspire_name', 'datenherr', 'kurzbeschreibung', 'geobasisdaten_katalog_oereb', 'geobasisdaten_katalog_georeferenzdaten', 'inspire_id_annex', 'url', 'inspire_id_num', 'inspire_oberthema_name', 'bezeichnung', 'wms_resource']
        });

        bodStore.load();


        //FIXME: test with column width. Code from: http://www.sencha.com/forum/showthread.php?82965-Dblclick-to-autosize-grid-columns
        var cursorRe = /^(?:col|e|w)-resize$/;
        Ext.ux.grid.AutoSizeColumns = Ext.extend(Object, {
            cellPadding: 8,
            constructor: function (config) {
                Ext.apply(this, config);
            },
            init: function (grid) {
                var view = grid.getView();
                view.onHeaderClick = view.onHeaderClick.createInterceptor(this.onHeaderClick);
                grid.on('headerdblclick', this.onHeaderDblClick.createDelegate(view, [this.cellPadding], 3));
            },
            onHeaderClick: function (grid, colIndex) {
                var el = this.getHeaderCell(colIndex);
                if (cursorRe.test(el.style.cursor)) {
                    return false;
                }
            },
            onHeaderDblClick: function (grid, colIndex, e, cellPadding) {
                var el = this.getHeaderCell(colIndex), width, rowIndex, count;
                if (!cursorRe.test(el.style.cursor)) {
                    return;
                }
                if (e.getXY()[0] - Ext.lib.Dom.getXY(el)[0] <= 5) {
                    colIndex--;
                    el = this.getHeaderCell(colIndex);
                }
                if (this.cm.isFixed(colIndex) || this.cm.isHidden(colIndex)) {
                    return;
                }
                el = el.firstChild;
                el.style.width = '0px';
                width = el.scrollWidth;
                el.style.width = 'auto';
                for (rowIndex = 0,count = this.ds.getCount(); rowIndex < count; rowIndex++) {
                    el = this.getCell(rowIndex, colIndex).firstChild;
                    el.style.width = '0px';
                    width = Math.max(width, el.scrollWidth);
                    el.style.width = 'auto';
                }
                this.onColumnSplitterMoved(colIndex, width + cellPadding);
            }
        });
        Ext.preg('autosizecolumns', Ext.ux.grid.AutoSizeColumns);
        //FIXME: end

        var filters = new Ext.ux.grid.GridFilters({
            encode: encode, //json encode the filter query
            local: local, //default to 'true' (local filtering)
            filters: [
                {
                    type: 'string',
                    dataIndex: 'tech_layer_name',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'abstract',
                    disabled: false
                },
                {
                    type: 'numeric',
                    dataIndex: 'datenstand',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'url_portale',
                    disabled: false
                },
                {
                    type: 'numeric',
                    dataIndex: 'geobasisdaten_num',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'wms_url',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'geoadmin_inspire_group',
                    disabled: false
                },
                {
                    type: 'boolean',
                    dataIndex: 'georeferenzdaten_bool',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'url_download',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'geocat',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'geobasisdaten_tech_number',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'rechtsgrundlage',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'datenherr',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'geoadmin_inspire_theme',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'projekte',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'bezeichnung_geobasisdaten_katalog',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'zustaendig',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'inspire_num',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'inspire_name_public',
                    disabled: false
                },
                {
                    type: 'boolean',
                    dataIndex: 'oereb_bool',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'geobasisdaten_sammlung_bundesrecht_bezeichnung',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'geoadmin_kurz_bez',
                    disabled: false
                },
                {
                    type: 'string',
                    dataIndex: 'geoadmin_bezeichnung',
                    disabled: false
                }
            ]
        });

        var reorderer = new Ext.ux.ToolbarReorderer();
        var droppable = new Ext.ux.ToolbarDroppable({
            createItem: function(sampleData) {
                var column = this.getColumnFromDragDrop(sampleData);

                return createSorterButton({
                    text: column.header,
                    sortData: {
                        field: column.dataIndex,
                        direction: "ASC"
                    }
                });
            },
            canDrop: function(dragSource, event, sampleData) {
                var sorters = getSorters(),
                    column = this.getColumnFromDragDrop(sampleData);
                for (var i = 0; i < sorters.length; i++) {
                    if (sorters[i].field == column.dataIndex) return false;
                }

                return true

            },
            afterLayout: doSort,

            getColumnFromDragDrop: function(sampleData) {

                var index = sampleData.header.cellIndex,
                    colModel = bodGridColModel,
                    column = bodGridColModel.getColumnById(bodGridColModel.getColumnId(index));
                return column;
            }
        });

        var bodGridColModel = new Ext.ux.grid.LockingColumnModel([
            {
                dataIndex: 'tech_layer_name',
                id: 'tech_layer_name',
                header: 'tech_layer_name',
                sortable: true,
                filterable: true,
                //hidden: true,
                width: 150
            },
            {
                dataIndex: 'abstract',
                id: 'abstract',
                header: 'abstract',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'datenstand',
                id: 'datenstand',
                header: 'datenstand',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'url_portale',
                id: 'url_portale',
                header: 'url_portale',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'geobasisdaten_num',
                id: 'geobasisdaten_num',
                header: 'geobasisdaten_num',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'wms_url',
                id: 'wms_url',
                header: 'wms_url',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'geoadmin_inspire_group',
                id: 'geoadmin_inspire_group',
                header: 'geoadmin_inspire_group',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'georeferenzdaten_bool',
                id: 'georeferenzdaten_bool',
                header: 'georeferenzdaten_bool',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'url_download',
                id: 'url_download',
                header: 'url_download',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'geocat',
                id: 'geocat',
                header: 'geocat',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'geobasisdaten_tech_number',
                id: 'geobasisdaten_tech_number',
                header: 'geobasisdaten_tech_number',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'rechtsgrundlage',
                id: 'rechtsgrundlage',
                header: 'rechtsgrundlage',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'datenherr',
                id: 'datenherr',
                header: 'datenherr',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'geoadmin_inspire_theme',
                id: 'geoadmin_inspire_theme',
                header: 'geoadmin_inspire_theme',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'projekte',
                id: 'projekte',
                header: 'projekte',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'bezeichnung_geobasisdaten_katalog',
                id: 'bezeichnung_geobasisdaten_katalog',
                header: 'bezeichnung_geobasisdaten_katalog',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'zustaendig',
                id: 'zustaendig',
                header: 'zustaendig',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'inspire_num',
                id: 'inspire_num',
                header: 'inspire_num',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'inspire_name_public',
                id: 'inspire_name_public',
                header: 'inspire_name_public',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'oereb_bool',
                id: 'oereb_bool',
                header: 'oereb_bool',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'geobasisdaten_sammlung_bundesrecht_bezeichnung',
                id: 'geobasisdaten_sammlung_bundesrecht_bezeichnung',
                header: 'geobasisdaten_sammlung_bundesrecht_bezeichnung',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'geoadmin_kurz_bez',
                id: 'geoadmin_kurz_bez',
                header: 'geoadmin_kurz_bez',
                sortable: true,
                filterable: true,
                width: 150
            },
            {
                dataIndex: 'geoadmin_bezeichnung',
                id: 'geoadmin_bezeichnung',
                header: 'geoadmin_bezeichnung',
                sortable: true,
                filterable: true,
                width: 150
            }
        ]);

        var lockingView = new Ext.ux.grid.LockingGridView();

        var bodLoadMask = new Ext.LoadMask(Ext.getBody(), {msg:"Loading data..."});
        bodLoadMask.show();

        var tbar = new Ext.Toolbar({
            items: ['Sorting order:', '-'],
            plugins: [reorderer, droppable],
            listeners: {
                scope: this,
                reordered: function(button) {
                    changeSortDirection(button, false);
                }
            }
        });


        config = Ext.apply({
            id: 'bodGrid',
            tbar: tbar,
            border: false,
            store: bodStore,
            colModel: bodGridColModel,
            plugins: [filters, 'autosizecolumns'],
            stripeRows: true,
            sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
            view: lockingView,
            height: 200,
            split: true,
            region: 'north',
            loadMask: bodLoadMask,
            listeners: {
                scope: this,
                render: function() {
                    var dragProxy = this.getView().columnDrag,
                        ddGroup = dragProxy.ddGroup;
                    droppable.addDDGroup(ddGroup);
                }
            }


        }, config);

        function doSort() {
            bodStore.sort(getSorters(), "ASC");
        }

        function changeSortDirection(button, changeDirection) {
            var sortData = button.sortData,
                iconCls = button.iconCls;

            if (sortData != undefined) {
                if (changeDirection !== false) {
                    button.sortData.direction = button.sortData.direction.toggle("ASC", "DESC");
                    button.setIconClass(iconCls.toggle("sort-asc", "sort-desc"));
                }
                bodStore.clearFilter();
                doSort();
            }
        }

        function getSorters() {
            var sorters = [];
            Ext.each(tbar.findByType('button'), function(button) {
                sorters.push(button.sortData);
            }, this);
            return sorters;
        }

        function createSorterButton(config) {
            config = config || {};

            Ext.applyIf(config, {
                listeners: {
                    click: function(button, e) {
                        changeSortDirection(button, true);
                    }
                },
                iconCls: 'sort-' + config.sortData.direction.toLowerCase(),
                reorderable: true
            });
            return new Ext.Button(config);
        }

        GeoAdmin.BodGrid.superclass.constructor.call(this, config);
    }



});

/** api: xtype = ga_bodgrid */
Ext.reg("ga_bodgrid", GeoAdmin.BodGrid);
