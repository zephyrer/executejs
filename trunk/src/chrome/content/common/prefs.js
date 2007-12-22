/* 

  Common-Prefs
  Version 0.1
  Created by Rudolf Noé
  01.12.2005
  
  Borrowed from pref-tabprefs.js (c) Bradley Chapman (THANKS!)
*/
(function(){
	//constants
	const PREF_ID_ATTR = "prefid"
	
	var Prefs = {
		/***** Preference Dialog Functions *****/
		prefs: Components.classes["@mozilla.org/preferences-service;1"].
		    getService(Components.interfaces.nsIPrefBranch),

		prefService: Components.classes["@mozilla.org/preferences-service;1"].
		    getService(Components.interfaces.nsIPrefService),
		
	    getCharPref: function(key){
	        return this.prefs.getCharPref(key)
	    },
	    
	    getBoolPref: function(key){
	        return this.prefs.getBoolPref(key)
	    },
	    
	    getIntPref: function(key){
	    	return this.prefs.getIntPref(key)
	    },
	
	    hasUserPref: function(key){
	    	return this.prefs.prefHasUserValue(key);
	   	},
	   	setCharPref: function(key, value){
	   		this.prefs.setCharPref(key, value);
	   	},

		loadPrefs: function(document){
		        var checkboxes = document.getElementsByTagName("checkbox");
		        for (var i = 0; i < checkboxes.length; i++)
		        {
		            var checkbox = checkboxes[i];
		            if(!checkbox.hasAttribute(PREF_ID_ATTR))
		            	continue
		            checkbox.checked = this.prefs.getBoolPref(checkbox.getAttribute(PREF_ID_ATTR));
		        }
		        var textfields = document.getElementsByTagName("textbox");
		        for (i = 0; i < textfields.length; i++)
		        {
		            var textfield = textfields.item(i);
		            if(!textfield.hasAttribute(PREF_ID_ATTR))
		            	continue
		            textfield.value = this.prefs.getCharPref(textfield.getAttribute(PREF_ID_ATTR));
		        }
		        var keyinputboxes = document.getElementsByTagName("keyinputbox");
		        for (i = 0; i < keyinputboxes.length; i++)
		        {
		            var keyinputbox = keyinputboxes.item(i);
		            keyinputbox.combinedValue = this.prefs.getCharPref(keyinputbox.getAttribute(PREF_ID_ATTR));
		        }
		        var selectboxes = document.getElementsByTagName("select");
		        for (i = 0; i < selectboxes.length; i++)
		        {
		            var selectbox = selectboxes[i];
		            if(!selectbox.hasAttribute(PREF_ID_ATTR))
		            	continue
		            selectbox.value = this.prefs.getCharPref(selectbox.getAttribute(PREF_ID_ATTR));
		            var options = selectbox.children;
		            for(var j=0; j<options.length; i++){
		                if(options[j].value==selectbox.value){
		                    options[i].selected=true;
		                }
		            }
		        }
       
				var xmlParser = new DOMParser()
		        var listboxes = document.getElementsByTagName("listbox")
		        for(var i=0; i<listboxes.length; i++) {
		        	var listbox = listboxes[i]
		        	if(!listbox.hasAttribute(PREF_ID_ATTR))
		        		continue
//		        	var prefList = this.readPrefList(listbox.getAttribute(PREF_ID_ATTR))
//		        	for(var j=0; j<prefList.length; j++) {
//		        		listbox.appendItem(prefList[j], prefList[j])
//		        	}
					var listboxXml = this.prefs.getCharPref(listbox.getAttribute(PREF_ID_ATTR))
					if(listboxXml=="")
						continue;
					var prefListbox = xmlParser.parseFromString(listboxXml, "text/xml")
					listbox.parentNode.replaceChild(prefListbox.documentElement, listbox);
//					var listitems = prefListbox.getElementsByTagName("listitem")
//					while(listitems.length!=0){
//						var prefListitem = listitems.item(j)
//						prefListitem.parentNode.removeChild(prefListitem)
//						var itemToAppend = document.importNode(prefListitem, true)
//						listbox.appendChild(itemToAppend)
//					}
		        }		        
		
		},
		
		savePrefs: function(document){
		    var checkboxes = document.getElementsByTagName("checkbox");
		    try{
		        for (var i = 0; i < checkboxes.length; i++)
		        {
		            var checkbox = checkboxes[i];
		            if(!checkbox.hasAttribute(PREF_ID_ATTR))
		            	continue
	            	this.prefs.setBoolPref(checkbox.getAttribute(PREF_ID_ATTR), checkbox.checked);
		        }
		        var textfields = document.getElementsByTagName("textbox");
		        for (i = 0; i < textfields.length; i++)
		        {
		            var textfield = textfields[i];
		            if(!textfield.hasAttribute(PREF_ID_ATTR))
		            	continue
		            this.prefs.setCharPref(textfield.getAttribute(PREF_ID_ATTR), textfield.value);
		        }
		        var keyinputboxes = document.getElementsByTagName("keyinputbox");
		        for (i = 0; i < keyinputboxes.length; i++)
		        {
		            var keyinputbox = keyinputboxes[i];
		            this.prefs.setCharPref(keyinputbox.getAttribute(PREF_ID_ATTR), keyinputbox.combinedValue);
		        }
		        var selectboxes = document.getElementsByTagName("select");
		        for (i = 0; i < selectboxes.length; i++)
		        {
		            var selectbox = selectboxes[i];
		            if(!checkbox.hasAttribute(PREF_ID_ATTR))
		            	continue
	            	this.prefs.setCharPref(selectbox.getAttribute(PREF_ID_ATTR), selectbox.value);
		        }
		        
		        var listboxes = document.getElementsByTagName("listbox")
		        for(var i=0; i<listboxes.length; i++) {
		        	var listbox = listboxes[i]
		        	if(!listbox.hasAttribute(PREF_ID_ATTR))
		        		continue
					//Strip attributes
		        	var listitems = listbox.getElementsByTagName("listitem")
					for(var j=0; j<listitems.length; j++) {
						var item = listitems.item(j)
						var attrLabel = item.getAttribute("label")
						var attrValue = item.getAttribute("value")
						var attrs = item.attributes
						while(attrs.length>0){
							item.removeAttributeNode(attrs.item(0))
						}
						item.setAttribute("label", attrLabel)
						item.setAttribute("value", attrValue)
					}
					var xml = rno_common.XMLUtils.serializeToString(listbox);
					this.prefs.setCharPref(listbox.getAttribute(PREF_ID_ATTR), xml)
		        }
		    }catch(e){
		        alert(e);
		    }
		},
		
		savePrefList: function(key, valuearray){
			var branch = this.prefs.deleteBranch(key);
			for(var i=0; i<valuearray.length; i++){
				var numberedKey = key+i
				this.prefs.setCharPref(numberedKey, valuearray[i])
			}
		},
		
		getPrefsForListbox: function(key){
			var listboxXml = this.prefs.getCharPref(key)
			var listbox = rno_common.XMLUtils.parseFromString(listboxXml, "text/xml")
			var result = new Array()
			var listitems = listbox.getElementsByTagName("listitem")
			for(var i=0; i<listitems.length; i++) {
				var listitem = listitems.item(i)
				var resultEntry = new Array();
				if(listitem.hasChildNodes()){
					//listcell objects
					var listcells = listitem.getElementsByTagName("listcell")
					for(var j=0; j<listcells.length; j++) {
						resultEntry[j]=listcells.item(j).getAttribute("value")
					}
				}else{
					resultEntry[0]=listitem.getAttriubute("value")					
				}
				result[i]=resultEntry
			}
			return result
		},
		
		notifyObservers: function(observerName){
		    var observerService = Components.classes["@mozilla.org/observer-service;1"].
		        getService(Components.interfaces.nsIObserverService);
		    observerService.notifyObservers ( null , observerName , null);
		}
	}
	var Namespace = rno_common.Namespace;
	Namespace.bindToNamespace(Namespace.COMMON_NS, "Prefs", Prefs);
})()