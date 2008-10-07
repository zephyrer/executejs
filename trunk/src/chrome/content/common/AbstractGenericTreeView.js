(function(){
	ArrayList = DE_MOUSELESS_EXTENSION_NS.ArrayList
	
	function AbstractGenericTreeView() {
	}
	
	AbstractGenericTreeView.prototype = {
		AbstractGenericTreeView: function(){
   		this.treebox = null
   		this.visibleItems = new ArrayList()
			this.rowCount = 0
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
		getVisibleItems: function(){
			this.visibleItems
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
		setTree : function(treebox) {
			this.treebox = treebox;
		},
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
      rowCountChanged: function(index, count){
      	if(this.treebox==null)
      	  return
      	this.treebox.rowCountChanged(index, count)
      }
	}
	
	DE_MOUSELESS_EXTENSION_NS["AbstractGenericTreeView"] = AbstractGenericTreeView;
})()