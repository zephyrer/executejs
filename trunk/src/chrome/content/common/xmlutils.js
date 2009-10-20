/*
 * Version 0.1
 * Created by Rudolf Noé
 * 28.12.2007
 * 
 * XML Utilities
 */

(function(){
	var XMLUtils = {
		VERSION: "0.1",
		
		/*
		 * Parses an xmlString and returns and XML-Object not an DOM-Node!!!
		 * @param xmlString to parse
		 * @returns XML-object
		 */
		parseFromString: function(xmlString){
			var parser = new DOMParser()
			return parser.parseFromString(xmlString, "text/xml")
		},
		
		/*
		 * Serialize a Node-object to a string
		 * @param node: DOM-Node-obj
		 * @returns: String containing the xml
		 */
		serializeToString: function(node){
			var serializer = new XMLSerializer();
			return serializer.serializeToString(node)
		},
		
		/*
		 * Checks case insensitive whether the element has the provided tagname
		 * @param element: DOM-Element
		 * @param tagName: string with tagname
		 */
		isTagName: function(element, tagName){
	        if(!element || !element.tagName)
	            return false;
	        return element.tagName.toUpperCase()==tagName.toUpperCase();
	    },
	    
	    /*
	     * Checks whether a text node is empty
	     * @param element: DOM-Node
	     */
	    isEmptyTextNode: function(element){
	        if(element.nodeType==Node.TEXT_NODE && element.nodeValue=="")
	            return true
	        else
	            return false;
	    },
		
	}
	var NS = rno_common.Namespace
	NS.bindToNamespace(NS.COMMON_NS, "XMLUtils", XMLUtils);
	
})()