with(this){
/*
 * ShortcutManager
 * Created by Rudolf Noé
 * 18.06.2005
 */

(function(){
	
const COMBINED_KEY_CODE_REG_EXP = /^[kc]{1}\d*$/

/*
 * Constructor
 * @param targetObject: object on which the key event listener will be installed
 * @param eventType: type of event on which should be listened ("keydown", "keypress"
 * @param suppressKey: boolean indicating whether the the default behavior of key resulting in a shortcut should be suppressed
 */
//TODO different event types
function ShortcutManager(targetObject, eventType, suppressShortcutKeys){
   this.targetObject = targetObject
   this.eventType  = eventType
   this.suppressShortcutKeys = suppressShortcutKeys!=null?suppressShortcutKeys:false
   this.shortcuts = new Object();
   this.currentEvent = null;
   this.windowKeyEventHandler = new KeyEventHandler(this, "handleWindowEvent")
   this.elementKeyEventHandler = new KeyEventHandler(this, "handleElementEvent")
   this.targetObject.addEventListener(this.eventType, this.windowKeyEventHandler, true);
}

ShortcutManager.prototype = {
   //Main event listening method
   handleWindowEvent : function(event) {
      this.handleEvent(event)
   },
   
   handleElementEvent: function(event){
      var srcElement = event.target;
      if(srcElement.id)
         this.handleEvent(event, srcElement.id)
      else 
         this.handleEvent(event, srcElement.name);
   },
   
   handleEvent: function(event, elementId){
      var shortcutKey = this.encodeEvent(event, elementId);
      if (elementId)
         shortcutKey = elementId + "_" + shortcutKey;
      var shortcutArray = this.shortcuts[shortcutKey]
      if (shortcutArray) {
         this.currentEvent = event;
         for (var i = 0; i < shortcutArray.length; i++) {
            var result = shortcutArray[i].handleEvent(event);
            if(this.suppressShortcutKeys || result&ShortcutManager.SUPPRESS_KEY){
               event.preventDefault();
               event.stopPropagation();
            }
            if (result & ShortcutManager.PREVENT_FURTHER_EVENTS) {
               break;
            }
         }
      } else {
         this.currentEvent = null;
      }
   },
   
   /*
    * Adds JS shortcut
    * @param combinedKeyCode: combinedKeyCode = keyCode << 4 | Event.ALT_MASK | Event.CONTROL_MASK | Event.SHIFT_MASK | Event.META_MASK 
    *    @see createCominedKeyCode
    * @param shortcutTarget: Could be string with java script code, shortcut object implementing the handleEvent method, a function or 
    *    an eventhanlder object implementing the handleEvent-method
    * @param cliendId: id with which the shortcut can be removed 
    */
   addShortcut: function(keyCombination, shortcutTarget, targetObj, clientId){
      if(this.destroyed)
         throw new Error('Shortcutmananger already destroyed')
   	var combinedKeyCode = null
   	if(!isNaN(keyCombination)){
   		combinedKeyCode = keyCombination
//   	}else if(COMBINED_KEY_CODE_REG_EXP.test(keyCombination)){
//   		combinedKeyCode = keyCombination
   	}else if(typeof keyCombination=="string"){
   		combinedKeyCode = this.parseKeyCombination(keyCombination)
   	}else{
   		throw new Error('Wrong key combinatin provided')
   	}
   	var shortcut = null
   	if(shortcutTarget.constructor == String){//instanceof doesn't work
   		shortcut = new JsShortcut(shortcutTarget, clientId)
   	}else if(typeof shortcutTarget == "function" || 
   	     (shortcutTarget!=null && typeof shortcutTarget.handleEvent == "function")){
   	  shortcut = new FunctionShortcut(shortcutTarget, targetObj, clientId)     	
   	}else{
   	  throw new Error('shortcutTarget is neither String nor Function or EventHandler')	
   	}
   	
      var shortcutArray = this.shortcuts[combinedKeyCode];
      if(shortcutArray==null)
         this.shortcuts[combinedKeyCode] = new Array(shortcut);
      else
         shortcutArray.push(shortcut);
   },
   
   addJsShortcut: function(keyCode, modifierMask, jsCode, clientId){
       if(modifierMask==null){
           modifierMask = 0;
       }
       var combinedKeyCode = this.createShortcutKey(keyCode, modifierMask)       
       this.addShortcut(combinedKeyCode, jsCode, null, clientId)
   },
   
   /*
    * Adds JS shortcut
    * @param combinedKeyCode: combinedKeyCode = keyCode << 4 | Event.ALT_MASK | Event.CONTROL_MASK | Event.SHIFT_MASK | Event.META_MASK 
    *    @see createCominedKeyCode
    * @param jsCode: String containing JS
    * @param cliendId: id with which the shortcut can be removed 
    */
   addJsShortcutWithCombinedKeyCode: function(combinedKeyCode, jsCode, clientId){
       this.addShortcut(combinedKeyCode, jsCode, null, clientId);
   },
   
   /*
    * param: combinedKeyCode = keyCode << 4 | Event.ALT_MASK | Event.CONTROL_MASK | Event.SHIFT_MASK
    */
   addJsShortcutForElement: function(elementId, keyCode, modifierMask, jsCode, clientId){
      var element = document.getElementById(elementId);
      if(!element)
         throw new Error("Element for elementId does not exist");
      var shortcutKey = this.createShortcutKey(keyCode, modifierMask, elementId)
      this.addShortcut(shortcutKey, jsCode, null, clientId)
      element.addEventListener("keydown", this.elementKeyEventHandler, true);
   },
   
   /*
    * Löscht alle Shortcuts mit einer bestimmten
    * ClientId
    */
   clearAllShortcuts: function(clientId){
   	if(clientId==null){
   		this.shortcuts = new Object()
   		return
   	}
      try{
         for(i in this.shortcuts){
            var shortcutArray = this.shortcuts[i];
            var newShortcutArray = new Array();
            for(var j = 0; j < shortcutArray.length; j++){
               var shortcut = shortcutArray[j];
               if(shortcut.clientId!=clientId)
                  newShortcutArray[newShortcutArray.length] = shortcut;
            }
            this.shortcuts[i] = newShortcutArray;
         }
      }catch(e){alert(e)}
   },
   
   createCombinedKeyCode: function(keyCode, modifierMask){
      return keyCode << 4 | modifierMask
   },

   createShortcutKey: function(keyCode, modifierMask, elementId){
      var shortcutKey = this.createCombinedKeyCode(keyCode, modifierMask)
      if(elementId)
         shortcutKey = elementId + "_" + shortcutKey;
      return shortcutKey;
   },
   
   /*
    * Encodes KeyEvent
    */
   encodeEvent: function(event){
       return event.keyCode << 4 | this.encodeEventModifier(event);
   },
   
   encodeEventModifier: function(event){
       return event.altKey * Event.ALT_MASK |
           event.ctrlKey * Event.CONTROL_MASK |
           event.shiftKey * Event.SHIFT_MASK |
           event.metaKey * Event.META_MASK;
   },
   
   destroy: function(){
      this.targetObject.removeEventListener(this.eventType, this.windowKeyEventHandler, true);
      this.targetObject.removeEventListener(this.eventType, this.elementKeyEventHandler, true);
      this.shortcuts = null
      this.destroyed = true
   },
   
   isModifierCombination: function(event, modifierCombination){
       return this.encodeEventModifier(event)==modifierCombination
   },
   
   parseKeyCombination: function(keyCombination){
      var parts = keyCombination.split("+")
      var keyPart = StringUtils.trim(parts.pop()).toUpperCase()
      var keyCode = KeyEvent["DOM_VK_"+keyPart]
      var modifierMask = 0
      for (var i = 0; i < parts.length; i++) {
      	var modifier = StringUtils.trim(parts[i]).toUpperCase()
      	switch(modifier){
      		case "CTRL":
      		   modifierMask = modifierMask | ShortcutManager.CTRL
      		   break;
      		case "SHIFT": 
      		   modifierMask = modifierMask | ShortcutManager.SHIFT
      		   break;
      		case "ALT": 
      		   modifierMask = modifierMask | ShortcutManager.ALT
      		   break;
      	}
      }
      return this.createCombinedKeyCode(keyCode, modifierMask)
   }
}

/*
 * Constructor for KeyEventHandler
 */
function KeyEventHandler(shortcutManager, scmHandleEventFunction){
   this.shortcutManager = shortcutManager
   this.scmHandleEventFunction = scmHandleEventFunction
   this.handleEvent = function(event){
      this.shortcutManager[this.scmHandleEventFunction](event)
   }
}

/*
 * Superclass of all Shortcut objects
 */
function AbstractShortcut(){
	
}
AbstractShortcut.prototype = {
   AbstractShortcut: function(clientId){
	  this.clientId = clientId
   
   }
}

//Shortcut for JS code
function JsShortcut(jsCode, clientId){
    this.AbstractShortcut(clientId)
    this.jsCode = jsCode.replace(/'/g, '"');
}

JsShortcut.prototype = new AbstractShortcut()
JsShortcut.prototype.handleEvent = function(event){
       return window.eval(this.jsCode);
}

//Shortcut for function pointer or event handler
function FunctionShortcut(eventHandler, targetObj, clientId){
   if(!(typeof eventHandler == "function") &&
      !(typeof eventHandler.handleEvent == "function")){
      throw new Error("FunctionShortcut.constructor: eventhandler must be function or must implement eventhandler interface")   	
   }
   this.AbstractShortcut(clientId)
   this.eventHandler = eventHandler
   this.targetObj = targetObj
}

FunctionShortcut.prototype = AbstractShortcut.prototype

FunctionShortcut.prototype.handleEvent = function(event){
	if(typeof this.eventHandler == "function"){
		if(this.targetObj==null)
         return this.eventHandler(event)
      else
         return this.eventHandler.apply(this.targetObj)
	}else{
		return this.eventHandler.handleEvent(event)
	}
}

//Constants
ShortcutManager.ALT = Event.ALT_MASK;
ShortcutManager.CTRL = Event.CONTROL_MASK;
ShortcutManager.SHIFT = Event.SHIFT_MASK;
ShortcutManager.CTRL_SHIFT = Event.CONTROL_MASK | Event.SHIFT_MASK;
ShortcutManager.ALT_SHIFT = Event.ALT_MASK | Event.SHIFT_MASK;
ShortcutManager.CTRL_ALT = Event.ALT_MASK | Event.CONTROL_MASK;
ShortcutManager.SUPPRESS_KEY = 1;
ShortcutManager.PREVENT_FURTHER_EVENTS = 2

this["ShortcutManager"] = ShortcutManager;
}).apply(this)
}