/* 

  Common-Prefs
  Version 0.1
  Created by Rudolf Noé
  28.12.2007
  
  Partly copied from pref-tabprefs.js (c) Bradley Chapman (THANKS!)
*/
(function(){
	//Attribute of a control under which key the preference should be stored
	PREF_ID_ATTR = "prefid"
	
	var Prefs = {
		VERSION: "0.1",
		
		//Reference to pref-service
		prefs: Components.classes["@mozilla.org/preferences-service;1"].
		    getService(Components.interfaces.nsIPrefBranch),

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

		/*
		 * Loads all Prefs for the controls of a document
		 * The controls to restored must be identified with the prefid-Attribute 
		 */
		loadPrefs: function(document){
		        //Checkboxes
		        var checkboxes = document.getElementsByTagName("checkbox");
		        for (var i = 0; i < checkboxes.length; i++)
		        {
		            var checkbox = checkboxes[i];
		            if(!checkbox.hasAttribute(PREF_ID_ATTR))
		            	continue
		            checkbox.checked = this.prefs.getBoolPref(checkbox.getAttribute(PREF_ID_ATTR));
		        }
		        //Textboxes
		        var textfields = document.getElementsByTagName("textbox");
		        for (i = 0; i < textfields.length; i++)
		        {
		            var textfield = textfields.item(i);
		            if(!textfield.hasAttribute(PREF_ID_ATTR))
		            	continue
		            textfield.value = this.prefs.getCharPref(textfield.getAttribute(PREF_ID_ATTR));
		        }
		        //Keyinputboxes
		        var keyinputboxes = document.getElementsByTagName("keyinputbox");
		        for (i = 0; i < keyinputboxes.length; i++)
		        {
		            var keyinputbox = keyinputboxes.item(i);
		            keyinputbox.combinedValue = this.prefs.getCharPref(keyinputbox.getAttribute(PREF_ID_ATTR));
		        }
		        //Selectboxes
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
       			
       			//Listboxes
       			//In case of Listboxes the complete XML of the listbox is stored
				var xmlParser = new DOMParser()
		        var listboxes = document.getElementsByTagName("listbox")
		        for(var i=0; i<listboxes.length; i++) {
		        	var listbox = listboxes[i]
		        	if(!listbox.hasAttribute(PREF_ID_ATTR))
		        		continue
					var listboxXml = this.prefs.getCharPref(listbox.getAttribute(PREF_ID_ATTR))
					if(listboxXml=="")
						continue;
					var prefListbox = xmlParser.parseFromString(listboxXml, "text/xml")
					var newListbox = document.importNode(prefListbox.documentElement, true)
					listbox.parentNode.replaceChild(newListbox, listbox);
		        }		        
		
		},
		
		/*
		 * Saves prefs for all controls of an document
		 * The constrols for which prefs should be stored must have the prefid-attribute
		 */
		savePrefs: function(document){
		    try{
				//Checkboxes
			    var checkboxes = document.getElementsByTagName("checkbox");
		        for (var i = 0; i < checkboxes.length; i++)
		        {
		            var checkbox = checkboxes[i];
		            if(!checkbox.hasAttribute(PREF_ID_ATTR))
		            	continue
	            	this.prefs.setBoolPref(checkbox.getAttribute(PREF_ID_ATTR), checkbox.checked);
		        }
		        //Textboxes
		        var textfields = document.getElementsByTagName("textbox");
		        for (i = 0; i < textfields.length; i++)
		        {
		            var textfield = textfields[i];
		            if(!textfield.hasAttribute(PREF_ID_ATTR))
		            	continue
		            this.prefs.setCharPref(textfield.getAttribute(PREF_ID_ATTR), textfield.value);
		        }
		        //Keyinputboxes
		        var keyinputboxes = document.getElementsByTagName("keyinputbox");
		        for (i = 0; i < keyinputboxes.length; i++)
		        {
		            var keyinputbox = keyinputboxes[i];
		            this.prefs.setCharPref(keyinputbox.getAttribute(PREF_ID_ATTR), keyinputbox.combinedValue);
		        }
		        //Selectboxes
		        var selectboxes = document.getElementsByTagName("select");
		        for (i = 0; i < selectboxes.length; i++)
		        {
		            var selectbox = selectboxes[i];
		            if(!checkbox.hasAttribute(PREF_ID_ATTR))
		            	continue
	            	this.prefs.setCharPref(selectbox.getAttribute(PREF_ID_ATTR), selectbox.value);
		        }
		        //Listboxes
		        //In case of Listboxes the complete XML of the listbox is stored
		        var listboxes = document.getElementsByTagName("listbox")
		        for(var i=0; i<listboxes.length; i++) {
		        	var listbox = listboxes[i]
		        	if(!listbox.hasAttribute(PREF_ID_ATTR))
		        		continue
					//Before serilization unneccessary attributes must be stripped
					//as these would cause errors after parsing 
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
		
		/*
		 * Returns the preferences wich are stored as a listbox
		 * @param prefid of the listbox
		 * @returns 2-dim array; the first dim represents the number of entries in the listbox;
		 *  		the second dim includes either only on entry (result[i][0]) with listitem.value
		 * 			in case the listbox has only one column or one entry per listcell with their
		 * 			respective value
		 */
		getPrefsForListbox: function(prefid){
			var listboxXml = this.prefs.getCharPref(prefid)
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
		
	}
	var Namespace = rno_common.Namespace;
	Namespace.bindToNamespace(Namespace.COMMON_NS, "Prefs", Prefs);
})()