/*
 * global BFS namespace
 */
var BFS = {};

/*
 * jquery noconflict
 */
$.noConflict();


/*
 * Initialize page when it finished loading DOM
 */
BFS.init = function() {
  	
  	jQuery(document).ready(function($) {
  		BFS.shareFunc.binder();
  	});

} ();
/*
 * Handles Share Functions
 */
BFS.shareFunc = {

	binder: function() {
		this.showShare();
		this.hideShare();
	},
	showShare: function () {
		jQuery('.share').show();
		jQuery('noscript').hide();
		jQuery('.share').bind('click', function(){
			jQuery('.shareBox').show();
			jQuery('.share').hide();
			return false;
		});
	},
	hideShare: function () {
		jQuery('.close').bind('click', function(){
			jQuery('.shareBox').hide();
			jQuery('.share').show();
			return false;
		});
	}
	
}

//functions for disable select-elements
jQuery(document).ready(function() {

    var $inquiry = jQuery('select#inquiry'),
        $prodimaNr = jQuery('select#prodimaNr'),
        $resetButton = jQuery('input:reset');

    //jQuery(function(){
        $inquiry.change(function(event){
            jQuery('option:selected', jQuery(this)).each(function(){
                var value = jQuery(this).val();
                if (value !== '') {
                    $prodimaNr.attr('disabled', 'disabled');
                    $prodimaNr.css('background-color', '#ccc');
                } else {
                    $prodimaNr.removeAttr('disabled');
                    $prodimaNr.removeAttr('style');
                }
            });
        });

        $prodimaNr.change(function(event){
            jQuery('option:selected', jQuery(this)).each(function(){
                var value = jQuery(this).val();
                if (value !== '') {
                    $inquiry.attr('disabled', 'disabled');
                    $inquiry.css('background-color', '#ccc');
                } else {
                    $inquiry.removeAttr('disabled');
                    $inquiry.removeAttr('style');
                }
            });
        });

        $resetButton.click(function() {
            $prodimaNr.removeAttr('disabled');
            $prodimaNr.removeAttr('style');
            $inquiry.removeAttr('disabled');
            $inquiry.removeAttr('style');
        });
    //});
});