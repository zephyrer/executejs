
//Constants
RNO_COMMON_CHROME_ULR="chrome://executejs/content/common/"

EJS_GUIID="{7067a92c-1db4-4e5e-869c-25f841287f8b}"
EJS_NS="executejs"
EJS_CHROME_URL="chrome://executejs/content/executejs/"
EJS_PREF_PREFIX="executejs."
EJS_PREF_OBSERVER="EJS_PREF_OBSERVER"
//Max. number of entries to persists
EJS_PREF_MAX_HIST_PERS_SIZE=EJS_PREF_PREFIX+"maxHistoryPersist"
EJS_PREF_COMMAND_ABBR=EJS_PREF_PREFIX+"commandAbbr"

//
EJS_COMMAND_ABBR_SEPARATOR="%%"

//Load common scripts
{
	RNO_loadScript(RNO_COMMON_CHROME_ULR+RNO_LIB_NAMESPACE)
	RNO_loadScript(RNO_COMMON_CHROME_ULR+RNO_LIB_UTILS)
	RNO_loadScript(RNO_COMMON_CHROME_ULR+RNO_LIB_PREFS)
	RNO_loadScript(RNO_COMMON_CHROME_ULR+RNO_LIB_FILEIO)
	RNO_loadScript(RNO_COMMON_CHROME_ULR+RNO_LIB_XMLUTILS)
	RNO_loadScript(RNO_COMMON_CHROME_ULR+RNO_LIB_LISTBOX)
	RNO_loadScript(EJS_CHROME_URL+"configmanager.js")
	RNO_loadScript(EJS_CHROME_URL+"shortcutmanager_firefox.js")
	RNO_loadScript(EJS_CHROME_URL+"keyCodeMapper.js")
}