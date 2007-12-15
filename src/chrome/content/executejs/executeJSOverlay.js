/*
 * Execute JS
 * Version 0.1
 * Created by Rudolf Noé
 * 23.12.2005
 *
 * Licence Statement
 * Version:  MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License
 * Version 1.1  (the "License"); you may  not use this  file except in
 * compliance with the License.  You  may obtain a copy of the License
 * at http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the  License  for  the   specific  language  governing  rights  and
 * limitations under the License.
 */
 
EJS_userPrefShortCutOpenCommandWin = "executejs.keys.openCommandWin";

//Add event for each window
window.addEventListener('load',  EJS_onInit, false);

/*
    Initilization for window
*/
function EJS_onInit() {
    //Add preferences-observer
    var observerService = Components.classes["@mozilla.org/observer-service;1"].
        getService(Components.interfaces.nsIObserverService);
    observerService.addObserver(EJS_prefObserver, "EJS-PrefChange", true);
	EJS_combinedShortCutCode = Utils.getCharPref(EJS_userPrefShortCutOpenCommandWin);
	//Default Alt+Shift+Ctrl + c
	if(!EJS_combinedShortCutCode)
		Utils.prefs.setCharPref(EJS_userPrefShortCutOpenCommandWin, "1079");
    EJS_prefObserver.observe();
}

function EJS_openCommandWin(){
    window.open("chrome://executejs/content/executeJS.xul","commandwin", "chrome,width=850,height=450,resizable");    
}

EJS_prefObserver = {
    observe: function ( subject , topic , data ){
	    ShortCutManager.clearAllShortCutsForClientId("EJS");
    	EJS_combinedShortCutCode = Utils.getCharPref(EJS_userPrefShortCutOpenCommandWin);
    	if(EJS_combinedShortCutCode)
	    	ShortCutManager.addJsShortCutWithCombinedKeyCode(EJS_combinedShortCutCode, "EJS_openCommandWin()", "EJS");    
    },
	QueryInterface: function(iid) {
		if (!iid.equals(Components.interfaces.nsISupports)
				&& !iid.equals(Components.interfaces.nsISupportsWeakReference)
				&& !iid.equals(Components.interfaces.nsIObserver)) {
			dump("Hightlight Focus Window Pref-Observer factory object: QI unknown interface: " + iid + "\n");
			throw Components.results.NS_ERROR_NO_INTERFACE; }
		return this;
	}
}

