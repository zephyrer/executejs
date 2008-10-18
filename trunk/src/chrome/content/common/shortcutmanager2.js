/*
 * ShortcutManager
 * Created by Rudolf Noé
 * 18.06.2005
 */

(function(){

/*
 * Constructor
 * @param targetObject: object on which the key event listener will be installed
 * @param eventType: type of event on which should be listened ("keydown", "keypress"
 * @param suppressKey: boolean indicating whether the the default behavior of key resulting in a shortcut should be suppressed
 */
//TODO different event types
function ShortcutManager(targetObject, eventType, suppressShortcutKeys){
    this.shortcuts = new Object();
    this.currentEvent = null;
    this.suppressShortcutKeys = suppressShortcutKeys!=null?suppressShortcutKeys:false
    this.windowKeyEventHandler = new KeyEventHandler(this, "handleWindowEvent")
    this.elementKeyEventHandler = new KeyEventHandler(this, "handleElementEvent")
    targetObject.addEventListener("keydown", this.windowKeyEventHandler, true);
}

ShortcutManager.prototype = {
   //Main event listening method
   handleWindowEvent : function(event) {
      this.onEvent(event)
   },
   
   handleElementEvent: function(event){
      var srcElement = event.target;
      if(srcElement.id)
         this.onEvent(event, srcElement.id)
      else 
         this.onEvent(event, srcElement.name);
   },
   
   onEvent: function(event, elementId){
      var shortcutKey = this.encodeEvent(event, elementId);
      if (elementId)
         shortcutKey = elementId + "_" + shortcutKey;
      var shortcutArray = this.shortcuts[shortcutKey]
      if (shortcutArray) {
         this.currentEvent = event;
         for (var i = 0; i < shortcutArray.length; i++) {
            var result = shortcutArray[i].onEvent(event);
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
    * @param shortcutTarget: Could be string with java script code, shortcut object implementing the onEvent method, a function or 
    *    an eventhanlder object implementing the handleEvent-method
    * @param cliendId: id with which the shortcut can be removed 
    */
   addShortcut: function(combinedKeyCode, shortcutTarget, clientId){
   	var shortcut = null
   	if(shortcutTarget.constructor == String){//instanceof doesn't work
   		shortcut = new JsShortcut(shortcutTarget, clientId)
   	}else if(shortcutTarget.onEvent instanceof Function){
   		shortcut = shortcutTarget
   	}else if(shortcutTarget instanceof Function || 
   	     (shortcutTarget!=null &&  shortcutTarget.handleEvent instanceof Function)){
   	  shortcut = new FunctionShortcut(shortcutTarget, clientId)     	
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
       this.addShortcut(combinedKeyCode, jsCode, clientId)
   },
   
   /*
    * Adds JS shortcut
    * @param combinedKeyCode: combinedKeyCode = keyCode << 4 | Event.ALT_MASK | Event.CONTROL_MASK | Event.SHIFT_MASK | Event.META_MASK 
    *    @see createCominedKeyCode
    * @param jsCode: String containing JS
    * @param cliendId: id with which the shortcut can be removed 
    */
   addJsShortcutWithCombinedKeyCode: function(combinedKeyCode, jsCode, clientId){
       this.addShortcut(combinedKeyCode, jsCode, clientId);
   },
   
   /*
    * param: combinedKeyCode = keyCode << 4 | Event.ALT_MASK | Event.CONTROL_MASK | Event.SHIFT_MASK
    */
   addJsShortcutForElement: function(elementId, keyCode, modifierMask, jsCode, clientId){
      var element = document.getElementById(elementId);
      if(!element)
         throw new Error("Element for elementId does not exist");
      var shortcutKey = this.createShortcutKey(keyCode, modifierMask, elementId)
      this.addShortcut(shortcutKey, jsCode, clientId)
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
            shortcuts[i] = newShortcutArray;
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
   
   isModifierCombination: function(event, modifierCombination){
       return this.encodeEventModifier(event)==modifierCombination
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
JsShortcut.prototype.onEvent = function(event){
       return window.eval(this.jsCode);
}

//Shortcut for function pointer or event handler
function FunctionShortcut(eventHandler, clientId){
   if(!(eventHandler instanceof Function) &&
      !(eventHandler.handleEvent instanceof Function)){
      throw new Error("FunctionShortcut.constructor: eventhandler must be function or must implement eventhandler interface")   	
   }
   this.AbstractShortcut(clientId)
   
   this.eventHandler = eventHandler
}

FunctionShortcut.prototype = AbstractShortcut.prototype

FunctionShortcut.prototype.onEvent = function(event){
	if(this.eventHandler instanceof Function){
      return this.eventHandler(event)
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

DE_MOUSELESS_EXTENSION_NS["ShortcutManager"] = ShortcutManager;
})()