
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






