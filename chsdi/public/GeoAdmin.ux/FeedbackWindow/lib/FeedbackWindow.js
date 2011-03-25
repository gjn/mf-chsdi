/*global GeoAdmin:true, OpenLayers: true, Ext:true */

Ext.namespace("GeoAdmin");

GeoAdmin.FeedbackWindow = Ext.extend(Ext.Window, {

    initComponent : function() {
        this.label = new Ext.form.Label({
            html: ""
        });
        this.panel = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            bodyStyle:'padding:5px 5px 0',
            width: 600,
            items: [
                {
                    layout:'column',
                    items:[
                        {
                            columnWidth:1,
                            layout: 'form',
                            items: [
                                {
                                    xtype:'textfield',
                                    fieldLabel: OpenLayers.i18n('Your email (optional)'),
                                    name: 'email',
                                    anchor:'100%',
                                    vtype: 'email',
                                    tabIndex: 1
                                },
                                {
                                    xtype:'textarea',
                                    fieldLabel: OpenLayers.i18n('Your feedback about current map extent'),
                                    name: 'feedback',
                                    height: 60,
                                    anchor:'100%',
                                    allowBlank: false,
                                    tabIndex: 2
                                },
                                this.label
                            ]
                        }
                    ]
                }
            ],

            buttons: [
                {
                    text: OpenLayers.i18n('Cancel'),
                    cls: 'feedbackWindowButton',
                    scope: this,
                    handler: this.cancelAction,
                    tabIndex: 4
                },
                {
                    text: OpenLayers.i18n('Send feedback'),
                    cls: 'feedbackWindowButton',
                    scope: this,
                    handler: this.sendAction,
                    tabIndex: 3
                }
            ]
        });
        this.items = [
            this.panel
        ];
        var defConfig = {
            width: 610,
            title: OpenLayers.i18n('Report'),
            closable: false,
            closeAction: 'hide'
        };

        Ext.applyIf(this, defConfig);

        GeoAdmin.FeedbackWindow.superclass.initComponent.call(this);

        Ext.state.Manager.getProvider().on("statechange", this.onProviderStatechange, this);

    },

    closeAction: 'hide',

    listeners: {
        beforeshow: function(window) {
            window.onProviderStatechange();
        }
    },

    cancelAction: function() {
        this.hide();
    },

    sendAction: function() {
        this.panel.getForm().submit({
            url: this.url,
            scope: this,
            success:this.onSuccess,
            failure:this.onFailure,
            params: {
                permalink: this.getPermalink()
            },
            waitMsg: OpenLayers.i18n("Sending feedback....")
        });
    },

    onSuccess:function(form, action) {
        Ext.MessageBox.show({
            title:OpenLayers.i18n('Success'),
            msg: OpenLayers.i18n('Thanks a lot for your feedback !'),
            modal:true,
            icon:Ext.MessageBox.INFO,
            buttons:Ext.MessageBox.OK
        });
        this.hide();
    },

    onFailure:function(form, action) {
        if (!this.panel.getForm().isValid()) {
            this.showError(OpenLayers.i18n('Please fill the feedback'));
        } else {
            if (action.result) {
                this.showError(action.result.error);
            } else {
                this.showError(action.response.responseText);
            }
            this.hide();
        }
    },

    showError:function(msg, title) {
        title = title || OpenLayers.i18n('Error');
        Ext.MessageBox.show({
            title:title,
            msg:msg,
            modal:true,
            icon:Ext.MessageBox.ERROR,
            buttons:Ext.MessageBox.OK
        });
    },

    getPermalink: function() {
        return Ext.state.Manager.getProvider().getLink();
    },

    onProviderStatechange: function(provider) {
        this.label.setText(OpenLayers.i18n('The following URL will be transferred:') + '<a href="' + this.getPermalink() + '" target="new">' + this.getPermalink() + '</a>',false);
    }
});