/*
 * Fix for IE9 missing function createContextualFragement
 * see http://www.sencha.com/forum/showthread.php?125869-Menu-shadow-probolem-in-IE9&p=579336
 * 
 * To be remove once we use an ExtJS version post 15 March 2011
 *
 */
if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment) {
    Range.prototype.createContextualFragment = function(html) {
        var frag = document.createDocumentFragment(),
                div = document.createElement("div");
        frag.appendChild(div);
        div.outerHTML = html;
        return frag;
    };
}

/* FIXME
 * Ext falsely advertise IE9 as IE6!
 * Will be hopefully fixed in Ext 3.3.3
*/

if (Ext) {

    var isIE = window.ActiveXObject ? true : false;
    var ieVer = navigator.userAgent.match(/msie (\d+)/i);

    Ext.apply(Ext, {
        isIE6: isIE && ieVer <= 6,
        isIE7:  isIE && ieVer == 7,
        isIE8: isIE && ieVer >= 8,
        isIE9:  isIE && ieVer == 9
    });
}




