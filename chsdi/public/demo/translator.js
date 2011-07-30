Ext.onReady(function () {
    var available_langs = ['de', 'fr', 'en', 'it', 'rm'];

    function getData() {
        var data = [];
        var keys = {};

        for (var j in available_langs) {
            var lang = available_langs[j];
            var dico = OpenLayers.Lang[lang];
            for (var i in dico) {
                if (!(i in keys)) {
                    keys[i] = 1;
                    var tr = [i];
                    for (var j in available_langs) {
                        var lang = available_langs[j];

                        var dico = OpenLayers.Lang[lang];
                        if (dico != undefined) {
                            tr.push(dico[i]);
                        }
                    }
                    data.push(tr);
                }
            }
        }
        return data;
    }


    var store = new Ext.data.ArrayStore({
        // store configs
        data: getData(),
        autoDestroy: true,
        storeId: 'myStore',
        // reader configs
        idIndex: 0,
        fields: ['msgid', 'de', 'fr', 'en', 'it', 'rm']
    });

    var grid = new Ext.grid.GridPanel({
        store: store,
        renderTo: 'grid',
        colModel: new Ext.grid.ColumnModel({
            defaults: {
                width: 200,
                sortable: true
            },
            columns: [
                {
                    id: 'msgid',
                    header: 'Msgids',
                    width: 200,
                    sortable: true,
                    dataIndex: 'msgid'
                },
                {
                    header: 'English',
                    dataIndex: 'en'
                },
                {
                    header: 'Deutsch',
                    dataIndex: 'de'
                },
                {
                    header: 'Français',
                    dataIndex: 'fr'
                },
                {
                    header: 'Italiano',
                    dataIndex: 'it'
                },
                {
                    header: 'Rumantsch grischun',
                    dataIndex: 'rm'
                },
                {
                    header: 'Sursilvan',
                    width: 100
                },
                {
                    header: 'Sutsilvan',
                    width: 100
                },
                {
                    header: 'Surmiran',
                    width: 100
                },
                {
                    header: 'Puter',
                    width: 100
                },
                {
                    header: 'Vallader',
                    width: 100
                }
            ]
        }),
        viewConfig: {
            forceFit: true,
            getRowClass: function (record, index) {
                for (var lng in available_langs) {
                    var lang = available_langs[lng];
                    var c = record.get(lang);
                    if (c == '') {
                        return 'red-row';
                    }
                }
                return 'green-row';
            }
        },
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        width: 'auto',
        height: 400,
        frame: true,
        title: 'Translator Supervisor',
        iconCls: 'icon-grid'
    });


});
