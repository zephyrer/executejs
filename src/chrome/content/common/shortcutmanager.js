/*
 * SCM
 * Version 0.1
 * Created by Rudolf Noé
 * 18.06.2005
 *
 * Licence Statement
 * Version:  MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License
 * Version 1.1  (the "License"); you may  not use this  file except in
 * compliance with the License.  You  may obtain a copy of the License
 * at http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
 * the  License  for  the   specific  language  governing  rights  and
 * limitations under the License.
 */
(function(){
//Global variables
var currentEvent = null;

//Constructor
function SCM(){
    this.shortCuts = new Object();
    //TODO
    window.addEventListener("keydown", rno.sew.SCM.onEvent, true);
}

function getInstance(){
    if(!SCM.instance){
        SCM.instance = new SCM();
    }
    return SCM.instance;
}
SCM.getInstance=getInstance;

function addShortCut(keyCode, modifierMask, action){
    if(modifierMask==null){
        modifierMask = 0;
    }
    var shortCutKey = createCombinedShortCutKey(keyCode, modifierMask)
    getInstance().shortCuts[shortCutKey] = action;
}
SCM.prototype.addShortCut = addShortCut;

/*
 * param: combinedKeyCode = keyCode << 4 | Event.ALT_MASK | Event.CONTROL_MASK | Event.SHIFT_MASK
 */
function addShortCutWithCombinedKeyCode(combinedShortCutKey, action){
    var shortcutArray = getInstance().shortCuts[combinedShortCutKey];
    if(shortcutArray==null)
        getInstance().shortCuts[combinedShortCutKey] = new Array(action);
    else
        shortcutArray[shortcutArray.length] = action;
}
SCM.prototype.addShortCutWithCombinedKeyCode = addShortCutWithCombinedKeyCode

function onEvent(event){
    var shortCuts = getInstance().shortCuts;
    var shortCutKey = createCombinedShortCutKey(event.keyCode, encodeEventModifier(event));
    //Components.utils.reportError("SEW: ShortCutKey " + shortCutKey);
    var shortCutArray = shortCuts[shortCutKey];
    if(shortCutArray){
        SCM.currentEvent = event;
        for(var i=0; i<shortCutArray.length; i++){
            shortCutArray[i].onEvent(event);
        }
    }else{
        SCM.currentEvent = null;
    }
}
SCM.onEvent = onEvent;

/*
 * Löscht alle Shortcuts mit einer bestimmten
 * ClientId
 */
function clearShortcuts(){
	this.shortCuts = new Object();
}
SCM.prototype.clearShortcuts = clearShortcuts;

function createCombinedShortCutKey(keyCode, modifierMask){
	var shortCutKey = keyCode << 4 | modifierMask;
	return shortCutKey;
}

function encodeEventModifier(event){
    return event.altKey * Event.ALT_MASK |
        event.ctrlKey * Event.CONTROL_MASK |
        event.shiftKey * Event.SHIFT_MASK |
        event.metaKey * Event.META_MASK;
}

//Constants
SCM.ALT = SCM.prototype.Alt = Event.ALT_MASK;
SCM.CTRL = SCM.prototype.CTRL = Event.CONTROL_MASK;
SCM.SHIFT = SCM.prototype.SHIFT = Event.SHIFT_MASK;
SCM.CTRL_SHIFT = SCM.prototype.CTRL_SHIFT = Event.CONTROL_MASK | Event.SHIFT_MASK;
SCM.ALT_SHIFT = SCM.prototype.ALT_SHIFT = Event.ALT_MASK | Event.SHIFT_MASK;
SCM.SUPPRESS_EVENT = SCM.prototype.SUPPRESS_EVENT = "suppressEvent";

window.rno.Utils.bindToNamespace("rno.sew", "SCM", SCM);
})();

(function() {
function GenericAction(htmlElement){
    this.element = htmlElement; 
}

GenericAction.prototype.onEvent = function(event){

    var tagName = this.element.tagName.toLowerCase();
    var type = this.element.type?this.element.type.toLowerCase():null;
    
    //If it is text- or password-field
    if((tagName=="input" && (type=="text" || type=="password")) ||
        tagName=="textarea"){
            this.element.select();
            return;
    } 
    //In every other case try to focus
    else {
        try{
            this.element.focus();
        }catch(e){}
    }
    	
    //And simulate click
	var clickEvent = content.document.createEvent("MouseEvents");
    clickEvent.initMouseEvent( "click", true, true, content, 0, 0, 0, 0, 0, 
        false, false, false, false, 0, null);
    this.element.dispatchEvent(clickEvent);
    rno.Utils.logMessage("SEW: Action for element " + this.element.name + " done");
}

window.rno.Utils.bindToNamespace("rno.sew", "GenericAction", GenericAction);
})();

function RNO_addShortcut(){
	window.open("chrome://shortcutseverywhere/content/adddialog/adddialog.xul","sew_adddialog", "chrome,width=300,height=300,resizable");    
}