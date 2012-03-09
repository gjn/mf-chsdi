/*global GeoAdmin:true, OpenLayers: true, Ext:true */


/**
 * @include OpenLayers/Lang.js
 */

Ext.namespace('GeoAdmin');


GeoAdmin.BodDetailPanel = Ext.extend(Ext.Panel, {


    constructor : function(config) {


        config = Ext.apply({

            id: 'detailPanel',
            region: 'center',
            bodyStyle: {
                background: '#ffffff',
                padding: '7px'
            },
            tmpl: new Ext.Template([
                OpenLayers.i18n('tech_layer_name:') + ' {tech_layer_name}<br/>',
                OpenLayers.i18n('abstract:') + ' {abstract}<br/>',
                OpenLayers.i18n('datenstand:') + ' {datenstand}<br/>',
                OpenLayers.i18n('url_portale:') + ' {url_portale}<br/>',
                OpenLayers.i18n('geobasisdaten_num:') + ' {geobasisdaten_num}<br/>',
                OpenLayers.i18n('wms_url:') + ' {wms_url}<br/>',
                OpenLayers.i18n('geoadmin_inspire_group:') + ' {geoadmin_inspire_group}<br/>',
                OpenLayers.i18n('georeferenzdaten_bool:') + ' {georeferenzdaten_bool}<br/>',
                OpenLayers.i18n('url_download:') + ' {url_download}<br/>',
                OpenLayers.i18n('geocat:') + ' {geocat}<br/>',
                OpenLayers.i18n('geobasisdaten_tech_number:') + ' {geobasisdaten_tech_number}<br/>',
                OpenLayers.i18n('rechtsgrundlage:') + ' {rechtsgrundlage}<br/>',
                OpenLayers.i18n('geoadmin_inspire_theme:') + ' {geoadmin_inspire_theme}<br/>',
                OpenLayers.i18n('projekte:') + ' {projekte}<br/>',
                OpenLayers.i18n('bezeichnung_geobasisdaten_katalog:') + ' {bezeichnung_geobasisdaten_katalog}<br/>',
                OpenLayers.i18n('zustaendige_stelle:') + ' {zustaendige_stelle}<br/>',
                OpenLayers.i18n('fachstelle_bund:') + ' {fachstelle_bund}<br/>',
                OpenLayers.i18n('inspire_num:') + ' {inspire_num}<br/>',
                OpenLayers.i18n('inspire_name_public:') + ' {inspire_name_public}<br/>',
                OpenLayers.i18n('oereb_bool:') + ' {oereb_bool}<br/>',
                OpenLayers.i18n('download_bool:') + ' {download_bool}<br/>',
                OpenLayers.i18n('geobasisdaten_sammlung_bundesrecht_bezeichnung:') + ' {geobasisdaten_sammlung_bundesrecht_bezeichnung}<br/>',
                OpenLayers.i18n('geoadmin_kurz_bez:') + ' {geoadmin_kurz_bez}<br/>',
                OpenLayers.i18n('geoadmin_bezeichnung:') + ' {geoadmin_bezeichnung}<br/>',
                OpenLayers.i18n('zugang:') + ' {zugang}<br/>',
                OpenLayers.i18n('ausser_kraft_bool:') + ' {ausser_kraft_bool}<br/>',
                OpenLayers.i18n('minimalmodell:') + ' {minimalmodell}<br/>',
                OpenLayers.i18n('ansprechperson:') + ' {ansprechperson}<br/>'
            ]),
            html: OpenLayers.i18n('plselectadd'),
            autoScroll: true

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

