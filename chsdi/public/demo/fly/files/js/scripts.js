/*
// +----------------------------------------------------------------------+
// | Scripts for News Service Bund                                        |
// +----------------------------------------------------------------------+
// |                                                                      |

document.write('<link rel="stylesheet" type="text/css" href="resources/styles/jsstyles.css"></link>');

// +----------------------------------------------------------------------+
/* Layerwechsel */

function showLayer(layer_id,reiter_id,id){
    if(document.getElementById('reiterLayer1')){
      document.getElementById('reiterLayer1').style.display='none';
      if(document.getElementById('reiter1')){
        document.getElementById('reiter1').className='';
      }
    }
    if(document.getElementById('reiterLayer2')){
      document.getElementById('reiterLayer2').style.display='none';
      if(document.getElementById('reiter2')){
        document.getElementById('reiter2').className='';
      }
    }
    if(document.getElementById('reiterLayer3')){
      document.getElementById('reiterLayer3').style.display='none';
      if(document.getElementById('reiter3')){
        document.getElementById('reiter3').className='';
      }
    }
    if(document.getElementById('reiterLayer4')){
      document.getElementById('reiterLayer4').style.display='none';
      if(document.getElementById('reiter4')){
        document.getElementById('reiter4').className='';
      }
    }
    if(document.getElementById('reiterLayer5')){
      document.getElementById('reiterLayer5').style.display='none';
      if(document.getElementById('reiter5')){
        document.getElementById('reiter5').className='';
      }
    }
    if(document.getElementById('reiterLayer6')){
      document.getElementById('reiterLayer6').style.display='none';
      if(document.getElementById('reiter6')){
        document.getElementById('reiter6').className='';
      }
    }
    if(document.getElementById('reiterLayer7')){
      document.getElementById('reiterLayer7').style.display='none';
      if(document.getElementById('reiter7')){
        document.getElementById('reiter7').className='';
      }
    }
    /* anzeigen */
    if(document.getElementById(layer_id)){
      //alert(document.getElementById(reiter_id).className);
      document.getElementById(layer_id).style.display='block';
      document.getElementById(reiter_id).className='';
      document.getElementById(reiter_id).className='reiterListeAktiv';
    }
}

/* Organigramm */
function toggleDetail(detailId){
  if(document.getElementById(detailId)){
    if(document.getElementById(detailId).style.display=='none' || document.getElementById(detailId).style.display==''){
      document.getElementById(detailId).style.display='block';
    }else{
      document.getElementById(detailId).style.display='none';
    }
  }
}

function toggleSubCat(catId,action){
  if(document.getElementById(catId)){
    if(((document.getElementById(catId).style.display == 'none' || document.getElementById(catId).style.display == '') || action == 'open' ) && (action != 'close')){
      document.getElementById(catId).style.display = 'block';
      toggleImage(catId,'open');
      //document.getElementById('img_'+catId).src = '/images/organigramm_pfeil2.gif';
    }else{
      toggleImage(catId,'close');
      document.getElementById(catId).style.display = 'none';
      //document.getElementById('img_'+catId).src = '/images/organigramm_pfeil1.gif';
    }
  }
}

function toggleImage(catId,action){
  if(action == 'open'){
    document.getElementById('img_'+catId).src = 'resources/images/organigramm_pfeil2.gif';
  }else{
    document.getElementById('img_'+catId).src = 'resources/images/organigramm_pfeil1.gif';
  }
}

var sToggleAllStatus = false;
function toggleAllSubCat(orgListe,id){
  if(sToggleAllStatus == 'open'){
    sToggleAllStatus = 'close';
  }else{
    sToggleAllStatus = 'open';
  }
  var oOuterDiv = document.getElementById(orgListe);
  var aReturn=oOuterDiv.getElementsByTagName("UL");
  for( var x = 0; aReturn[x]; x++ ){
    var toggleId = aReturn[x].id;
     if(toggleId){
      toggleSubCat(toggleId,sToggleAllStatus);
     }
  }
  toggleImage(id,sToggleAllStatus);
}

var mailWin='';
function mailWindow() {
	// look for a parameter who's containing language information
	var myLanguage = "";
	if (mailWindow.arguments.length > 0) {
		myLanguage = mailWindow.arguments[1];
		}
	// define window width and height, center window position 
  var myWidth = 430;
  var myHeight = 300;	
  var myLeft = (screen.width - myWidth) / 2;
  var myTop = (screen.height - myHeight) / 2;
	// set window.open parameters
  winprops = 'height='+myHeight+',width='+myWidth+',top='+myTop+',left='+myLeft+',toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes';
	// open window, set window handle to 'printWin'
  mailWin = window.open('/script/mailme.php?site='+this.window.location.pathname+'&lng='+myLanguage, 'Mail', winprops);
	// set focus to the new opened window
  if (parseInt(navigator.appVersion) >= 4) { mailWin.window.focus(); }
  }

var printWin='';
function printWindow( path ) {
	// look for a parameter who's containing language information
	var myLanguage = "";
	if (printWindow.arguments.length > 0) {
		myLanguage = printWindow.arguments[1];
		}
	// define window width and height, center window position 
  var myWidth = 700;
  var myHeight = 600;	
  var myLeft = (screen.width - myWidth) / 2;
  var myTop = (screen.height - myHeight) / 2;
	// set window.open parameters
  winprops = 'height='+myHeight+',width='+myWidth+',top='+myTop+',left='+myLeft+',toolbar=no,location=no,directories=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes';
	// open window, set window handle to 'printWin'
  printWin = window.open(path, 'Print', winprops);
	// set focus to the new opened window
  if (parseInt(navigator.appVersion) >= 4) { printWin.window.focus(); }
  }


/* E-Mailaddress uncryption */
function Email() {}
Email.decryptMailto = function(s, offset) {
	location.href = Email.decryptString(s, offset);
};
Email.decryptCharcode = function(n, start, end, offset) {
	n = n + offset;
	if (offset > 0 && n > end) {
		n = start + (n - end - 1);
	} else if (offset < 0 && n < start) {
		n = end - (start - n - 1);
	}
	return String.fromCharCode(n);
};
Email.decryptString = function(enc, offset, back) {
	var dec = "";
	var len = enc.length; 
	offset = offset * (back ? 1 : -1);
	for(var i = 0; i < len; i++) {
		var n = enc.charCodeAt(i);
		if (n >= 0x2B && n <= 0x3A) {
			dec += Email.decryptCharcode(n, 0x2B, 0x3A, offset); // 0-9 . , - + / :
		} else if (n >= 0x40 && n <= 0x5A) {
			dec += Email.decryptCharcode(n, 0x40, 0x5A, offset); // A-Z @
		} else if (n >= 0x61 && n <= 0x7A) {
			dec += Email.decryptCharcode(n, 0x61, 0x7A,offset); // a-z
		} else {
			dec += enc.charAt(i);
		}
	}
	return dec;
};
