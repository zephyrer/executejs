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
   var NS = rno_common.Namespace
   NS.bindToNamespace(NS.COMMON_NS, "StringUtils", StringUtils)
})()