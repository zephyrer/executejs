with(this){
(function() {
   var DomUtils = {
      
      //Taken from firebug, see firebug-license.txt
      addStyleSheet : function(doc, link) {
         var heads = doc.getElementsByTagName("head");
         if (heads.length)
            heads[0].appendChild(link);
         else
            doc.documentElement.appendChild(link);
      },
      
      assureStyleSheet: function(doc, url){
         var styleSheets = doc.styleSheets
         var included = false
         for (var i = 0; i < styleSheets.length; i++) {
            if(styleSheets[i].href==url){
               included = true
               break;
            }
         }
         if(included){
            return
         }
         var link = this.createStyleSheet(doc, url)
         this.addStyleSheet(doc, link)
      },
      
      containsFrames: function(win){
      	return win.frames.length>0
      },
      
      //Taken from firebug, see firebug-license.txt
      createStyleSheet : function(doc, url) {
         var link = doc.createElementNS("http://www.w3.org/1999/xhtml", "link");
         link.setAttribute("charset", "utf-8");
         link.firebugIgnore = true;
         link.setAttribute("rel", "stylesheet");
         link.setAttribute("type", "text/css");
         link.setAttribute("href", url);
         return link;
      },

      //Taken from firebug, see firebug-license.txt
      getBody : function(doc) {
         if (doc.body)
            return doc.body;
         return doc.getElementsByTagName("body")[0];
      },
      
      getFrameByName: function(win, name){
      	var result = null
      	this.iterateWindows(win, function(subWin){
      	  if(subWin.name == name)
      	     result = subWin
      	})
      	return result
      },
      
      getFrameByLocationHref: function(win, href){
         var result = null
         this.iterateWindows(win, function(subWin){
           if(subWin.location.href == href)
              result = subWin
         })
         return result
      },

      getFrameByHrefRegExp: function(win, hrefRegExp){
         var result = new Array()
         this.iterateWindows(win, function(subWin){
           if(hrefRegExp.test(subWin.location.href))
              result.push(subWin)
         })
         return result
      },

      /*
       * @param element: element for which offset should be computed @param
       * leftOrTop: values offsetLeft/offsetTop
       */
      getOffsetToBody : function(element) {
         var offset = {}
         offset.y = element.offsetTop
         offset.x = element.offsetLeft
         while (element.offsetParent != null) {
            element = element.offsetParent
            offset.y += element.offsetTop
            offset.x += element.offsetLeft
         }
         return offset
      },
      
      getOwnerWindow: function(element){
      	return element.ownerDocument.defaultView
      },
      
      iterateDescendantsByTagName: function(element, descendantTagName, funcPointer){
      	var descendants = element.getElementsByTagName(descendantTagName)
      	for (var i = 0; i < descendants.length; i++) {
      		funcPointer(descendants[i])
      	}
      },
      
      // Taken from firebug, see firebug-license.txt
      iterateWindows : function(win, handler) {
         if (!win || !win.document)
            return;

         handler(win);

         if (win == top)
            return; // XXXjjb hack for chromeBug

         for (var i = 0; i < win.frames.length; ++i) {
            var subWin = win.frames[i];
            if (subWin != win)
               this.iterateWindows(subWin, handler);
         }
      },
      
      moveTo: function(elt, x, y){
         elt.style.left = x + "px"
         elt.style.top = y + "px"
      },
      
      //Taken from firebug, see firebug-license.txt
      ownerDocIsFrameset: function(elt){
         var body = this.getBody(elt.ownerDocument);
         if(body==null)
            return false
         return body.localName.toUpperCase() == "FRAMESET"
      },
      
      resizeTo: function(elt, w, h){
         elt.style.width = w + "px"
         elt.style.height = h + "px"
      }
   }
this["DomUtils"] = DomUtils;
}).apply(this)
}