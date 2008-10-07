(function(){
   function AbstractGenericTreeItem (){
   }
   
   AbstractGenericTreeItem.prototype = {
   	AbstractGenericTreeItem: function(level){
   		this.level = level
   	},
      getCellText : function(column) {
         return ""
      },
      isContainer : function() {
         return false
      },
      isSeparator : function() {
         return false
      },
      getLevel : function() {
         return this.level
      },
      getImageSrc : function(col) {
         return null
      }
      
   }

   DE_MOUSELESS_EXTENSION_NS["AbstractGenericTreeItem"] = AbstractGenericTreeItem;
})()