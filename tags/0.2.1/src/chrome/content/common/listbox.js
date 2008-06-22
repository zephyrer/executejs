/*
 * Version 0.1
 * Created by Rudolf Noé
 * 28.12.2007
 *
 * Helper functions related to Listboxes
 * As the XBL-extension of listboxes is buggy this solution was choosen
 */
(function(){
	var Constants = rno_common.Constants
	var Listbox = {
		VERSION: "0.2",
		
		/* 
		 * Returns NodeList of listitems of a listbox
		 * @param listbox object
		 * @returns NodeList of listitem-objects
		 */
		getItems: function(listbox){
			return listbox.getElementsByTagName("listitem");
		},
		
		/*
		 * Appends a row to a mulicolumn listbox
		 * @param listbox: listbox object
		 * @Param labelArray (mand): array of labels, for each column one entry
		 * @Param valueArray (mand): array of values, for each column one entry
		 * @param listItemValue (option): value of the newly created listitem
		 */
		appendMultiColumnItem: function(listbox, labelArray, valueArray, listItemValue){
			if(labelArray.length!=valueArray.length)
				throw new Error("Listbox.appendMultiColumnItem: labelArray and valueArray do not have the sam length")
			var newItem = document.createElementNS(Constants.XUL_NS, "listitem");
			if(listItemValue!=null){
				newItem.setAttribute("value", listItemValue)
			} 
			for(var i=0; i<labelArray.length; i++){
				var listcell = document.createElementNS(Constants.XUL_NS, "listcell")
				listcell.setAttribute("label", labelArray[i])
				listcell.setAttribute("value", valueArray[i])
				newItem.appendChild(listcell)
			}
			listbox.appendChild(newItem)
			return newItem
		},		
	}
	var NS = rno_common.Namespace;
	NS.bindToNamespace(NS.COMMON_NS, "Listbox", Listbox);
	
})()