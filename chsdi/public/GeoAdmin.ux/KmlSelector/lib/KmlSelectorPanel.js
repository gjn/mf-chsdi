/*global GeoAdmin:true, OpenLayers: true, Ext:true */


/**
 * @include OpenLayers/Control/ArgParser.js
 * @include OpenLayers/Format/KML.js
 */

Ext.namespace("GeoAdmin");

GeoAdmin.KmlSelectorPanel = Ext.extend(Ext.Panel, {

    constructor: function(config) {

        var kmlSelectorPanel = new Ext.FormPanel({
            labelWidth: 75,
            frame:true,
            bodyStyle:'padding:5px 5px 0',
            width: 500,
            defaults: {width: 390},
            defaultType: 'textfield',

            items: [
                {
                    fieldLabel: OpenLayers.i18n('KML URL'),
                    name: 'kmlurl',
                    id: 'kmlurl',
                    allowBlank:false,
                    validator: this.urlValidator,
                    invalidText: OpenLayers.i18n('The url address entered is not valid.'),
                    'emptyText': OpenLayers.i18n('Input the KML address (URL)')

                }
            ],

            buttons: [
                {
                    text: OpenLayers.i18n('Load KML'),
                    tooltip: OpenLayers.i18n('Only KML (no KMZ) are supported. KML bigger than 1 MB have performance issues.'),
                    scope: this,
                    handler: function(b, e) {
                        var urlField = Ext.getCmp('kmlurl');
                        var url = urlField.getValue();
                        if (!urlField.isValid()) {
                            if (!url) {
                                alert(OpenLayers.i18n('Please, enter an url in the textbox first'));
                                return;
                            } else if (!this.allowInvalidUrl) {
                                alert(OpenLayers.i18n('The url address entered is not valid.'));
                                return;
                            }
                        }
                        // Add KML layer
                        if (this.map.addKmlLayer) {
                            this.map.addKmlLayer(url, true, 1);
                        }
                    }
                },
                {
                    text: OpenLayers.i18n('Close'),
                    handler: this.closeWindow,
                    scope: this,
                    tooltip: OpenLayers.i18n('Close this window')
                }
            ]
        });


        config = Ext.apply({
            layout: 'hbox',
            cls: 'kmlselector',
            height: 150,
            border: false,
            items: [
                kmlSelectorPanel
            ]
        }, config);

        GeoAdmin.KmlSelectorPanel.superclass.constructor.call(this, config);
    },
    urlValidator: function(url) {
        return Ext.form.VTypes.url(url);
    },
    closeWindow: function() {
        this.ownerCt.hide();
    }
});

