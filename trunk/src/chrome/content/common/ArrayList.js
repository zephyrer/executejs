(function(){   
   function ArrayList (arg){
   	if(arg!=null && arg.prototype.constructor==Array){
   		this.array = array
   	}else if(arg!=null && !isNaN(arg)){
   		this.array = new Array(arg)
   	}else{
   		this.array = new Array()
   	}
   }
   
   ArrayList.prototype = {
      append: function(obj){
         this.array.push(obj)
      },
      
      addItem: function(index, obj){
      	this.array = this.array.slice(0,index).concat(obj).concat(this.array.slice(index))
      },
      
      clear: function(){
      	this.array = new Array()
      },
      
      contains: function(obj){
      	return this.array.indexOf(obj)!=-1
      },

      remove: function(index){
      	this.array = this.array.slice(0,index).concat(this.array.slice(index+1))
      },
      
      removeItem: function(obj){
      	this.remove(this.array.indexOf(obj))
      },
      
      set: function(index, obj){
      	this.array[index] = obj
      },
      
      size: function(){
      	return this.array.length
      }
      
      
      
   }
   DE_MOUSELESS_EXTENSION_NS["ArrayList"]= ArrayList;   
})()