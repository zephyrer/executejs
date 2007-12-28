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
    EJS_prefObserver = rno_common.Utils.createObserver(EJS_init);
    rno_common.Utils.registerObserver(executejs.EjsCommon.EJS_PREF_OBSERVER, EJS_prefObserver);
	EJS_combinedShortCutCode = rno_common.Prefs.getCharPref(EJS_userPrefShortCutOpenCommandWin);
    EJS_init();
}

function EJS_openCommandWin(){
    var win = window.open("chrome://executejs/content/executejs/executeJS.xul","commandwin", "chrome,width=850,height=450,resizable");
    win.focus()    
}

function EJS_init(){
	    ShortCutManager.clearAllShortCutsForClientId("EJS");
    	EJS_combinedShortCutCode = rno_common.Prefs.getCharPref(EJS_userPrefShortCutOpenCommandWin);
    	if(EJS_combinedShortCutCode)
	    	ShortCutManager.addJsShortCutWithCombinedKeyCode(EJS_combinedShortCutCode, "EJS_openCommandWin()", "EJS");    
}
