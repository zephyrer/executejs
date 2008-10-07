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
      constructor: ArrayList,
      
      add: function(obj){
         this.array.push(obj)
      },
      
      addAtIndex: function(index, obj){
      	this.array = this.array.slice(0,index).concat(obj).concat(this.array.slice(index))
      },
      
      clear: function(){
      	this.array = new Array()
      },
      
      contains: function(obj, compareFunc){
      	if(compareFunc){
            return this.array.some(function(element, index, array){
            	compareFunc(obj, element)
            })
      	}else{
         	return this.array.indexOf(obj)!=-1
      	}
      },
      
      get: function(index){
      	if(index>this.array.length-1){
      		throw new Error("ArrayList.get: IndexOutOfBounds")
      	}
      	return this.array[index]
      },

      removeAtIndex: function(index){
      	this.array = this.array.slice(0,index).concat(this.array.slice(index+1))
      },
      
      remove: function(obj){
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