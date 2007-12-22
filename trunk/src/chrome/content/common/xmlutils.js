(function(){
	var XMLUtils = {
		parseFromString: function(xmlString){
			var parser = new DOMParser()
			return parser.parseFromString(xmlString, "text/xml")
		},
		
		serializeToString: function(node){
			var serializer = new XMLSerializer();
			return serializer.serializeToString(node)
		}
	}
	var NS = rno_common.Namespace
	NS.bindToNamespace(NS.COMMON_NS, "XMLUtils", XMLUtils);
	
})()