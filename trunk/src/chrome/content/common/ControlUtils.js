/*
 * 
 * Common-Prefs Version 0.1 Created by Rudolf Noé 28.12.2007
 * 
 * Partly copied from pref-tabprefs.js (c) Bradley Chapman (THANKS!)
 */
(function() {
   var Constants = DE_MOUSELESS_EXTENSION_NS.Constants
   
	// Attribute of a control under which key the preference should be stored
	var ControlUtils = {
		/*
		 * Appends menuitem to menulist
		 */
		appendItemToMenulist: function(menulist, label, value){
			if(menulist==null || label==null || value==null){
			   throw new Error("Arguments must not be null")
			}
		   var newItem = document.createElementNS(Constants.XUL_NS, "menuitem");
         newItem.setAttribute('label', label)
         newItem.setAttribute('value', value)
         menulist.menupopup.appendChild(newItem)
		},
		
		clearMenulist: function(menulist){
		   var menupopup = menulist.menupopup
		   while(menupopup.hasChildNodes()){
		   	menupopup.removeChild(menupopup.firstChild)
		   }
		},
		
		/*
		 * Adds menuitems for a array of labels and values, 
		 * Only new items with different values will be added 
		 * @param in menulist menulist
		 * @param in String[] labelArray
		 * @param in String[] valueArray
		 */
		appendItemsToMenulist: function(menulist, labelArray, valueArray){
		   var itemsMap = new Map()
		   var menuitems = menulist.getElementsByTagName('menuitem')
		   for (var i = 0; i < menuitems.length; i++) {
		   	itemsMap.put(menuitems[i].value)
		   }
		   for (var i = 0; i < labelArray.length; i++) {
		   	var value = valueArray[i]
		   	if(itemsMap.containsKey(value))
		   	   continue
		   	menulist.appendItem(labelArray[i], value, null)
		   }
		},
		
		/*
		 * Selects item of menulist by its value and returns the item 
		 */
		selectMenulistByValue : function(menulist, value) {
			this.selectChoiceElementByValue(menulist, "menuitem", value)
		},
		
		selectRadiogroupByValue: function(radiogroup, value){
			this.selectChoiceElementByValue(radiogroup, "radio", value)
		},
		
		selectChoiceElementByValue: function(choiceElement, childrenTagName, value){
			var items = choiceElement.getElementsByTagName(childrenTagName);
			for (var i = 0; i < items.length; i++) {
				if (items[i].value == value) {
					choiceElement.selectedItem = items[i]
					choiceElement.value = value
					return items[i]
				}
			}
		},
		
	}
	DE_MOUSELESS_EXTENSION_NS["ControlUtils"]= ControlUtils;
})()