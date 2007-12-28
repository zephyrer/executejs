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
	byId("commandAbbrLB").addEventListener("select", EJS_commandAbbrSelChanged, true)
}

function saveUserPrefs(){
	rno_common.Prefs.savePrefs(document);
	rno_common.Utils.notifyObservers(executejs.EjsCommon.EJS_PREF_OBSERVER);
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
		if(listitem.firstChild.getAttribute("value")==commandAbbr){
			newListitem=listitem
			break;
		}
	}
	if(newListitem==null){
		var newListitem = Listbox.appendMultiColumnItem(commandAbbrLB, [commandAbbr, command], 
			[commandAbbr, command])
	}else{
		var commandListcell = newListitem.childNodes.item(1)
		commandListcell.setAttribute("label", command)
		commandListcell.setAttribute("value", command)
	}
}

function EJS_removeCommandAbbr(){
	var commandAbbrLB = byId("commandAbbrLB")
	commandAbbrLB.removeItemAt(commandAbbrLB.selectedIndex);	
}

function EJS_move(direction){
	var commandAbbrLB = byId("commandAbbrLB")
	var selIndex = commandAbbrLB.selectedIndex
	var itemToMove = commandAbbrLB.selectedItem
	if(itemToMove==null){
		return
	}
	if(direction=="up"){
		var refItem = commandAbbrLB.getPreviousItem(itemToMove, 1)
	}else{
		var refItem = commandAbbrLB.getNextItem(itemToMove,1) 
	}
	if(refItem==null){
		return 
	}
	itemToMove = commandAbbrLB.removeItemAt(selIndex)
	if(direction=="up"){
		itemToMove = commandAbbrLB.insertBefore(itemToMove, refItem)
	}else{
		refItem = commandAbbrLB.getNextItem(refItem,1)
		if(refItem==null){
			commandAbbrLB.appendChild(itemToMove)
		}else{
			itemToMove = commandAbbrLB.insertBefore(itemToMove, refItem)
		}
	}
	commandAbbrLB.selectItem(itemToMove)
	commandAbbrLB.focus()
}

function EJS_commandAbbrSelChanged(){
	var commandAbbrLB = byId("commandAbbrLB")
	var selItem = commandAbbrLB.selectedItem
	if(selItem==null){
		return
	}
	var abbr = selItem.firstChild.getAttribute("value");
	byId("commandAbbrTB").value=abbr
	var command = selItem.childNodes.item(1).getAttribute("value")
	byId("commandTB").value = command
}