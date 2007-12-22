/*
 * Namespace functionality
 */
(function(){
	var Namespace = {
		COMMON_NS: "rno_common",
		 
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
	    		throw Error("namespace.js: Namespace.bindToNamespace: Param module must not be null");
	    	}
	    	var namespaceObj = this.createNamespace(namespace);
	    	namespaceObj[name] = module;
		
		}
	}
	
	Namespace.bindToNamespace(Namespace.COMMON_NS, "Namespace", Namespace);
})()