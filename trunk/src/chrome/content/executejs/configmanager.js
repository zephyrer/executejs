(function(){
	var NS = rno_common.Namespace
	var FileIO = rno_common.FileIO
	var Utils = rno_common.Utils
	
	var ConfigManager = {
		CONFIG_FILE_NAME: "ejs_history.xml",
		
		readHistory: function(){
			var configFile = this.getConfigFile();
			var xmlData = FileIO.read(configFile);
			var data = new XML(xmlData);
			var commandHistory = new Array();
			var histEntries = data.entry
			for(var i=0; i<histEntries.length(); i++){
				commandHistory[i] = histEntries[i].toString()				
			}
			return commandHistory;
		},
		
		saveHistory: function(historyArray){
			var root = <JsCodeHistory></JsCodeHistory>;
			for(var i=0; i<historyArray.length; i++){
				var command = historyArray[i];
				var entry = <entry>{command}</entry>
				root.appendChild(entry);
			}
			var configFile = this.getConfigFile();
			FileIO.write(configFile, root.toXMLString());
			
		},
		
		getConfigFile: function(){
			var nslConfigFile = Utils.getInstallLocation(executejs.EjsCommon.EJS_GUIID);
			nslConfigFile.append(this.CONFIG_FILE_NAME)
			var configFile = FileIO.open(nslConfigFile.path);
			if(!configFile){
				throw new Error("Config File could not be created")
			}
			if(!configFile.exists()){
				var success = FileIO.create(configFile);
				if(!success){
					throw new Error("Config File could not be created")
				}
			}
			return configFile;
		}
	}
	
	NS.bindToNamespace("executejs", "ConfigManager", ConfigManager);
})();