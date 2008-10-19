with(this){
(function(){
	
	function AbstractGenericTreeView() {
	}
	
	AbstractGenericTreeView.prototype = {
		AbstractGenericTreeView: function(tree){
			this.tree = tree
   		this.treebox = null
   		this.visibleItems = new ArrayList()
			this.rowCount = 0
			//registration of the view 
			this.tree.view = this
		},
		addVisibleItem: function(item){
			this.visibleItems.add(item)
			this.updateRowCount()
			this.rowCountChanged(this.rowCount-1, 1)
		},
		getCellProperties : function(row, col, props) {
		},
		getCellText : function(row, column) {
         return this.visibleItems.get(row).getCellText(column)
		},
		getColumnProperties : function(colid, col, props) {
		},
		getImageSrc : function(row, col) {
         return this.visibleItems.get(row).getImageSrc(col)
		},
		getLevel : function(row) {
         return this.visibleItems.get(row).getLevel()
		},
		getRowProperties : function(row, props) {
		},
		getTreeBox: function(){
			return this.treebox
		},
		getVisibleItems: function(){
			return this.visibleItems
		},
		isContainer : function(row) {
         return this.visibleItems.get(row).isContainer()
		},
      isContainerEmpty: function(row){
      	throw new Error('Not implemented')
      },
      isContainerOpen: function(row){
      	throw new Error('Not implemented')
      },
		isSeparator : function(row) {
         return this.visibleItems.get(row).isSeparator()
		},
		isSorted : function() {
			return false;
		},
		removeItem: function(index){
			this.visibleItems.removeAtIndex(index)
			this.updateRowCount()
			this.rowCountChanged(index, -1)
		},
      removeSelected: function(){
         if(this.tree.currentIndex==-1)
            return
         this.removeItem(this.tree.currentIndex)
      },
		rowCountChanged: function(index, count){
      	if(this.treebox==null)
      	  return
      	this.treebox.rowCountChanged(index, count)
      },
		setTree : function(treebox) {
			this.treebox = treebox;
		},
		//@param visibleItems: ArrayList contains objects of Type AbstractGenericTreeItem
		setVisibleItems: function(visibleItems){
			this.visibleItems = visibleItems
			this.updateRowCount()
			this.rowCountChanged(0, visibleItems.size())
		},
		updateRowCount: function(){
			this.rowCount = this.visibleItems.size()
		},
      toggleOpenState: function(row){
      	throw new Error('Not implemented')
      },
	}	
	this["AbstractGenericTreeView"] = AbstractGenericTreeView;
}).apply(this)
}