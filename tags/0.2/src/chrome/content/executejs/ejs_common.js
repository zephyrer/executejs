(function(){
	var EjsCommon = { 
		//Constants
		EJS_COMMON_CHROME_ULR: "chrome://executejs/content/common/",
		
		EJS_GUIID: "{7067a92c-1db4-4e5e-869c-25f841287f8b}",
		EJS_CHROME_URL: "chrome://executejs/content/executejs/",
		EJS_PREF_OBSERVER: "EJS_PREF_OBSERVER",
		//Max. number of entries to persists
		EJS_PREF_MAX_HIST_PERS_SIZE: "executejs.maxHistoryPersist",
		EJS_PREF_COMMAND_ABBR: "executejs.commandAbbr",
		
		/*
		 * Loads Script from url
		 * Must be local url
		 */
		loadScript: function(url){
			var sm = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].
							getService(Components.interfaces.mozIJSSubScriptLoader)
			sm.loadSubScript(url);
		}
	
	}	
	//Load common scripts
	{
		EjsCommon.loadScript(EjsCommon.EJS_COMMON_CHROME_ULR+"namespace.js")
		EjsCommon.loadScript(EjsCommon.EJS_COMMON_CHROME_ULR+"constants.js")
		EjsCommon.loadScript(EjsCommon.EJS_COMMON_CHROME_ULR+"utils.js")
		EjsCommon.loadScript(EjsCommon.EJS_COMMON_CHROME_ULR+"prefs.js")
		EjsCommon.loadScript(EjsCommon.EJS_COMMON_CHROME_ULR+"file_io.js")
		EjsCommon.loadScript(EjsCommon.EJS_COMMON_CHROME_ULR+"xmlutils.js")
		EjsCommon.loadScript(EjsCommon.EJS_COMMON_CHROME_ULR+"listbox.js")
		EjsCommon.loadScript(EjsCommon.EJS_CHROME_URL+"configmanager.js")
		EjsCommon.loadScript(EjsCommon.EJS_CHROME_URL+"shortcutmanager_firefox.js")
		EjsCommon.loadScript(EjsCommon.EJS_CHROME_URL+"keyCodeMapper.js")
	}
	
	var NS = rno_common.Namespace
	NS.bindToNamespace("executejs", "EjsCommon", EjsCommon)
})()