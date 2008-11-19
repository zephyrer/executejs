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

var EJS_currentTargetWin = null;
var EJS_currentTargetObj = null;
var EJS_commandHistory = new Array();
var EJS_currentCommandHistoryPos = 0;
var EJS_allOpenWins = new Object();

//Form elements
var EJS_cntTargetWinML = null;
var EJS_cntContentWinCB = null;
var EJS_cntTargetObjectTB = null;
var EJS_cntJsCode = null;
var EJS_cntFunctionNameML = null;
var EJS_pupCodeCompletion = null;
var EJS_pupCommandAbbr = null;

//Map containing the command abbreviations
var EJS_commandAbbrs = new Object()

function EJS_byId(id){
	return document.getElementById(id);
}

function EJS_doOnload(){
    try{
	    EJS_initGlobVars();
	    EJS_initShortCuts();
	    EJS_initCommandAbbrs();
	    EJS_initObserver();
	    EJS_cntJsCode.focus();
    }catch(e){
    	alert(e)
    	throw e
    }
}

function EJS_initShortCuts(){
	ShortCutManager.addJsShortCutForElement("jsCode", KeyboardEvent.DOM_VK_RETURN, ShortCutManager.CTRL, "EJS_executeJS()");
	ShortCutManager.addJsShortCutForElement("jsCode", KeyboardEvent.DOM_VK_DOWN, ShortCutManager.CTRL, "EJS_nextCommandFromHistory()");
	ShortCutManager.addJsShortCutForElement("jsCode", KeyboardEvent.DOM_VK_UP, ShortCutManager.CTRL, "EJS_previousCommandFromHistory()");
	ShortCutManager.addJsShortCutForElement("jsCode", KeyboardEvent.DOM_VK_SPACE, ShortCutManager.CTRL_SHIFT, "EJS_commandAbbreviations()");
	ShortCutManager.addJsShortCutForElement("jsCode", KeyboardEvent.DOM_VK_SPACE, ShortCutManager.CTRL, "EJS_codeCompletion()");
	ShortCutManager.addJsShortCutForElement("functionName", 13, ShortCutManager.NONE, "EJS_searchFunctions()");
}

function EJS_initGlobVars(){
	EJS_cntTargetWinML = EJS_byId("targetWin")
	EJS_cntContentWinCB = EJS_byId("contentWinCB")
	EJS_cntTargetObjectTB = EJS_byId("targetObj")
	EJS_cntJsCode = EJS_byId("jsCode")
	EJS_cntFunctionNameML = EJS_byId("functionName")
	EJS_pupCodeCompletion = EJS_byId("pupCodeCompletion")
	EJS_pupCommandAbbr = EJS_byId("pupCommandAbbr")
	EJS_cntTargetWinML.selectedIndex = 1;
	EJS_targetWinChanged();
	EJS_targetObjChanged();
	EJS_commandHistory = executejs.ConfigManager.readHistory();
	EJS_currentCommandHistoryPos = EJS_commandHistory.length
}

function EJS_initCommandAbbrs(){
	while(EJS_pupCommandAbbr.childNodes.length>0){
		EJS_pupCommandAbbr.removeChild(EJS_pupCommandAbbr.firstChild)
	}
	EJS_commandAbbrs = new Object()
	var commandAbbrs = rno_common.Prefs.getPrefsForListbox(executejs.EjsCommon.EJS_PREF_COMMAND_ABBR)
	for(var i=0; i<commandAbbrs.length; i++) {
		//add menuitem
		var commandAbbrEntry = commandAbbrs[i]
		var menuitem = document.createElement("menuitem")
		menuitem.setAttribute("label", commandAbbrEntry[0] + " - " + commandAbbrEntry[1])
		menuitem.setAttribute("value", commandAbbrEntry[0])
		menuitem.addEventListener("command", EJS_commitContextMenu, true)
		EJS_pupCommandAbbr.appendChild(menuitem)
		
		//add command abbreviation
		EJS_commandAbbrs[commandAbbrEntry[0]]=commandAbbrEntry[1]
	}
}

function EJS_initObserver(){
	EJS_prefObserver = rno_common.Utils.createObserver(EJS_initAfterPrefChange);
	rno_common.Utils.registerObserver(executejs.EjsCommon.EJS_PREF_OBSERVER, EJS_prefObserver)
}

function EJS_targetWinChanged(){
	//Set current target
  	EJS_currentTargetWin = EJS_getSelectedWin();
  	if(EJS_currentTargetWin.getBrowser!=null){
  		EJS_cntContentWinCB.disabled=false
  	}else if(EJS_currentTargetWin.getBrowser==null){
  		EJS_cntContentWinCB.disabled=true
	}
	EJS_targetObjChanged()
	//Todo
//	Components.utils.reportError("EJS_targetWinChanged(): " + EJS_currentTargetWin + ": " + 
	//	EJS_currentTargetWin.document.title);
}

function EJS_targetObjChanged() {
	//Check whether object valid
	var objString = EJS_cntTargetObjectTB.value
	EJS_cntTargetObjectTB.inputField.style.backgroundColor=""
	EJS_currentTargetObj = null
	if(objString.length>0){
		try {
			EJS_currentTargetObj = EJS_evalStringOnTarget(EJS_cntTargetObjectTB.value)
		}catch(e){}
		if(EJS_currentTargetObj==null){
			EJS_currentTargetObj=null
			EJS_cntTargetObjectTB.inputField.style.backgroundColor="#FF5F3F"
		}
	}else if(EJS_cntContentWinCB.checked==true && EJS_cntContentWinCB.disabled==false){
		EJS_currentTargetObj=EJS_currentTargetWin.getBrowser().contentWindow.wrappedJSObject
	}else{
		EJS_currentTargetObj=EJS_currentTargetWin
	}
}

function EJS_getSelectedWin(){
	var mediator = Components.classes["@mozilla.org/rdf/datasource;1?name=window-mediator"].getService();
  	mediator.QueryInterface(Components.interfaces.nsIWindowDataSource);
  	var resource = EJS_cntTargetWinML.selectedItem.getAttribute('id')
  	return mediator.getWindowForResource(resource);
}

function EJS_commitContextMenu(event){
   var valueToInsert = event.target.value
	var selectionEnd = EJS_cntJsCode.selectionStart + valueToInsert.length;
	var currentValue = EJS_cntJsCode.value;
	var beforeText = currentValue.substring(0, EJS_cntJsCode.selectionStart);
	var afterText = currentValue.substring(EJS_cntJsCode.selectionEnd,
			currentValue.length);

	EJS_cntJsCode.value = beforeText + valueToInsert + afterText;
	EJS_cntJsCode.focus();

	// put the cursor after the inserted text
	EJS_cntJsCode.setSelectionRange(selectionEnd, selectionEnd);
   //rno_common.Utils.copyToClipboard(event.target.value)
	//Timeout needed otherwise clipboard isn't filled yet
	//setTimeout("EJS_cntJsCode.editor.paste(1)", 100);	
}

function EJS_executeJS(){
    var code = EJS_cntJsCode.value;
    if(EJS_currentCommandHistoryPos==EJS_commandHistory.length-1){
    	EJS_currentCommandHistoryPos++
    }
    EJS_commandHistory[EJS_currentCommandHistoryPos]=code;
    try{
    	var result = EJS_evalStringOnTarget(code)    
    }catch(e){
        alert(e);
        EJS_cntJsCode.focus();
        return;
    }
    if(result==null){
    	EJS_appendToConsole("No result");
    }else if(result.tagName!=null){
	    EJS_appendToConsole(result + " [" + result.tagName + "]");
	}else{
		EJS_appendToConsole(result);
	}
    EJS_cntJsCode.focus();
    return result;
}

function EJS_evalStringOnTarget(string){
	var evalString = EJS_replaceShortcuts(string);
	var contentWin = null
	if(EJS_cntContentWinCB.checked==true && EJS_cntContentWinCB.disabled==false){
      var win = EJS_currentTargetWin.content.wrappedJSObject
      var sb = new Components.utils.Sandbox(win)
      sb.window = win
      return Components.utils.evalInSandbox("with(window){" + evalString + "}", sb)
	}else{
      return EJS_currentTargetWin.eval(evalString)
	}	
}

function EJS_replaceShortcuts(code){
    if(code==null || code=="")
        return;
    for(var i in EJS_commandAbbrs){
        var regexp = new RegExp("\\b"+i+"\\b", "ig");
        code = code.replace(regexp, EJS_commandAbbrs[i]);
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
    
    EJS_currentTargetObj[fctName] = new Function(newParams[0], newParams[1], newParams[2], newParams[3], 
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
		//try catch as error could occur, but why???
		try{
    		result[index++] = i + ": " + target[i];
		}catch(e){}		
	}
	EJS_appendToConsole(result.join("\n"));
}

function EJS_nextCommandFromHistory(){
	if(EJS_currentCommandHistoryPos>=EJS_commandHistory.length-1)
		return;
	EJS_cntJsCode.value = EJS_commandHistory[++EJS_currentCommandHistoryPos];
}

function EJS_previousCommandFromHistory(){
	if(EJS_currentCommandHistoryPos==0)
		return;
	EJS_cntJsCode.value = EJS_commandHistory[--EJS_currentCommandHistoryPos];
}

function EJS_createMenuItem(id, aLabel, value) {
  var item = document.createElementNS(rno_common.Constants.XUL_NS, "menuitem"); // create a new XUL menuitem
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
	for(var i in EJS_currentTargetObj){
		try{
			var member = EJS_currentTargetObj[i];
		}catch(e){
			continue
		}
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
			fctCodeField.value = EJS_currentTargetObj[exactMatch];
		}
	}
	else if (counter==1){
		functionMenuList.selectedIndex = 0;
		fctCodeField.value = EJS_currentTargetObj[functionMenuList.value];
		fctCodeField.focus();
	}else{
		fctCodeField.value = "No match found"
	}
}

function EJS_doOnUnload(){
	var maxHistSize = rno_common.Prefs.getCharPref(executejs.EjsCommon.EJS_PREF_MAX_HIST_PERS_SIZE)
	var startIndex = Math.max(0, EJS_commandHistory.length-maxHistSize)
	EJS_commandHistory = EJS_commandHistory.slice(startIndex)
	executejs.ConfigManager.saveHistory(EJS_commandHistory);
}

function EJS_commandAbbreviations(){
	var bo = EJS_cntJsCode.boxObject;
	EJS_pupCommandAbbr.showPopup(EJS_cntJsCode,bo.screenX+bo.width,bo.screenY, "popup")
}

function EJS_codeCompletion(){
	//Remove old items
	var childs = EJS_pupCodeCompletion.childNodes
	while (childs.length>0) {
		EJS_pupCodeCompletion.removeChild(EJS_pupCodeCompletion.firstChild)
	}
	var selection = EJS_cntJsCode.editor.selection
	var focusNodeText = selection.focusNode.nodeValue
	if(focusNodeText==null){
		return
	}
	var focusOffset = selection.focusOffset
	var evalString = focusNodeText.substring(0,focusOffset)
	var lastSpaceIndex = evalString.lastIndexOf(" ");
	var lastDotIndex = evalString.lastIndexOf(".")
	var objString = evalString.substring(lastSpaceIndex+1, lastDotIndex)
	if(lastDotIndex!=-1){
		var attrPrefix = evalString.substring(lastDotIndex+1)
	}else{
		var attrPrefix = evalString
	}
	var error = false
	if(objString==""){
		var evalObj = EJS_currentTargetWin
	}else{
		try{
		var evalObj = EJS_evalStringOnTarget(objString)
		}catch(e){
			EJS_appendToConsole(e.message)
			return
		}
	}
	//2 dim: label, value
	var menuArray = new Array()
	var i = 0;
	for(prop in evalObj) {
		if(attrPrefix.length!=0 && prop.indexOf(attrPrefix)!=0){
			continue;
		}
		var miLabel = prop
		try{
			if(typeof evalObj[prop] == "function"){
				miLabel += "()"
			}
		}catch(e){
			//on props error occurs on typeof operator!!
		}
		var miValue = miLabel				
		if(attrPrefix.length>0){
			//Shorten for later pasting into textbox
			miValue = miLabel.substring(attrPrefix.length)
		}
		menuArray[i] = [miLabel, miValue]
		i++
	}
	menuArray.sort()
	for(var i=0; i<menuArray.length; i++) {
		var mi = document.createElement("menuitem")
		mi.setAttribute("label", menuArray[i][0])
		mi.setAttribute("value", menuArray[i][1])
		mi.addEventListener("command", EJS_commitContextMenu, true)
		EJS_pupCodeCompletion.appendChild(mi)
	}
	if(EJS_pupCodeCompletion.childNodes.length==0){
		var mi = document.createElement("menuitem")
		mi.setAttribute("label", "Nothing found")
		EJS_pupCodeCompletion.appendChild(mi)
	}
	var bo = EJS_cntJsCode.boxObject;
	EJS_pupCodeCompletion.showPopup(EJS_cntJsCode,bo.screenX+bo.width,bo.screenY, "popup")
}

function EJS_openConfig(){
	openDialog(executejs.EjsCommon.EJS_CHROME_URL+"prefs.xul", "prefs", "chrome, modal, centerscreen")
}

//Reopen win for debug purposes
function EJS_ReopenWin(){
	window.close()
	window.opener.open(executejs.EjsCommon.EJS_CHROME_URL+"executeJS.xul","commandwin", "chrome,width=850,height=450,resizable");
}

//Reopen win for debug purposes
function EJS_ReloadScripts(){
	RNO_loadScript("chrome://executejs/content/executejs/ejs_common.js")	
}

function EJS_initAfterPrefChange(){
	EJS_initCommandAbbrs();
}

function EJS_openHelp(event){
	var browser = window.opener.getBrowser()
	browser.selectedTab = browser.addTab("http://www.mouseless.de/index.php?/content/view/18/31/")
	window.opener.focus()		
}