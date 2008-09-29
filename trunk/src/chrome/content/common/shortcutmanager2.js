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
 */
//TODO different event types
function ShortcutManager(targetObject, eventType){
    this.shortCuts = new Object();
    this.currentEvent = null;
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
      var shortCutKey = this.encodeEvent(event, elementId);
      if (elementId)
         shortCutKey = elementId + "_" + shortCutKey;
      var shortCutArray = this.shortCuts[shortCutKey]
      if (shortCutArray) {
         this.currentEvent = event;
         for (var i = 0; i < shortCutArray.length; i++) {
            var result = shortCutArray[i].onEvent(event);
            if (result & this.PREVENT_FURTHER_EVENTS) {
               break;
            }
         }
      } else {
         this.currentEvent = null;
      }
   },
   
   addJsShortCut: function(keyCode, modifierMask, jsCode, clientId){
       if(modifierMask==null){
           modifierMask = 0;
       }
       var combinedKeyCode = this.createShortCutKey(keyCode, modifierMask)       
       this.addJsShortCutWithCombinedKeyCode(combinedKeyCode, jsCode, clientId)
   },
   
   /*
    * Adds JS shortcut
    * @param combinedKeyCode: combinedKeyCode = keyCode << 4 | Event.ALT_MASK | Event.CONTROL_MASK | Event.SHIFT_MASK | Event.META_MASK 
    *    @see createCominedKeyCode
    * @param jsCode: String containing JS
    * @param cliendId: id with which the shortcut can be removed 
    */
   addJsShortCutWithCombinedKeyCode: function(combinedKeyCode, jsCode, clientId){
       var shortcutArray = this.shortCuts[combinedKeyCode];
       var newShortCut = new Shortcut(jsCode, clientId);
       if(shortcutArray==null)
           this.shortCuts[combinedKeyCode] = new Array(newShortCut);
       else
           shortcutArray.push(newShortCut);
   },
   
   /*
    * param: combinedKeyCode = keyCode << 4 | Event.ALT_MASK | Event.CONTROL_MASK | Event.SHIFT_MASK
    */
   addJsShortCutForElement: function(elementId, keyCode, modifierMask, jsCode, clientId){
      var element = document.getElementById(elementId);
      if(!element)
         throw new Error("Element for elementId does not exist");
      var shortCutKey = this.createShortCutKey(keyCode, modifierMask, elementId)
      this.addJsShortCutWithCombinedKeyCode(shortCutKey, jsCode, clientId)
      element.addEventListener("keydown", this.elementKeyEventHandler, true);
   },
   
   /*
    * Löscht alle Shortcuts mit einer bestimmten
    * ClientId
    */
   clearAllShortCutsForClientId: function(clientId){
      try{
         var shortCuts = this.shortCuts;
         for(i in shortCuts){
            var shortCutArray = shortCuts[i];
            var newShortCutArray = new Array();
            for(var j = 0; j < shortCutArray.length; j++){
               var shortCut = shortCutArray[j];
               if(shortCut.clientId!=clientId)
                  newShortCutArray[newShortCutArray.length] = shortCut;
            }
            shortCuts[i] = newShortCutArray;
         }
      }catch(e){alert(e)}
   },

   createCombinedKeyCode: function(keyCode, modifierMask){
      return keyCode << 4 | modifierMask
   },

   createShortCutKey: function(keyCode, modifierMask, elementId){
      var shortCutKey = keyCode << 4 | modifierMask;
      if(elementId)
         shortCutKey = elementId + "_" + shortCutKey;
      return shortCutKey;
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
 * Construktor für Shortcut
 */
function Shortcut(jsCode, clientId){
    this.jsCode = jsCode.replace(/'/g, '"');
    this.clientId = clientId;
}

Shortcut.prototype = {
   onEvent: function(event){
       var result = window.eval(this.jsCode);
       if(result&this.SUPPRESS_KEY){
          event.preventDefault();
          event.stopPropagation();
       }
       return result
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
})()/*
 * ShortcutManager
 * Created by Rudolf Noé
 * 18.06.2005
 */

(function(){

/*
 * Constructor
 * @param targetObject: object on which the key event listener will be installed
 * @param eventType: type of event on which should be listened ("keydown", "keypress"
 */
//TODO different event types
function ShortcutManager(targetObject, eventType){
    this.shortCuts = new Object();
    this.currentEvent = null;
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
		var shortCutKey = this.encodeEvent(event, elementId);
		if (elementId)
			shortCutKey = elementId + "_" + shortCutKey;
		var shortCutArray = this.shortCuts[shortCutKey]
		if (shortCutArray) {
			this.currentEvent = event;
			for (var i = 0; i < shortCutArray.length; i++) {
				var result = shortCutArray[i].onEvent(event);
				if (result & this.PREVENT_FURTHER_EVENTS) {
					break;
				}
			}
		} else {
			this.currentEvent = null;
		}
   },
   
   addJsShortCut: function(keyCode, modifierMask, jsCode, clientId){
       if(modifierMask==null){
           modifierMask = 0;
       }
       var combinedKeyCode = this.createShortCutKey(keyCode, modifierMask)       
       this.addJsShortCutWithCombinedKeyCode(combinedKeyCode, jsCode, clientId)
   },
   
   /*
    * Adds JS shortcut
    * @param combinedKeyCode: combinedKeyCode = keyCode << 4 | Event.ALT_MASK | Event.CONTROL_MASK | Event.SHIFT_MASK | Event.META_MASK 
    *    @see createCominedKeyCode
    * @param jsCode: String containing JS
    * @param cliendId: id with which the shortcut can be removed 
    */
   addJsShortCutWithCombinedKeyCode: function(combinedKeyCode, jsCode, clientId){
       var shortcutArray = this.shortCuts[combinedKeyCode];
       var newShortCut = new ShortCut(jsCode, clientId);
       if(shortcutArray==null)
           this.shortCuts[combinedKeyCode] = new Array(newShortCut);
       else
           shortcutArray.push(newShortCut);
   },
   
   /*
    * param: combinedKeyCode = keyCode << 4 | Event.ALT_MASK | Event.CONTROL_MASK | Event.SHIFT_MASK
    */
   addJsShortCutForElement: function(elementId, keyCode, modifierMask, jsCode, clientId){
      var element = document.getElementById(elementId);
      if(!element)
         throw new Error("Element for elementId does not exist");
      var shortCutKey = this.createShortCutKey(keyCode, modifierMask, elementId)
      this.addJsShortCutWithCombinedKeyCode(shortCutKey, jsCode, clientId)
      element.addEventListener("keydown", this.elementKeyEventHandler, true);
   },
   
   /*
    * Löscht alle Shortcuts mit einer bestimmten
    * ClientId
    */
   clearAllShortCutsForClientId: function(clientId){
      try{
         var shortCuts = this.shortCuts;
         for(i in shortCuts){
            var shortCutArray = shortCuts[i];
            var newShortCutArray = new Array();
            for(var j = 0; j < shortCutArray.length; j++){
               var shortCut = shortCutArray[j];
               if(shortCut.clientId!=clientId)
                  newShortCutArray[newShortCutArray.length] = shortCut;
            }
            shortCuts[i] = newShortCutArray;
         }
      }catch(e){alert(e)}
   },

   createCombinedKeyCode: function(keyCode, modifierMask){
   	return keyCode << 4 | modifierMask
   },

   createShortCutKey: function(keyCode, modifierMask, elementId){
      var shortCutKey = keyCode << 4 | modifierMask;
      if(elementId)
         shortCutKey = elementId + "_" + shortCutKey;
      return shortCutKey;
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
}
KeyEventHandler.prototpye = {
   handleEvent: function(event){
      this.shortcutManager[this.scmHandleEventFunction]()
   }
}

/*
 * Construktor für Shortcut
 */
function ShortCut(jsCode, clientId){
    this.jsCode = jsCode.replace(/'/g, '"');
    this.clientId = clientId;
}

Shortcut.prototype = {
   onEvent: function(event){
       var result = window.eval(this.jsCode);
       if(result&this.SUPPRESS_KEY){
          event.preventDefault();
          event.stopPropagation();
       }
       return result
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