//Common functionality

//CONST
//Script names
XUL_NS= "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
RNO_LIB_NAMESPACE="namespace.js"
RNO_LIB_UTILS="utils.js"
RNO_LIB_PREFS="prefs.js"
RNO_LIB_FILEIO="file_io.js"
RNO_LIB_XMLUTILS="xmlutils.js"
RNO_LIB_SHORTCUTMANAGER="shortcutmanager.js"
RNO_LIB_LISTBOX="listbox.js"


/*
 * Loads Script from url
 * Must be local url
 */
function RNO_loadScript(url){
	var sm = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].
					getService(Components.interfaces.mozIJSSubScriptLoader)
	sm.loadSubScript(url);
}