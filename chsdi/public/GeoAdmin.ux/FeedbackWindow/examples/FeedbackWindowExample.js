var feedbackWindow;

Ext.onReady(function() {
    feedbackWindow = new GeoAdmin.FeedbackWindow({
        getPermalink: function() {
            return "http://map.geo.admin.ch/test";
        }
    });
});
