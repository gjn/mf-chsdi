/*global GeoAdmin:true, OpenLayers: true, Ext:true */


/**
 * @include OpenLayers/Control/ArgParser.js
 * @include OpenLayers/Format/KML.js
 * @include Ext/examples/ux/fileuploadfield/FileUploadField.js
 */

Ext.namespace('GeoAdmin');

GeoAdmin.KmlSelectorPanel = Ext.extend(Ext.Panel, {

    vector: null,

    constructor: function(config) {
        'use strict';
        var configuration;
        var urlField = {
                xtype: 'textfield',
                width: 388,
                fieldLabel: OpenLayers.i18n('URL'),
                name: 'kmlurl',
                id: 'kmlurl',
                allowBlank:false,
                validator: this.urlValidator,
                invalidText: OpenLayers.i18n('The url address entered is not valid.'),
                'emptyText': OpenLayers.i18n('Input the KML address (URL)')
            };
        var loadFromURL = {
                xtype: 'button',
                cls: 'load-button',
                autoWidth: true,
                text: OpenLayers.i18n('Load KML'),
                tooltip: OpenLayers.i18n('KMLTooltip'),
                scope: this,
                handler: function (b, e) {
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
                    if (this.map.addKmlLayer) {
                        this.map.addKmlLayer(url, true, 1, true);
                    }
                    Ext.getCmp('kmlurl').setValue('');
                    this.closeWindow();
                }
            };

        if (window.File && window.FileReader && window.FileList && window.Blob && !Ext.isIE) {
            var fileUpload = new Ext.ux.form.FileUploadField({
                ctCls: 'file-upload',
                vector: this.vector,
                width: 388,
                listeners: {
                    'fileselected': function (fb, v) {
                        if (v.indexOf('.kml') !== -1) {
                            var vector, f, reader, format, features, j;
                            this.vector = new OpenLayers.Layer.Vector('KML Layer');
                            f = fb.fileInput.dom.files[0];
                            reader = new FileReader();
                            reader.readAsText(f);
                            vector = this.vector;
                            reader.onloadend = function (evt) {
                                if (evt.target.readyState === FileReader.DONE) {
                                    format = new OpenLayers.Format.KML();
                                    features = format.read(reader.result);
                                    for (var j=0; j < features.length; j+=1) {
                                        features[j].geometry.transform('EPSG:4326','EPSG:21781');
                                    }
                                    vector.addFeatures(features);
                                }
                            };
                        } else {
                            alert(OpenLayers.i18n('The file you are trying to load is not a KML file'));
                        }
                    }
                },
                emptyText: OpenLayers.i18n('Select a KML file'),
                name: 'kmllocal',
                id: 'kmllocal'
            });
            var localLoadButton = {
                xtype: 'button',
                cls: 'load-button',
                text: OpenLayers.i18n('Load KML'),
                tooltip: OpenLayers.i18n('KMLTooltip'),
                scope: this,
                handler: function (b, e) {
                    var vector = fileUpload.vector;
                    if (vector !== null) {
                        this.map.addLayer(vector);
                    }
                }
            };
            configuration = [{
                xtype: 'tabpanel',
                activeTab: 0,
                items: [{
                    title: OpenLayers.i18n('Local'),
                    items: [fileUpload, localLoadButton]
                },
                {
                    title: OpenLayers.i18n('URL'),
                    items: [urlField , loadFromURL]
                }]
            }];

        } else {
            configuration = [urlField, loadFromURL];
        }

        var kmlSelectorPanel = new Ext.FormPanel({
            scope: this,
            labelWidth: 75,
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            width: 412,
            defaults: {width: 390},
            defaultType: 'textfield',
            items: configuration
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
        'use strict';
        return Ext.form.VTypes.url(url);
    },
    closeWindow: function() {
        'use strict';
        this.ownerCt.hide();
    }
});

