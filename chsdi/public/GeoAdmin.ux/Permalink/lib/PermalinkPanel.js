/**
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
    initComponent: function () {
        this.title = OpenLayers.i18n("Map URL");
        // Share button
        buttonShare = new Ext.Button({
            id: "shareId",
            cls: "share-button",
            tooltip: OpenLayers.i18n("Share"),
            scope: this,
            handler: function () {
                this.switchDisplay("shareId");
            }
        });
        // Text label
        div = document.createElement("div");
        div.id = "textLabel";
        div.className = "textLabel";
        div.innerHTML = OpenLayers.i18n("Share:");
        div.style.display = "none";
        // Text label initial
        div_ini = document.createElement("div");
        div_ini.id = "textLabelIni";
        div_ini.className = "textLabelIni";
        div_ini.innerHTML = OpenLayers.i18n("Share");
        div_ini.style.display = "block";
        // Twitter button
        buttonTwitter = new Ext.Button({
            id : "twitterId",
            cls: "twitter-button",
            tooltip: "Twitter",
            scope: this,
            handler: function () {
                this.httpShare('twitter');
            }
        });
        // Facebook button
        buttonFacebook = new Ext.Button({
            id: "facebookId",
            cls: "facebook-button",
            tooltip: "Facebook",
            scope: this,
            handler: function () {
                this.httpShare('facebook');
            }
        });
        buttonGooglePlus = new Ext.Button({
            id: "googleplusId",
            cls: "googleplus-button",
            tooltip: "Google Bookmarks",
            scope: this,
            handler: function () {
                this.httpShare('googleplus');
            }
        });
        buttonMail = new Ext.Button({
            id: "mailId",
            cls: "mail-button",
            tooltip: OpenLayers.i18n("Email"),
            scope: this,
            handler: function () {
                windowMail = new GeoAdmin.MailWindow();
                windowMail.show();
            }
        });
        // Close share button
        buttonClose = new Ext.Button({
            id: "closeShareId",
            cls: "close-share-button",
            tooltip: OpenLayers.i18n('Close'),
            scope: this,
            handler: function () {
                this.switchDisplay("closeShareId");
            }
        });
        // Permalink Field
        permalinkField = new GeoAdmin.PermalinkField({width: 440});
        this.items = permalinkField;
        this.tbar = ["->", div_ini, buttonShare, div, buttonTwitter, buttonFacebook, buttonGooglePlus, buttonMail, buttonClose, {
            iconCls: "close-button",
            toggleGroup: this.closeButtonToggleGroup,
            scope: this,
            handler: function () {
                this.hide();
            }
        }];
        GeoAdmin.PermalinkPanel.superclass.initComponent.apply(this, arguments);
    },
    /** private method[httpShare]
		* Open a new tab with the permalink according to the button pushed
		*/
    httpShare: function (j) {
        permalink = Ext.state.Manager.getProvider().getLink();
        if (j === "facebook") {
            url = "http://www.facebook.com/sharer.php?u=" + encodeURIComponent(permalink) + "&t=" + encodeURIComponent(document.title);
            window.open(url, '_blank');
        } else if (j === "twitter") {
            url = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(permalink) + "&text=" + encodeURIComponent(document.title);
            window.open(url, '_blank');
        } else if (j === "googleplus") {
            url = "https://www.google.com/bookmarks/mark?op=edit&bkmk=" + encodeURIComponent(permalink) + "&title=" + encodeURIComponent(document.title);
            window.open(url, '_blank');
        }
    },
    /** private method[switchDisplay]
    * Display displays/hides the share buttons
    */ 
    switchDisplay: function (k) {
        if (k === "shareId") {
            document.getElementById("textLabel").style.display = "block";
            document.getElementById("twitterId").style.display = "block";
            document.getElementById("facebookId").style.display = "block";
            document.getElementById("googleplusId").style.display = "block";
            document.getElementById("mailId").style.display = "block";
            document.getElementById("closeShareId").style.display = "block";
            document.getElementById("textLabelIni").style.display = "none";
            document.getElementById("shareId").style.display = "none";
        } else {
            document.getElementById("textLabel").style.display = "none";
            document.getElementById("twitterId").style.display = "none";
            document.getElementById("facebookId").style.display = "none";
            document.getElementById("googleplusId").style.display = "none";
            document.getElementById("mailId").style.display = "none";
            document.getElementById("closeShareId").style.display = "none";
            document.getElementById("textLabelIni").style.display = "block";
            document.getElementById("shareId").style.display = "block";
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
