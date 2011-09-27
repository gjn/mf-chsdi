/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/*
 * @include GeoExt/widgets/LegendPanel.js
 * @include LegendWindow/lib/TileMergeLegend.js
 * @include LegendWindow/lib/APILegend.js
 */

/** api: (define)
 *  module = GeoAdmin
 *  class = LegendWindow
 *  base_link = `Ext.Window <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Window>`_
 */

Ext.namespace("GeoAdmin");

/** api: constructor
 *  .. class:: LegendWindow(config)
 *
 *      Create a legend window.
 */
GeoAdmin.LegendWindow = Ext.extend(Ext.Window, {

    warningDiv: null,

    /** private: method[initComponent]
     */
    initComponent : function() {
        this.autoScroll = true;
        var provider = Ext.state.Manager.getProvider();
        provider.on("statechange", this.onProviderStatechange, this);
        this.items = [
            {
                xtype: 'gx_legendpanel',
                cls: "legendLayers",
                id: "legendLayers",
                listeners: {
                    afterrender: function(lp) {
                        var noLayerVisible = true;
                        for (var i = 0, len = lp.items.length; i < len; i++) {
                            var item = lp.items.get(i);
                            if (item.hidden === false) {
                                noLayerVisible = false;
                            }
                        }
                        if (noLayerVisible === true) {
                            if (!this.warningDiv) {
                                this.warningDiv = Ext.DomHelper.append(lp.body,
                                {tag: "div", cls: "legendNoLayers", html: OpenLayers.i18n("Legend.NoLayer") });
                            }
                            Ext.get(this.warningDiv).show();
                        } else {
                            if (this.warningDiv) {
                                Ext.get(this.warningDiv).hide();
                            }
                        }
                    },
                    scope: this
                },
                layout: 'fit',
                border: false,
                preferredTypes: ['ga_tilemergelegend', 'ga_apilegend']
            }
        ];

        this.toolTemplate = new Ext.XTemplate(
                '<tpl if="id==\'legendwindow\'">',
                '<div class="x-tool x-tool-legendBox">' + OpenLayers.i18n('Legend.Title') + '</div>',
                '</tpl>',
                '<tpl if="id==\'infoTool\'">',
                '<div class="x-tool x-tool-legendTool">&#160;</div>',
                '</tpl>',
                '<tpl if="id==\'pipe4\'">',
                '<div class="x-tool x-tool-pipe4">&#160;</div>',
                '</tpl>',
                '<tpl if="id==\'print\'">',
                '<div class="x-window-printtool">' + OpenLayers.i18n('print') + '</div>',
                '</tpl>',
                '<tpl if="id==\'close\'">',
                '<div class="x-tool x-tool-close">&#160;</div>',
                '</tpl>'
                );
        this.tools = [
            {
                id: 'legendBox'
            },
            {
                id: 'legendTool'
            },
            {
                id: 'pipe4'
            },
            {
                id: 'print',
                handler: function(evt, toolEl, panel, tc) {
                    var url = 'print.html';
                    var css = 'body {font-family: arial, sans, helvetica; width: 100%;}'
                            +'h1 {font-size: 1.5em;}'
                            +'label{font-weight: bold;background-color: #ddd;width: 100%;}'
                            +'.x-panel-body {float: left}'
                            +'.x-hide-display {display: none}'
                            +'img {display: block;}'
                            +'div.x-panel-body div {padding-top: 20px;}';

                    var popup = window.open(url, '', 'width=500, height=400, toolbar=no, location=no,' +
                            'directories=no, status=no, menubar=no, scrollbars=yes,' +
                            'copyhistory=no, resizable=no');
                    popup.document.write('<html><head><style>' + css + '</style>');
                    popup.document.write('<title>' + OpenLayers.i18n('Legend.Title') + '</title></head><body onload="window.print();">');
                    popup.document.write('<h1>' + OpenLayers.i18n('Legend.Title') + '</h1><br />');
                    popup.document.write(Ext.getDom('legendLayers').innerHTML + '</body></html>');
                    popup.document.close();
                    popup.focus();
                }
            }
        ];
        GeoAdmin.LegendWindow.superclass.initComponent.call(this);
    },
    onProviderStatechange: function(provider) {
        Ext.get(this.warningDiv).show();
        for (var i = 0, len = provider.state.map.layers.length; i < len; i++) {
            var layer = provider.state.map.layers[i];
            if (layer.visibility) {
                Ext.get(this.warningDiv).hide();
                break;
            }
        }
    }
});
