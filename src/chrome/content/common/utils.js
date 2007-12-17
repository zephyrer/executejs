(function(){
	var Utils = {
    prefs: Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefBranch),

    getCharPref: function(key){
        return this.prefs.prefHasUserValue(key)?this.prefs.getCharPref(key):null;
    },
    
    getBoolPref: function(key){
        return this.prefs.prefHasUserValue(key)?this.prefs.getBoolPref(key):false;
    },

    hasUserPref: function(key){
    	return this.prefs.prefHasUserValue(key);
   	},
   	setCharPref: function(key, value){
   		this.prefs.setCharPref(key, value);
   	},
   
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
        Utils.logMessage(errorMessage);
    },

	getContentDir: function() {
	  var reg = Components.classes["@mozilla.org/chrome/chrome-registry;1"]
	                      .getService(Components.interfaces.nsIChromeRegistry);
	
	  var ioSvc = Components.classes["@mozilla.org/network/io-service;1"]
	                        .getService(Components.interfaces.nsIIOService);
	
	  var proto = Components.classes["@mozilla.org/network/protocol;1?name=file"]
	                        .getService(Components.interfaces.nsIFileProtocolHandler);
	
	  var chromeURL = ioSvc.newURI("chrome://shortcutseverywhere/content", null, null);
	  var fileURL = reg.convertChromeURL(chromeURL);
	  var file = proto.getFileFromURLSpec(fileURL.spec).parent;
	
	  return file
	},
	
	createNamespace: function(namespace){
		var names = namespace.split('.');
		var obj = window;
		for (key in names){
			var name = names[key];
			if(obj[name] == undefined){
				obj[name] = new Object();
			}
			obj = obj[name];
		}
		return obj;
	},
    
    bindToNamespace: function(namespace, name, module){
    	if(module==null){
    		throw Error("SEW: Utils.bindToNamespace: Param module must not be null");
    	}
    	var namespaceObj = this.createNamespace(namespace);
    	namespaceObj[name] = module;
	
	},
	
	byId: function(elementId){
		return document.getElementById(elementId)
	},
		
	instanceOf: function (object, constructor) {
	   while (object != null) {
	      if (object == constructor.prototype)
	         return true;
	      object = object.__proto__;
	   }
	   return false;
	}

	}
	
	Utils.bindToNamespace("rno", "Utils", Utils);
	
})()

