with(this){
(function(){
	DialogMode={
		MODAL:"MODAL",
		NON_MODAL:"NON_MONDAL"
	}
	this.DialogMode = Dialog;DialogMode
	
	DialogResult={
		OK:"OK",
		CANCEL:"CANCEL"
	}

	function Dialog(url, name, model, parentWin, features, argObj){
		this.url = url
		this.name = name
		this.model = model
		this.parentWin = parentWin
		this.features = features
		this.argObj = argObj
		this.listeners = new ArrayList()
		this.dialog = null
	}
	Dialog.prototype = {
		addEventListener: function(listener){
        this.listeners.add(listener) 			
		},
		
		informListeners: function(){
		   for (var i = 0; i < this.listeners.size(); i++) {
            if(this.dialogContext.result==DialogResult.OK && this.listeners.get(i).handleDialogAccept)
               this.listeners.get(i).handleDialogAccept(this.dialogContext.resultObj)
            else if(this.dialogContext.result==DialogResult.CANCEL && this.listeners.get(i).handleDialogCancel)
               this.listeners.get(i).handleDialogCancel(this.dialogContext.resultObj)
         }
		},
		
		setFeatures: function(features){
			this.features = features
		},
		
		open: function(){
			this.dialogContext = new DialogContext(this.argObj, {})
			this.dialog = partentWin.openDialog(this.url, this.name, (modal?"model=yes,":"") + this.features, this.dialogContext)
			if(modal){
				this.informListeners();
			}else{
				this.dialog.addEventListener("unload", Utils.bind(this.informListeners, this), true)
			}
		}
	}
	
	Dialog.getNamedArgument = function(key){
		return window.arguments[0].argObj[key]
	}
	
	Dialog.setResultOjb = function(obj){
		window.arguments[0].resultObj = obj
	}
	
	Dialog.setNamedResult = function(key, value){
		window.arguments[0][key]=value
	}
	
	function DialogContext(argObj, resultObj){
		this.argObj = argObj
		this.resultObj = resultObj
		this.result = DialogResult.CANCEL
	}
   
	
	this.Dialog = Dialog;
}).apply(this)
}