(function(){
	PromptReply = {
		YES: 0,
		NO: 1
	}
	DE_MOUSELESS_EXTENSION_NS["PromptReply"] = PromptReply;
	
	var PromptService = {
		promptService: Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                        .getService(Components.interfaces.nsIPromptService),
      
      confirmYesNo: function(parent, title, message){
         var check = {value: false};
         return this.promptService.confirmEx(parent, title, message, 
            this.promptService.STD_YES_NO_BUTTONS,null,null,null,null,check)
      }
	}

	DE_MOUSELESS_EXTENSION_NS["PromptService"] = PromptService;
})()