(function(){
   const JS_SCRIPT_LOADER = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].
                     getService(Components.interfaces.mozIJSSubScriptLoader)
	const CHROME_REGISTRY = Components.classes["@mozilla.org/chrome/chrome-registry;1"].
                     getService(Components.interfaces.nsIChromeRegistry)
	const IO_SERVICE = Components.classes["@mozilla.org/network/io-service;1"].
                     getService(Components.interfaces.nsIIOService)

   function ScriptLoader(chromeBase){
		this.chromeBase = this.assureEndingSlash(chromeBase)
   	this.fileIO = null
	}
		
	ScriptLoader.prototype ={
		assureEndingSlash: function(path){
			if(path==null || path=="")
			   return ""
			return path.lastIndexOf("/")==path.length-1?path:path+"/"
		},
		
		loadAllCommon: function(relativePath, scopeObj){
			this.setGlobalNamespaceObj(scopeObj)
			if(this.fileIO==null){
			   this.loadScript(this.chromeBase + this.assureEndingSlash(relativePath) + "file_io.js", scopeObj)
			   this.fileIO = scopeObj.FileIO
			}
         var chromeBaseUri = IO_SERVICE.newURI(this.chromeBase, null, null)
         var chromeBaseFullUri = CHROME_REGISTRY.convertChromeURL(chromeBaseUri)
         var chromeBaseFile = chromeBaseFullUri.QueryInterface(Components.interfaces.nsIFileURL).file; 
         var dirIO = scopeObj.DirIO
         var files = dirIO.read(chromeBaseFile)
         for (var i = 0; i < files.length; i++) {
         	var fullPath = files[i].target
         	if(fullPath.lastIndexOf(".js")!=fullPath.length-3)
         	   continue
         	this.loadScript(this.chromeBase + files[i].leafName, scopeObj)
         }
			this.setGlobalNamespaceObj(null)
		},
		
		loadScript: function(url, scopeObj){
         JS_SCRIPT_LOADER.loadSubScript(url, scopeObj);
      },
      
      loadSingleScript: function(pathFromBase, scopeObj){
      	this.setGlobalNamespaceObj(scopeObj)
      	this.loadScript(this.chromeBase + pathFromBase, scopeObj)
      	this.setGlobalNamespaceObj(null)
      },
      
      path : function(file) {
			return 'file:///'+ file.path.replace(/\\/g, '\/').replace(/^\s*\/?/, '').replace(/\ /g, '%20');
		},
		
		setGlobalNamespaceObj: function(namespaceObj){
		   DE_MOUSELESS_EXTENSION_NS = namespaceObj	
		}
	}

	DE_MOUSELESS_EXTENSION_NS["ScriptLoader"] = ScriptLoader;
})()