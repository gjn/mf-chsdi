Ext.namespace('GeoAdmin');

GeoAdmin.BodDetailPanel = Ext.extend(Ext.Panel, {
// GeoAdmin.BodDetailPanel = Ext.extend(Ext.Panel, {

    /**
     */
    templateMarkup: [
        'tech_layer_name: {tech_layer_name}<br/>',
        'abstract: {abstract}<br/>',
        'datenstand: {datenstand}<br/>',
        'url_portale: {url_portale}<br/>',
        'geobasisdaten_num: {geobasisdaten_num}<br/>',
        'wms_url: {wms_url}<br/>',
        'geoadmin_inspire_group: {geoadmin_inspire_group}<br/>',
        'georeferenzdaten_bool: {georeferenzdaten_bool}<br/>',
        'url_download: {url_download}<br/>',
        'geocat: {geocat}<br/>',
        'geobasisdaten_tech_number: {geobasisdaten_tech_number}<br/>',
        'rechtsgrundlage: {rechtsgrundlage}<br/>',
        'datenherr: {datenherr}<br/>',
        'geoadmin_inspire_theme: {geoadmin_inspire_theme}<br/>',
        'projekte: {projekte}<br/>',
        'bezeichnung_geobasisdaten_katalog: {bezeichnung_geobasisdaten_katalog}<br/>',
        'zustaendig: {zustaendig}<br/>',
        'inspire_num: {inspire_num}<br/>',
        'inspire_name_public: {inspire_name_public}<br/>',
        'oereb_bool: {oereb_bool}<br/>',
        'geobasisdaten_sammlung_bundesrecht_bezeichnung: {geobasisdaten_sammlung_bundesrecht_bezeichnung}<br/>',
        'geoadmin_kurz_bez: {geoadmin_kurz_bez}<br/>',
        'geoadmin_bezeichnung: {geoadmin_bezeichnung}<br/>'
    ],




    constructor : function(config) {



        config = Ext.apply({
            id: 'detailPanel',
            region: 'center',
            bodyStyle: {
                background: '#ffffff',
                padding: '7px'
            },
            tmpl: new Ext.Template(this.templateMarkup),
            html: 'Please select a layer to see additional details.',
            scroll: new Ext.layout.boxOverflow.VerticalScroller()

        }, config);

        var bodGrid = Ext.getCmp('bodGrid');
        bodGrid.getSelectionModel().on('rowselect', function(sm, rowIdx, r) {
        var detailPanel = Ext.getCmp('detailPanel');
        detailPanel.tmpl.overwrite(detailPanel.body, r.data);
            });

        GeoAdmin.BodDetailPanel.superclass.constructor.call(this, config);



    }
});

/** api: xtype = ga_bodpanel */
Ext.reg("ga_boddetailpanel", GeoAdmin.BodDetailPanel);
