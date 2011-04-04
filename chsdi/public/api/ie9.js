/*
 * Fix for IE9 missing function createContextualFragement
 * see http://www.sencha.com/forum/showthread.php?125869-Menu-shadow-probolem-in-IE9&p=579336
 * 
 * To be remove once we use an ExtJS version post 15 March 2011
 *
 */
if ((typeof Range !== "undefined") && !Range.prototype.createContextualFragment)
{
	Range.prototype.createContextualFragment = function(html)
	{
		var frag = document.createDocumentFragment(), 
		div = document.createElement("div");
		frag.appendChild(div);
		div.outerHTML = html;
		return frag;
	};
}
