/**
 * @include Permalink/lib/MailPanel.js
 */
 
Ext.namespace('GeoAdmin');

/** api: constructor
 *  .. class:: MailWindow(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.MailWindow``
 *
 *  Create a mail window
 */

GeoAdmin.MailWindow = Ext.extend(Ext.Window, {
     constructor: function(config) {
         this.panel = new GeoAdmin.MailPanel;
         config = Ext.applyIf({
             title: OpenLayers.i18n('Email'),
             width: 500,
             height: 300,
             minWidth: 300,
             minHeight: 200,
             layout: 'fit',
             plain: true,
             bodyStyle:'padding:5px;',
             buttonAlign:'center',
             items: [this.panel],
             buttons: [{
                 text: OpenLayers.i18n('Send'),
                 handler: this.sendAction,
                 scope: this
             },{
                 text: OpenLayers.i18n('Cancel'),
                 handler: this.cancelAction,
                 scope: this
             }]
          }, config);
        
        GeoAdmin.MailWindow.superclass.constructor.call(this, config);
	},

    cancelAction: function() {
        this.destroy();
    },
  
    // The send Action uses the feedback.py controller
    sendAction: function() {
        this.panel.getForm().submit({
            url: 'feedback',
            scope: this,
            success:this.onSuccess,
            failure:this.onFailure,
            params: {
                ua: navigator.userAgent
            },
            waitMsg: OpenLayers.i18n('Sending your email...')
        });
    },
    
    onSuccess: function(form, action) {
        Ext.MessageBox.show({
            title: OpenLayers.i18n('Success'),
            msg: OpenLayers.i18n('Your email was sent successfully!'),
            modal:true,
            icon:Ext.MessageBox.INFO,
            buttons:Ext.MessageBox.OK
        });
        this.destroy();
    },

    onFailure: function(form, action) {
        if (!this.panel.getForm().isValid()) {
            this.showError(OpenLayers.i18n('Please fill the communication field'));
        } else {
            if (action.result) {
                this.showError(action.result.error);
            } else {
                this.showError(action.response.responseText);
            }
            this.destroy();
        }
   },

    showError: function(msg, title) {
        title = title || OpenLayers.i18n('Error');
        Ext.MessageBox.show({
            title:title,
            msg:msg,
            modal:true,
            icon:Ext.MessageBox.ERROR,
            buttons:Ext.MessageBox.OK
        });
    }
});

/** api: xtype = ga_mailwindow */
Ext.reg("ga_mailwindow", GeoAdmin.MailWindow);
