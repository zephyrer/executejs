with(this){
/**
 * Contain string utility methodes
 */
(function(){
   
   var StringUtils = {
   	digitRegEx: /^\d*$/,
   	
   	isDigit: function(string){
   		return this.digitRegEx.test(string)   		
   	},
   	
   	isEmpty: function(string){
   		return string==null || string.length==0
   	},
   	
   	defaultString: function(string){
   		return string!=null?string:""
   	}
   }
   this["StringUtils"] = StringUtils
}).apply(this)
}