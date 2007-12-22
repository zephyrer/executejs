(function(){
	var Listbox = {
		getItems: function(listbox){
			return listbox.getElementsByTagName("listitem");
		},
		
		appendMultiColumnItem: function(listbox, labelArray, valueArray, listItemValue){
			if(labelArray.length!=valueArray.length)
				throw new Error("Listbox.appendMultiColumnItem: labelArray and valueArray do not have the sam length")
			var newItem = document.createElementNS(XUL_NS, "listitem");
			if(listItemValue!=null){
				newItem.setAttribute("value", listItemValue)
			} 
			for(var i=0; i<labelArray.length; i++){
				var listcell = document.createElementNS(XUL_NS, "listcell")
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