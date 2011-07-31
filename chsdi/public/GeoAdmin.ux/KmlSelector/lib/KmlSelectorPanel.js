/*global GeoAdmin:true, OpenLayers: true, Ext:true */


/**
 * @include OpenLayers/Control/ArgParser.js
 * @include OpenLayers/Format/KML.js
 */

Ext.namespace("GeoAdmin");

GeoAdmin.KmlSelectorPanel = Ext.extend(Ext.Panel, {

    constructor: function(config) {

        OpenLayers.Format.KML.prototype.parseData = function(data, options) {
            if (typeof data == "string") {
                data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
            }

            // Loop throught the following node types in this order and
            // process the nodes found
            var types = ["Document", "Link", "NetworkLink", "Style", "StyleMap", "Placemark"];
            for (var i = 0, len = types.length; i < len; ++i) {
                var type = types[i];

                var nodes = this.getElementsByTagNameNS(data, "*", type);

                // skip to next type if no nodes are found
                if (nodes.length == 0) {
                    continue;
                }

                switch (type.toLowerCase()) {

                    // Fetch external links
                    case "link":
                    case "networklink":
                        this.parseLinks(nodes, options);
                        break;

                    // parse style information
                    case "style":
                        if (this.extractStyles) {
                            this.parseStyles(nodes, options);
                        }
                        break;
                    case "stylemap":
                        if (this.extractStyles) {
                            this.parseStyleMaps(nodes, options);
                        }
                        break;

                    // parse features
                    case "placemark":
                        this.parseFeatures(nodes, options);
                        break;

                    case "document":
                        this.documentName = "KML file";
                        this.parseDocument(nodes, options);
                        break;
                }
            }

            return this.features;
        };


        OpenLayers.Format.KML.prototype.parseDocument = function(nodes, options) {
            var name = this.parseProperty(nodes[0], "*", "name");
            if (name) {
               this.documentName = name;
            } else {
                this.documentName = 'KML document';
            }            
        };


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
                    tooltip: OpenLayers.i18n('KMLTooltip'),
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
                        Ext.getCmp('kmlurl').setValue("");
                        this.closeWindow();
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

