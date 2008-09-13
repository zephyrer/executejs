/**
 * Contain string utility methodes
 */
(function(){
   
   var StringUtils = {
   	digitRegEx: /^\d*$/,
   	
   	isDigit: function(string){
   		return this.digitRegEx.test(string)   		
   	} 
   }
   DE_MOUSELESS_EXTENSION_NS["StringUtils"] = StringUtils
})()