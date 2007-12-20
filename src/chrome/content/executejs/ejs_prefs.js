/* 

  Common-Prefs
  Version 0.1
  Created by Rudolf Noé
  01.12.2005
  
  Borrowed from pref-tabprefs.js (c) Bradley Chapman (THANKS!)
*/
function byId(id){
	return document.getElementById(id)	
}

function doOnload(){
	rno_common.Prefs.loadPrefs(document);
}

function saveUserPrefs(){
	rno_common.Prefs.savePrefs(document);
	rno_common.Prefs.notifyObservers("EJS-PrefChange");
}

function EJS_applyCommandAbbr(){
	var Listbox = rno_common.Listbox;
	var command = byId("commandTB").value
	var commandAbbr = byId("commandAbbrTB").value
	var commandAbbrLB = byId("commandAbbrLB")
	var items = Listbox.getItems(commandAbbrLB);
	var newListitem = null;
	for(var i=0; i<items.length; i++) {
		var listitem = items.item(i)
		if(listitem.commandAbbr==commandAbbr){
			newListitem=listitem
			break;
		}
	}
	if(newListitem==null){
		var newListitem = Listbox.appendMultiColumnItem(commandAbbrLB, [commandAbbr, command], 
			[commandAbbr, command])
		newListitem.commandAbbr=commandAbbr
	}else{
		var commandListcell = newListitem.childNodes.item(1)
		commandListcell.setAttribute("label", command)
	}
	newListitem.setAttribute("value", commandAbbr+EJS_COMMAND_ABBR_SEPARATOR+command)
}

function EJS_removeCommandAbbr(){
	var commandAbbrLB = byId("commandAbbrLB")
	commandAbbrLB.removeItemAt(commandAbbrLB.selectedItem);	
}

