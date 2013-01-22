/**
 * @include Ext/src/ext-core/examples/jsonp/jsonp.js
 * @include Permalink/lib/PermalinkField.js
 * @include Permalink/lib/MailWindow.js
 */

/** api: (define)
 *  module = GeoAdmin
 *  class = PermalinkPanel
 *  base_link = `Ext.form.FormPanel <http://dev.sencha.com/deploy/dev/docs/?class=Ext.form.FormPanel>`_
 */

/** api: example
 *  Sample code to use a permalink panel:
 *
 *  .. code-block:: javascript
 *
 *    permalinkPanel1 = new GeoAdmin.PermalinkPanel({hidden: true});
 *    permalinkPanel2 = new GeoAdmin.PermalinkPanel({hidden: true});
 *
 *    mapPanel = new GeoAdmin.MapPanel({
 *        region: "center",
 *        border: false,
 *        width: 600,
 *        map: new GeoAdmin.Map(),
 *        tbar: ["->", {
 *            text: "permalink 1",
 *            enableToggle: true,
 *           toggleGroup: "export",
 *            allowDepress: true,
 *            toggleHandler: function(btn, state) {
 *                permalinkPanel1.setVisible(state);
 *            }
 *        }, {
 *            text: "permalink 2",
 *            enableToggle: true,
 *            toggleGroup: "export",
 *            allowDepress: true,
 *            toggleHandler: function(btn, state) {
 *                permalinkPanel2.setVisible(state);
 *            }
 *        }],
 *        items: [permalinkPanel1, permalinkPanel2]
 *    });
 *
 *    mainPanel = new Ext.Panel({
 *        renderTo: Ext.getBody(),
 *        layout: "border",
 *        width: 800,
 *        height: 400,
 *        items: [{
 *            region: "west",
 *            width: 200,
 *            collapsible: true,
 *            html: ["<p>If you collapse this panel,",
 *                   "the permalink panel should not be",
 *                   "resized</p>"].join(" ")
 *        },
 *            mapPanel
 *        ]
 *    });
 *
 */

/** api: constructor
 *  .. class:: PermalinkPanel(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.PermalinkPanel``
 *
 *  Create a permalink panel
 */

GeoAdmin.PermalinkPanel = Ext.extend(Ext.form.FormPanel, {
    border: false,
    width: 460,
    cls: "permalink-panel",
    ctCls: "permalink-panel-ct",
    baseCls: "permalink-panel",
    labelAlign: "top",
    closeButtonToggleGroup: "export",
    shareText: null,
    buttonShare: null,
    buttonTwitter: null,
    buttonFacebook: null,
    buttonGooglePlus: null,
    buttonMail: null,
    buttonClose: null,
    mail: false,

    initComponent: function (config) {
        Ext.apply(this, config);
        this.layout = 'hbox';
        this.title = OpenLayers.i18n("Map URL");
        this.shareText = new Ext.menu.TextItem({
            cls: "shareText",
            text: OpenLayers.i18n("Share"),
            scope: this,
            handler: function () {
                this.switchDisplay(true);
            }
        });
        this.shareText.addClass("showBlock");
        this.shareTextOpen = new Ext.menu.TextItem({
            cls: "shareTextOpen",
            text: OpenLayers.i18n("Share:")
        });
        this.shareTextOpen.addClass("hideBlock");
        // Share button
        this.buttonShare = new Ext.Button({
            cls: "share-button",
            tooltip: OpenLayers.i18n("Share"),
            scope: this,
            handler: function () {
                this.switchDisplay(true);
            }
        });
        this.buttonShare.addClass("showBlock");
        // Qrcode button
        this.buttonQrcode = new Ext.Button({
            cls: "qrcode-button",
            tooltip: "QRcode",
            scope: this,
            handler: function () {
                this.httpShare('qrcode');
            }
        });
        this.buttonQrcode.addClass("hideBlock");
        // Twitter button
        this.buttonTwitter = new Ext.Button({
            cls: "twitter-button",
            tooltip: "Twitter",
            scope: this,
            handler: function () {
                this.httpShare('twitter');
            }
        });
        this.buttonTwitter.addClass("hideBlock");
        // Facebook button
        this.buttonFacebook = new Ext.Button({
            cls: "facebook-button",
            tooltip: "Facebook",
            scope: this,
            handler: function () {
                this.httpShare('facebook');
            }
        });
        this.buttonFacebook.addClass("hideBlock");
        this.buttonGooglePlus = new Ext.Button({
            cls: "googleplus-button",
            tooltip: "Google Bookmarks",
            scope: this,
            handler: function () {
                this.httpShare('googleplus');
            }
        });
        this.buttonGooglePlus.addClass("hideBlock");
        if (this.mail) {
            this.buttonMail = new Ext.Button({
                cls: "mail-button",
                tooltip: OpenLayers.i18n("Email"),
                scope: this,
                handler: function () {
                    location.href = 'mailto:?body=' + encodeURIComponent(Ext.state.Manager.getProvider().getLink());
                }
            });
            this.buttonMail.addClass("hideBlock");
        }
        // Close share button
        this.buttonClose = new Ext.Button({
            cls: "close-share-button",
            tooltip: OpenLayers.i18n('Close'),
            scope: this,
            handler: function () {
                this.switchDisplay(false);
            }
        });
        this.buttonClose.addClass("hideBlock");
        // Finally add the pipes
        this.sharePipe1 = new Ext.Spacer({
            cls: 'sharepipe'
        });
        this.sharePipe1.addClass("hideBlock");
        this.sharePipe2 = new Ext.Spacer({
            cls: 'sharepipe'
        });
        this.sharePipe2.addClass("hideBlock");
        this.sharePipe3 = new Ext.Spacer({
            cls: 'sharepipe'
        });
        this.sharePipe3.addClass("hideBlock");
        this.sharePipe4 = new Ext.Spacer({
            cls: 'sharepipe'
        });
        this.sharePipe4.addClass("hideBlock");
        this.sharePipe5 = new Ext.Spacer({
            cls: 'sharepipe'
        });
        this.sharePipe5.addClass("hideBlock");
        // Permalink Field
        this.permalinkField = new GeoAdmin.PermalinkField({width: 280});
        var buttonShorten = new Ext.Button({
            cls: "shorten-button",
            text: OpenLayers.i18n('Shorten'),
            tooltip: OpenLayers.i18n('Shorten URL'),
            scope: this,
            handler: function () {
                Ext.ux.JSONP.request(GeoAdmin.webServicesUrl + "/shorten.json", {
                    callbackKey: "cb",
                    params: {
                        url: Ext.state.Manager.getProvider().getLink()
                    },
                    scope: this,
                    callback: this.shortenCb
                });
            }
        });
        var buttonMultimap = new Ext.Button({
            cls: "multimap-button",
            text: OpenLayers.i18n('Multimap'),
            tooltip: OpenLayers.i18n('Multimap tooltip'),
            scope: this,
            handler: function () { 
                var link = Ext.state.Manager.getProvider().getLink();
                link = link.split('?');
                if (link[1].indexOf('layers=') < 0) {
                    alert(OpenLayers.i18n('Multimap works with at least one layer. Please add one'));
                } else {
                    window.open(GeoAdmin.webServicesUrl + "/maps?" + link[1], '_new');
                }
            }
        });

        this.items = [this.permalinkField, buttonShorten, buttonMultimap];
        if (this.mail) {
            this.tbar = ["->", this.shareText, this.shareTextOpen, this.buttonShare ,this.buttonQrcode, this.sharePipe1, this.buttonTwitter, this.sharePipe2, this.buttonFacebook, this.sharePipe3, this.buttonGooglePlus, this.sharePipe4, this.buttonMail, this.sharePipe5, this.buttonClose, {
                iconCls: "close-button",
                toggleGroup: this.closeButtonToggleGroup,
                scope: this,
                handler: function () {
                    this.hide();
                }
            }];
        } else {
            this.tbar = ["->", this.shareText, this.shareTextOpen, this.buttonShare, this.buttonQrcode, this.sharePipe1, this.buttonTwitter, this.sharePipe2, this.buttonFacebook, this.sharePipe3, this.buttonGooglePlus, this.sharePipe4, this.buttonClose, {
                iconCls: "close-button",
                toggleGroup: this.closeButtonToggleGroup,
                scope: this,
                handler: function () {
                    this.hide();
                }
            }];
        }
        GeoAdmin.PermalinkPanel.superclass.initComponent.apply(this, arguments);
    },
    shortenCb: function(response) {
       this.permalinkField.setValue(response.shorturl);
    },
    /** private method[httpShare]
     * Open a new tab with the permalink according to the button pushed
     */
    httpShare: function (j) {
        var permalink = Ext.state.Manager.getProvider().getLink();
        if (j === "facebook") {
            var url = "http://www.facebook.com/sharer.php?u=" + encodeURIComponent(permalink) + "&t=" + encodeURIComponent(document.title);
            window.open(url, '_blank');
        } else if (j === "twitter") {
            var url = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(permalink) + "&text=" + encodeURIComponent(document.title);
            window.open(url, '_blank');
        } else if (j === "googleplus") {
            var url = "https://www.google.com/bookmarks/mark?op=edit&bkmk=" + encodeURIComponent(permalink) + "&title=" + encodeURIComponent(document.title);
            window.open(url, '_blank');
        } else if (j === "qrcode") {
            var url = GeoAdmin.webServicesUrl + "/qrcodegenerator?url=" + encodeURIComponent(Ext.state.Manager.getProvider().getLink());
            window.open(url, '_blank');
        }
    },
    /** private method[switchDisplay]
     * Display displays/hides the share buttons
     */
    switchDisplay: function (k) {
        if (k) {
            this.shareText.addClass("hideBlock");
            this.shareText.removeClass("showBlock");
            this.buttonShare.addClass("hideBlock");
            this.buttonShare.removeClass("showBlock");
            this.shareTextOpen.addClass("showBlock");
            this.shareTextOpen.removeClass("hideBlock");
            this.buttonQrcode.addClass("showBlock");
            this.buttonQrcode.removeClass("hideBlock");
            this.buttonTwitter.addClass("showBlock");
            this.buttonTwitter.removeClass("hideBlock");
            this.buttonFacebook.addClass("showBlock");
            this.buttonFacebook.removeClass("hideBlock");
            this.buttonGooglePlus.addClass("showBlock");
            this.buttonGooglePlus.removeClass("hideBlock");
            if (this.mail) {
                this.buttonMail.addClass("showBlock");
                this.buttonMail.removeClass("hideBlock");
            }
            this.buttonClose.addClass("showBlock");
            this.buttonClose.removeClass("hideBlock");
            this.sharePipe1.addClass("showBlock");
            this.sharePipe1.removeClass("hideBlock");
            this.sharePipe2.addClass("showBlock");
            this.sharePipe2.removeClass("hideBlock");
            this.sharePipe3.addClass("showBlock");
            this.sharePipe3.removeClass("hideBlock");
            this.sharePipe4.addClass("showBlock");
            this.sharePipe4.removeClass("hideBlock");
            this.sharePipe5.addClass("showBlock");
            this.sharePipe5.removeClass("hideBlock");
        } else {
            this.shareText.addClass("showBlock");
            this.shareText.removeClass("hideBlock");
            this.buttonShare.addClass("showBlock");
            this.buttonShare.removeClass("hideBlock");
            this.shareTextOpen.addClass("hideBlock");
            this.shareTextOpen.removeClass("showBlock");
            this.buttonQrcode.addClass("hideBlock");
            this.buttonQrcode.removeClass("showBlock");
            this.buttonTwitter.addClass("hideBlock");
            this.buttonTwitter.removeClass("showBlock");
            this.buttonFacebook.addClass("hideBlock");
            this.buttonFacebook.removeClass("showBlock");
            this.buttonGooglePlus.addClass("hideBlock");
            this.buttonGooglePlus.removeClass("showBlock");
            if (this.mail) {
                this.buttonMail.addClass("hideBlock");
                this.buttonMail.removeClass("showBlock");
            }
            ;
            this.buttonClose.addClass("hideBlock");
            this.buttonClose.removeClass("showBlock");
            this.sharePipe1.addClass("hideBlock");
            this.sharePipe1.removeClass("showBlock");
            this.sharePipe2.addClass("hideBlock");
            this.sharePipe2.removeClass("showBlock");
            this.sharePipe3.addClass("hideBlock");
            this.sharePipe3.removeClass("showBlock");
            this.sharePipe4.addClass("hideBlock");
            this.sharePipe4.removeClass("showBlock");
            this.sharePipe5.addClass("hideBlock");
            this.sharePipe5.removeClass("showBlock");
        }
    },
    afterRender: function() {
        GeoAdmin.PermalinkPanel.superclass.afterRender.apply(this, arguments);
        // we want to swallow events not to have the map move
        // when mouse actions occur on this panel
        this.body.swallowEvent(["mousedown", "mousemove", "mouseup", "click", "dblclick"]);
    }
});

/** api: xtype = ga_permalinkpanel */
Ext.reg("ga_permalinkpanel", GeoAdmin.PermalinkPanel);
