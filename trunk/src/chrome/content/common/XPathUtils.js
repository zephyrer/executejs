(function(){
	var XPathUtils = {
		createXPath: function(element){
			var result = ""
			var doBreak = false
			do{
				if(element.hasAttribute('id')){
					result = "id('" + element.id + "')" + result
					break
				}
				if(element.hasAttribute('name')){
					result = "[@name='" + element.getAttribute('name') + "']" + result
					doBreak = true
				}
				if(element.hasAttribute('href')){
					result = "[@href='" + element.getAttribute('href') + "']" + result
					doBreak = true
				}
				if(!doBreak){
					var index = this.getIndexOfElement(element)
					if(index!=-1){
						result = "[" + index + "]" + result
					}
				}
				result = "/" + element.tagName + result
				if(doBreak){
              result = "/" + result					
				  break;
				}
				element = element.parentNode
			}while(element.nodeName!='#document')
			
			return result
		},
		
		getElements: function(xPath, doc, xPathResultType){
			var resultType = xPathResultType?xPathResultType:XPathResult.UNORDERED_NODE_ITERATOR_TYPE 
			var xPathResult = doc.evaluate(xPath, doc, null, resultType, null)
			var resultArray = []
			while(entry = xPathResult.iterateNext()){
				resultArray.push(entry)
			}
			return resultArray
		},
		
		getElement: function(xPath, doc){
			var result = this.getElements(xPath, doc)
			if(result.length>0){
				return result[0]
			}else{
				null
			}
		},

		//Returns the index of element within parent with this tagname
      getIndexOfElement: function(element){
         var parent = element.parentNode
         if(parent==null){
         	return -1
         }
         var elements = parent.getElementsByTagName(element.tagName)
         for (var i = 0; i < elements.length; i++) {
         	if(elements[i]==element){
         		return i+1
         	}
         }
         return -1
      }
   }
   
	DE_MOUSELESS_EXTENSION_NS["XPathUtils"] = XPathUtils;
})()