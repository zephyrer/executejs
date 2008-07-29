/*
 * 
 * Common-Prefs Version 0.1 Created by Rudolf Noé 28.12.2007
 * 
 * Partly copied from pref-tabprefs.js (c) Bradley Chapman (THANKS!)
 */
(function() {

	// Attribute of a control under which key the preference should be stored
	var ControlUtils = {
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
				if (items[i].value == choiceElement.value) {
					choiceElement.selectedItem = items[i]
					choiceElement.value = value
					return items[i]
				}
			}
		}
	}

	var Namespace = rno_common.Namespace;
	Namespace
			.bindToNamespace(Namespace.COMMON_NS, "ControlUtils", ControlUtils);
})()