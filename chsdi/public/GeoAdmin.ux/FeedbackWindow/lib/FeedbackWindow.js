/*global GeoAdmin:true, OpenLayers: true, Ext:true */

Ext.namespace("GeoAdmin");

GeoAdmin.FeedbackWindow = Ext.extend(Ext.Window, {

    initComponent : function() {
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
                                    fieldLabel: OpenLayers.i18n('Your email'),
                                    name: 'email',
                                    anchor:'100%'
                                },
                                {
                                    xtype:'textarea',
                                    fieldLabel: OpenLayers.i18n('Your feedback'),
                                    name: 'feedback',
                                    height: 60,
                                    anchor:'100%',
                                    allowBlank: false
                                }
                            ]
                        }
                    ]
                }
            ],

            buttons: [
                {
                    text: OpenLayers.i18n('Cancel'),
                    scope: this,
                    handler: this.cancelAction
                },
                {
                    text: OpenLayers.i18n('Send feedback'),
                    scope: this,
                    handler: this.sendAction
                }
            ]
        });
        this.items = [
            this.panel
        ];
        var defConfig = {
            width: 610,
            title: OpenLayers.i18n('Feedback'),
            closable: false,
            closeAction: 'hide'
        };

        Ext.applyIf(this, defConfig);

        GeoAdmin.FeedbackWindow.superclass.initComponent.call(this);
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
        Ext.Msg.show({
            title:'Success',
            msg: OpenLayers.i18n('Thanks a lot for your feedback !'),
            modal:true,
            icon:Ext.Msg.INFO,
            buttons:Ext.Msg.OK
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
        title = title || 'Error';
        Ext.Msg.show({
            title:title,
            msg:msg,
            modal:true,
            icon:Ext.Msg.ERROR,
            buttons:Ext.Msg.OK
        });
    },

    getPermalink: function() {
        return "blabla=tutu";
    }

});