(function() {

	var PrefUtils = {
		HELP_ID_ATTR : "helpid",

		initElementHelp : function(stringbundleId, descriptionTextboxId) {
			var eventHandler = {
				stringbundle: document.getElementById(stringbundleId),
				descriptionTB: document.getElementById(descriptionTextboxId),
				handleEvent : function(event) {
					target = document.commandDispatcher.focusedElement
					if (!target || !target.tagName == null) {
						return
					}
					if(target.tagName=="html:input" || target.tagName=="html:textarea" ){
						target = target.parentNode.parentNode
					}
					var helptext = this.getHelpTextForElement(target)
					if(target.selectedIndex!=null && target.selectedIndex!=-1){
						var selectedItem = target.selectedItem
						var helptextSelectedItem = this.getHelpTextForElement(selectedItem)
						if(helptextSelectedItem!=""){
							helptext = helptextSelectedItem
						}
					}
					this.descriptionTB.value = helptext
				},
				
				getHelpTextForElement: function(element){
					var helpid = this.getHelpId(element)
					if(helpid==null){
					    return "" 
					}else{
						return this.getString(helpid)
					}
				},
				
				getHelpId: function(element){
               if (element.hasAttribute(PrefUtils.HELP_ID_ATTR)) {
                  return element.getAttribute(PrefUtils.HELP_ID_ATTR)
               } else if (element.hasAttribute("prefid")) {
                  return element.getAttribute("prefid")+".help"
               }
               return null;
				},
				
				getString: function(key){
               try {
                  var string = this.stringbundle.getString(key)
               } catch (e) {
                  return ""
               }
               return string
				}
			}
			addEventListener("focus", eventHandler, true);
			addEventListener("select", eventHandler, true);
		}
	}

	var Namespace = rno_common.Namespace;
	Namespace.bindToNamespace(Namespace.COMMON_NS, "PrefUtils", PrefUtils);
})()