(function(){
	function Map(){
		this.map = new Object()
	}
	
	Map.prototype = {
		constructor: Map,
		clear: function(){
		   for(var key in this.map){
		   	delete this.map[key]
		   }
		},
		
		containsKey: function(key){
		   return this.map.hasOwnProperty(key)	
		},
		
		containsValue: function(obj){
			for (var key in this.map){
				if(this.map[key]==obj){
					return true
				}
			}
			return false
		},
		
		get: function(key){
			return this.map[key]
		},
		
		keys: function(){
			var arr = new Array()
			for(var key in this.map){
				arr.push(key)
			}
			return arr
		},
		
		put: function(key, value){
			this.map[key] = value
		},
		
		remove: function(key){
			var result = this.map[key]
			delete this.map[key]
			return result
		},
		
		values: function(){
         var arr = new Array()
         for(var key in this.map){
            arr.push(this.map[key])
         }
         return arr
		}
		
		
	}

	DE_MOUSELESS_EXTENSION_NS["Map"] = Map;
})()