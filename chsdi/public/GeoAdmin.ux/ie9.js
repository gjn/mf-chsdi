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
    ieVer = ieVer ? parseInt(ieVer[1], 10) : 0;

    Ext.apply(Ext, {
        isIE6: isIE && ieVer <= 6,
        isIE7:  isIE && ieVer == 7,
        isIE8: isIE && ieVer == 8,
        isIE9:  isIE && ieVer == 9,
        isIE10: isIE && ieVer == 10
    });
}

Ext.dd.DragTracker.override({
    onMouseMove: function(e, target){
    // HACK: IE hack to see if button was released outside of window. */
        if(this.active && Ext.isIE && !e.browserEvent.button && !(Ext.isIE9 || Ext.isIE10)){
            e.preventDefault();
            this.onMouseUp(e);
            return;
        }

       e.preventDefault();
       var xy = e.getXY(), s = this.startXY;
       this.lastXY = xy;
           if(!this.active){
               if(Math.abs(s[0]-xy[0]) > this.tolerance || Math.abs(s[1]-xy[1]) > this.tolerance){
                   this.triggerStart(e);
               }else{
                   return;
              }
           }
           this.fireEvent('mousemove', this, e);
           this.onDrag(e);
           this.fireEvent('drag', this, e);
       }
 });

if (Ext.isIE9 || Ext.isIE10) {
    Ext.apply(Ext, {
        /* Move cursor doesn't disappear within IE9  */
        removeNode : Ext.isIE6 || Ext.isIE7 ? function(){
            var d;
            return function(n){
                if(n && n.tagName != 'BODY'){
                    (Ext.enableNestedListenerRemoval) ? Ext.EventManager.purgeElement(n, true) : Ext.EventManager.removeAll(n);
                     d = d || DOC.createElement('div');
                     d.appendChild(n);
                     d.innerHTML = '';
                     delete Ext.elCache[n.id];
                }
            };
        }() : function(n){
            if(n && n.parentNode && n.tagName != 'BODY'){
                (Ext.enableNestedListenerRemoval) ? Ext.EventManager.purgeElement(n, true) : Ext.EventManager.removeAll(n);
                 n.parentNode.removeChild(n);
                 delete Ext.elCache[n.id];
            }
        }
    });
}
