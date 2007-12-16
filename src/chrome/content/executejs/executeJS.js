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

var EJS_currentTarget = null;
var EJS_commandHistory = new Array();
var EJS_currentCommandHistoryPos = 0;
var EJS_jsCodeField = null;
var EJS_openWinMenuList = null;
var EJS_allOpenWins = new Object();

//Form elements
var EJS_cntTargetWinML = null;
var EJS_cntConentWinCB = null;
var EJS_bcContentWin = null;

var EJS_shortcuts = {
    cw: "getBrowser().contentWindow",
    contentWin: "getBrowser().contentWindow",
    getById: "document.getElementById",
    doc: "document",
    print: "EJS_appendToConsole",
    wo: "wrappedJSObject",
    props: "EJS_printPropertiesForTarget"
}

function EJS_byId(id){
	return document.getElementById(id);
}

function EJS_doOnload(){
    EJS_initGlobVars();
    EJS_initShortCuts();
    EJS_initFormReferences();
    document.getElementById("jsCode").select();
}

function EJS_initShortCuts(){
	ShortCutManager.addJsShortCutForElement("jsCode", 13, ShortCutManager.CTRL, "EJS_executeJS()");
	ShortCutManager.addJsShortCutForElement("jsCode", 40, ShortCutManager.CTRL, "EJS_nextCommandFromHistory()");
	ShortCutManager.addJsShortCutForElement("jsCode", 38, ShortCutManager.CTRL, "EJS_previousCommandFromHistory()");
	ShortCutManager.addJsShortCutForElement("jsCode", 13, ShortCutManager.NONE, "EJS_searchFunctions()");
	ShortCutManager.addJsShortCutForElement("functionName", 13, ShortCutManager.NONE, "EJS_searchFunctions()");
	
}

function EJS_initGlobVars(){
	EJS_jsCodeField = document.getElementById("jsCode");
	EJS_openWinMenuList = document.getElementById("destObj")
	EJS_openWinMenuList.selectedIndex = 1;
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                   .getService(Components.interfaces.nsIWindowMediator);
	EJS_currentTarget = wm.getEnumerator(null).getNext();
}

function EJS_initFormReferences(){
	EJS_cntTargetWinML = EJS_byId("destObj")
	EJS_cntConentWinCB = EJS_byId("contentWin")
	EJS_bcContentWin = EJS_byId("bc_contentWin")
}

function EJS_targetChanged(menuitem){
	//Set current target
  	var selectedWin = EJS_getSelectedWin();
  	
  	if (selectedWin.getBrowser!=null){
	  	//Disable/Enable Function checkbox
  		 EJS_bcContentWin.setAttribute("disabled","false")
  	}else{
  		 EJS_bcContentWin.setAttribute("disabled","true")
  	}
  	EJS_setCurrentTarget();
}

function EJS_setCurrentTarget(){
	var selectedWin = EJS_getSelectedWin();
	if (selectedWin.getBrowser!=null &&
		EJS_cntConentWinCB.disabled==false &&
		EJS_cntConentWinCB.checked==true){
		EJS_currentTarget = selectedWin.getBrowser().contentWindow.wrappedJSObject;
	}else {
		EJS_currentTarget = selectedWin;
	}
	Components.utils.reportError("EJS_setCurrentTarget(): " + EJS_currentTarget.title);
}

function EJS_getSelectedWin(){
	var mediator = Components.classes["@mozilla.org/rdf/datasource;1?name=window-mediator"].getService();
  	mediator.QueryInterface(Components.interfaces.nsIWindowDataSource);

  	var resource = EJS_cntTargetWinML.selectedItem.getAttribute('id')
  	return mediator.getWindowForResource(resource);
	
}

function EJS_executeJS(){
    var code = EJS_jsCodeField.value;
    EJS_commandHistory[EJS_currentCommandHistoryPos++]=code;
    try{
    	var result = EJS_currentTarget.eval(EJS_replaceShortcuts(code));    
    }catch(e){
        /*var m = ""
        for(i in e){
            m = m + i + ": " + e[i] + "\n"
        }
        alert(m);*/
        alert(e);
        EJS_jsCodeField.focus();
        return;
    }
    if(result==null){
    	EJS_appendToConsole("No result");
    }else if(result.tagName!=null){
	    EJS_appendToConsole(result + " [" + result.tagName + "]");
	}else{
		EJS_appendToConsole(result);
	}
    EJS_jsCodeField.focus();
    return result;
}

function EJS_replaceShortcuts(code){
    if(code==null || code=="")
        return;
    for(var i in EJS_shortcuts){
        var regexp = new RegExp("\\b"+i+"\\b", "ig");
        code = code.replace(regexp, EJS_shortcuts[i]);
    }
    return code;
}

function EJS_appendToConsole(string){
   var resultTB = document.getElementById("result");
   resultTB.value = (resultTB.value==""?"":(resultTB.value + "\n")) + string;
}

function EJS_clearResult(){
    document.getElementById("result").value="";
    document.getElementById("jsCode").select();
}

function EJS_saveFunction(){
    
    var fctName = document.getElementById("functionName").value;
    var fctString = document.getElementById("functionCode").value;

    //Parameter bestimmen
    var startIndex = fctString.indexOf("(")+1;
    var endIndex = fctString.indexOf(")");
    var paramString = fctString.substring(startIndex, endIndex);
    //Trimmen des Strings
    var trimRegEx = /(^\s*) | \s*$/g;
	var paramString = paramString.replace(trimRegEx, "");
	if(paramString.length!=0){
	    var params = paramString.split(",");
	}else{
	    var params = new Array();
	}
	
	//Body bestimmen
    var startIndex = fctString.indexOf("{")+1;
    var endIndex = fctString.lastIndexOf("}");
    var body = fctString.substring(startIndex, endIndex);
    
    //Array mit 10 Default-Parametern
    var newParams = new Array("param1", "param2", "param3", "param4", "param5", 
        "param6", "param7", "param8", "param9", "param10");
    
    for(var i=0; i<params.length; i++){
        newParams[i]=params[i];
    }
    
    EJS_currentTarget[fctName] = new Function(newParams[0], newParams[1], newParams[2], newParams[3], 
        newParams[4], newParams[5], newParams[6], newParams[7], newParams[8], newParams[9], body);
}

function EJS_printProperties(){
	EJS_appendToConsole("Properties for object:");
	var target = EJS_executeJS();
	EJS_printPropertiesForTarget(target)
}

function EJS_printPropertiesForTarget(target){
	var result = new Array();
	if(target.wrappedJSObject!=null){
		target = target.wrappedJSObject;
	}
	var index = 0;
	for(var i in target){
    	result[index++] = i + ": " + target[i];		
	}
	EJS_appendToConsole(result.join("\n"));
}

function EJS_nextCommandFromHistory(){
	if(EJS_currentCommandHistoryPos>=EJS_commandHistory.length-1)
		return;
	EJS_jsCodeField.value = EJS_commandHistory[++EJS_currentCommandHistoryPos];
}

function EJS_previousCommandFromHistory(){
	if(EJS_currentCommandHistoryPos==0)
		return;
	EJS_jsCodeField.value = EJS_commandHistory[--EJS_currentCommandHistoryPos];
}

function EJS_createMenuItem(id, aLabel, value) {
  const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
  var item = document.createElementNS(XUL_NS, "menuitem"); // create a new XUL menuitem
  item.setAttribute("label", aLabel);
  item.setAttribute("value", value);
  item.setAttribute("id", id);
  return item;
}

function EJS_searchFunctions(){
	var functionMenuList = document.getElementById("functionName");
	var searchString = functionMenuList.value.toLowerCase();
	functionMenuList.removeAllItems();
	var counter = 0;
	var exactMatch = null;
	for(var i in EJS_currentTarget){
		var member = EJS_currentTarget[i];
		if(typeof member == "function" &&
			i.toLowerCase().indexOf(searchString)!=-1){
				if(i.toLowerCase()==searchString){
					exactMatch=i;
				}			
				counter++;
				functionMenuList.appendItem(i, i);
		}
	}
	var fctCodeField = document.getElementById("functionCode")
	if(counter>1){
		setTimeout('document.getElementById("functionName").menupopup.showPopup();document.getElementById("functionName").inputField.focus()', 500);
		if(exactMatch!=null){
			fctCodeField.value = EJS_currentTarget[exactMatch];
		}
	}
	else if (counter==1){
		functionMenuList.selectedIndex = 0;
		fctCodeField.value = EJS_currentTarget[functionMenuList.value];
		fctCodeField.focus();
	}else{
		fctCodeField.value = "No match found"
	}
}

//Reopen win for debug purposes
function EJS_ReopenWin(){
	window.close()
	window.opener.open("chrome://executejs/content/executeJS.xul","commandwin", "chrome,width=850,height=450,resizable");
}

