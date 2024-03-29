/*
 * Utiltily functions
 */
(function(){
	var Utils = {
		VERSION: "0.1",
	
		/*
		 * Logs message to Console services
		 * @param messageString: string to log 
		 */
		logMessage: function (messageString) {
		    var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
		                   .getService(Components.interfaces.nsIConsoleService);
		    consoleService.logStringMessage(messageString);
		},
		
		/*
		 * Log error to Console services
		 * @param error: error-obj to log
		 */
		logError: function(error){
		    var errorMessage = "";
		    for(e in error){
		        errorMessage = errorMessage + e + ": " + error[e] + "\n";
		    }
		    this.logMessage(errorMessage);
		},
		
		/*
		 * Checks whether "object" is instance of the "constructor"
		 * @returns boolean
		 */
		instanceOf: function (object, constructor) {
		   while (object != null) {
		      if (object == constructor.prototype)
		         return true;
		      object = object.__proto__;
		   }
		   return false;
		},
		
		getInstallLocation: function(){
         var dir = Components.classes['@mozilla.org/file/directory_service;1']
                        .createInstance(Components.interfaces.nsIProperties)
                        .get('ProfD', Components.interfaces.nsIFile)
        dir.append("extensions")
        return dir
		},
		
		/*
		 * Returns the service object for the specified component and interface
		 * @param componentName: Name of the component e.g. "@mozilla.org/consoleservice;1"
		 * @param interfaceName: Name of the interface e.g. "nsIConsoleService"
		 * @returns service object
		 */
		getService: function(componentName, interfaceName){
			return Components.classes[componentName].
				getService(Components.interfaces[interfaceName]);
			
		},

		/*
		 * Copies provided string to the clipboard where is it accessible for 
		 * paste. It needs a short amount of time until the string is available in the clipboard
		 * @param string: string which is copied to clipboard
		 */
	    copyToClipboard: function(string){
	    	var clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"] 
	    				.getService(Components.interfaces.nsIClipboardHelper); 
			clipboardHelper.copyString(string);
	    },
	    
	    /*
	     * Registers observerObj for the provided id as an observer
	     * @param observerKey: id for which the observer will be notified
	     * @param observerObj: observer object which implements the Components.interfaces.nsIObserver
	     * inteface
	     */
	    registerObserver: function(observerKey, observerObj){
		    var observerService = Components.classes["@mozilla.org/observer-service;1"].
		        getService(Components.interfaces.nsIObserverService);
		    observerService.addObserver(observerObj, observerKey, true);
	    },
	    
	    /*
	     * Creates observer object
	     * @param observeFunc: pointer to the function which is called on notification
	     * @returns Observer-object which implements the Components.interfaces.nsIObserver interface
	     */
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
		},
		
		/*
		 * Notifies all observers listen to the provided observerId
		 * @param observerId
		 */
		notifyObservers: function(observerId){
		    var observerService = Components.classes["@mozilla.org/observer-service;1"].
		        getService(Components.interfaces.nsIObserverService);
		    observerService.notifyObservers ( null , observerId , null);
		}
		
	}
	
	var NS = rno_common.Namespace
	NS.bindToNamespace(NS.COMMON_NS, "Utils", Utils);
	
})()

