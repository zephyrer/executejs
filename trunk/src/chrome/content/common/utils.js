(function(){
	var Utils = {
		logMessage: function (aMessage) {
		    var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
		                   .getService(Components.interfaces.nsIConsoleService);
		    consoleService.logStringMessage(aMessage);
		},
		
		logError: function(error){
		    var errorMessage = "";
		    for(e in error){
		        errorMessage = errorMessage + e + ": " + error[e] + "\n";
		    }
		    this.logMessage(errorMessage);
		},
		
		instanceOf: function (object, constructor) {
		   while (object != null) {
		      if (object == constructor.prototype)
		         return true;
		      object = object.__proto__;
		   }
		   return false;
		},
		
		getInstallLocation: function(chromeUrl){
			var extManager = this.getService("@mozilla.org/extensions/manager;1", "nsIExtensionManager");
			return extManager.getInstallLocation(chromeUrl).location
		},
		
		getService: function(componentName, interfaceName){
			return Components.classes[componentName].
				getService(Components.interfaces[interfaceName]);
			
		},

	    isTagName: function(element, tagName){
	        if(!element || !element.tagName)
	            return false;
	        return element.tagName.toUpperCase()==tagName.toUpperCase();
	    },
	    
	    isEmptyTextNode: function(element){
	        if(element.nodeType==Node.TEXT_NODE && element.nodeValue=="")
	            return true
	        else
	            return false;
	    },
	    
	    copyToClipboard: function(string){
	    	var clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"] 
	    				.getService(Components.interfaces.nsIClipboardHelper); 
			clipboardHelper.copyString(string);
	    },
	    
	    registerObserver: function(observerKey, observerObj){
		    var observerService = Components.classes["@mozilla.org/observer-service;1"].
		        getService(Components.interfaces.nsIObserverService);
		    observerService.addObserver(observerObj, observerKey, true);
	    },
	    
	    createObserver: function(observeFunc){
	    	var observer = new Object();
	    	observer.QueryInterface = function(iid) {
				if (!iid.equals(Components.interfaces.nsISupports)
						&& !iid.equals(Components.interfaces.nsISupportsWeakReference)
						&& !iid.equals(Components.interfaces.nsIObserver)) {
					throw Components.results.NS_ERROR_NO_INTERFACE; }
				return this;
		    }
		    observer.observe = observeFunc
		    return observer;
		}
	}
	
	var NS = rno_common.Namespace
	NS.bindToNamespace(NS.COMMON_NS, "Utils", Utils);
	
})()

