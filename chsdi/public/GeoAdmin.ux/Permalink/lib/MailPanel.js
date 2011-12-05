
Ext.namespace('GeoAdmin');

GeoAdmin.MailPanel = Ext.extend(Ext.form.FormPanel, {
	
    constructor: function(config) {
        config = Ext.applyIf({
	    itemId: 'mailPanel',
            baseCls: 'mail-panel',
            labelWidth: 55,
            defaultType: 'textfield',
            items: [{
                fieldLabel: OpenLayers.i18n('To'),
                name: 'recipient',
                anchor: '100%',
                vtype: 'email'
                }, {
                fieldLabel: OpenLayers.i18n('From'),
                name: 'sender',
                anchor: '100%',
                vtype: 'email'
                }, {
                fieldLabel: OpenLayers.i18n('Subject'),
                name: 'subject_txt',
                anchor: '100%'
                }, {
                xtype: 'textarea',
                hideLabel: true,
                value: Ext.state.Manager.getProvider().getLink(),
                name: 'text_msg',
                anchor: '100% -75',	
                allowBlank: false	
                }]
        }, config);			
        GeoAdmin.MailPanel.superclass.constructor.call(this,config);
    }
	
});

Ext.reg("ga_mailpanel", GeoAdmin.MailPanel);
