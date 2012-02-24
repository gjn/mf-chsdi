
Ext.namespace("GeoAdmin");


GeoAdmin.Tooltip.prototype.onSelect = function(evt) {
        this.layer.addFeatures(evt.features);

        /*this.popup = new GeoExt.Popup({
            cls: 'feature-popup',
            width: 450,
            title: OpenLayers.i18n('Feature tooltip'),
            toolTemplate: new Ext.XTemplate(
                '<tpl if="id==\'print\'">',
                '<div class="x-window-printtool">'+OpenLayers.i18n('print')+'</div>',
                '</tpl>',
                '<tpl if="id!=\'print\'">',
                '<div class="x-tool x-tool-{id}">&#160;</div>',
                '</tpl>'
            ),
            tools:[{
                id: 'print',
                scope: this,
                handler: function(evt, toolEl, panel, tc) {
                    delete this.params['cb'];
                    this.params['print'] = true;
                    var url = Ext.urlAppend(this.url, Ext.urlEncode(this.params));
                    window.open(url, '', 'width=500, height=400, toolbar=no, location=no,' +
                                         'directories=no, status=no, menubar=no, scrollbars=yes,' +
                                         'copyhistory=no, resizable=no');

                }
            }],
            autoScroll: true,
            panIn: true,
            anchored: false,
            draggable: true,
            map: this.map,
            layer: this.layer,
            location: this.lastClick,
            unpinnable: false,
            listeners : {
                close: function(popup) {
                    popup.layer.removeAllFeatures();
                }
            }
        });  */
        var feat = evt.features[0];
        var url = "popups/" + feat.attributes.layer_id + "-" + feat.fid + ".html";
        window.open(url, "popup", "width=400,height=300,location=0,scrollbars=0,menubar=0,status=0,titlebar=0");
        var items = [];
        for (var i = 0, len = evt.features.length; i < len; i++) {
            items.push({
                xtype: "box",
                html: evt.features[i].attributes.html
            });
        }
        //this.popup.add(items);
        //this.popup.show();
    };

GeoAdmin.Print.prototype.initPanel = function() {
        var scope = this;
        this.printLayer = new OpenLayers.Layer.Vector(null, {
            displayInLayerSwitcher: false,
            styleMap: new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    fillColor: "#FF0000",
                    fillOpacity: 0.5,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWidth: 1
                }),
                "temporary": new OpenLayers.Style({
                    cursor: "${role}",
                    //pointRadius: 6,
                    fillColor: "#FFFFFF",
                    fillOpacity: 1.0,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWidth: 2
                }),
                "rotate": new OpenLayers.Style({
                    display: "${getDisplay}",
                    rotation: "${getRotation}",
                    cursor: "pointer",
                    //externalGraphic: OpenLayers.Util.getImagesLocation() + "arrow_rotate_clockwise.png",
                    graphicXOffset: 8,
                    graphicYOffset: 8,
                    graphicWidth: 20,
                    graphicHeight: 20,
                    fillColor: "#555555",
                    fillOpacity: 1.0,
                    strokeColor: "#0000FF",
                    strokeOpacity: 1.0,
                    strokeWidth: 2
                }, {
                    context: {
                        getDisplay: function(f) {
                            return f.attributes.role === "se-rotate" ? "" : "none";
                        },
                        getRotation: function(f) {
                            if (scope && scope.printPanel && scope.printPanel.printExtent && scope.printPanel.printExtent.control.rotation) {
                                return -scope.printPanel.printExtent.control.rotation;
                            } else {
                                return 0;
                            }
                        }
                    }
                })
            })
        });

       var printOptions = Ext.apply({
            printProvider: this.printProvider,
            hideRotation: true,
            autoFit: true,
            border: false,
            labelWidth: 75,
            defaults: {
                width: 200
            },
            labelAlign: 'top',
            buttonAlign: 'right',
            dpiText: OpenLayers.i18n("DPI"),
            layoutText: OpenLayers.i18n("mf.print.layout"),
            scaleText: OpenLayers.i18n("mf.print.scale"),
            rotationText: OpenLayers.i18n("Rotation"),
            printText: OpenLayers.i18n("mf.print.print"),
            creatingPdfText: OpenLayers.i18n("mf.print.generatingPDF"),
            titleFieldLabel: OpenLayers.i18n("titlefieldlabel"),
            defaultTitleText: OpenLayers.i18n("titlefieldvalue"),
            commentFieldLabel: OpenLayers.i18n("commentfieldlabel"),
            defaultCommentText: OpenLayers.i18n("commentfieldvalue"),
            layer: this.printLayer,
            comboOptions: {
                typeAhead: true,
                selectOnFocus: true,
                displayField: "label",
                valueField: "name"
            },
            printExtentOptions: {
                transformFeatureOptions: {
                    rotationHandleSymbolizer: "rotate"
                }
            }
        }, this.config.printPanelOptions);
        delete this.config.printPanelConfig;

        this.printPanel = new GeoExt.ux.SimplePrint(printOptions);

        this.printPanel.insert(0, {
            xtype: "textfield",
            hidden: !this.config.configureTitle,
            name: "mapTitle",
            fieldLabel: OpenLayers.i18n("Title"),
            value: this.config.mapTitle ? this.config.mapTitle : OpenLayers.i18n("www.geo.admin.ch"),
            plugins: new GeoExt.plugins.PrintPageField({
                printPage: this.printPanel.printPage
            })
        });

        this.printPanel.insert(1, {
            xtype: "textfield",
            hidden: !this.config.configureFooter,
            name: "mapFooter",
            fieldLabel: OpenLayers.i18n("Footer"),
            value: this.config.mapFooter ? this.config.mapFooter : OpenLayers.i18n("mapFooter"),
            plugins: new GeoExt.plugins.PrintPageField({
                printPage: this.printPanel.printPage
            })
        });
        this.customLogo = this.config.mapLogo ? true : false;

        this.printPanel.insert(1, {
            xtype: "textfield",
            hidden: true,
            name: "mapLogo",
            fieldLabel: OpenLayers.i18n("MapLogo"),
            value: this.config.mapLogo,
            plugins: new GeoExt.plugins.PrintPageField({
                printPage: this.printPanel.printPage
            })
        });

        this.legendCheckbox = new GeoAdmin.LegendButton({hidden: !this.config.configureLegend});
        this.printPanel.add(this.legendCheckbox);
        //this.printPanel.insert(1, this.legendCheckbox);

        this.printPanel.hideExtent();

        // If a renderTo config is provided, the print panel is rendered
        // in the given element, else a popup is used to display it.
        this.showWindow = !printOptions.renderTo;
        if (this.showWindow) {
            this.windowOptions = Ext.apply({
                height: 240,
                width: 225,
                bodyStyle: 'padding: 5px; background-color: #FFFFFF;',
                title: OpenLayers.i18n('print'),
                layout: "fit",
                closeAction: 'hide',
                items: [ this.printPanel ]
            }, this.config.windowOptions);
            this.printPanel.hideExtent();
            this.printLayer.setVisibility(false);
        } else {
            this.printPanel.hideExtent();
            this.printPanel.container.hide();
        }
        delete this.config.windowOptions;
    };

