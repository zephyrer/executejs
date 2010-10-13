/**
 * Default-Prefs for EJS
 * Rudolf Noe
 * 27.12.05
 */
//Max. number of commands which will be persisted on exit
pref("executejs.keys.openCommandWin", "1079");
pref("executejs.maxHistoryPersist", "100");
pref("executejs.commandAbbr", '<listbox xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul" id="commandAbbrLB" prefid="executejs.commandAbbr" flex="1" disabled="false" seltye="single"><listcols><listcol/><listcol flex="1"/></listcols><listhead><listheader label="Abbreviation"/><listheader label="Command"/></listhead><listitem label="" value=""><listcell label="doc" value="doc"/><listcell label="document" value="document"/></listitem><listitem label="" value=""><listcell label="win" value="win"/><listcell label="window" value="window"/></listitem><listitem label="" value=""><listcell label="cw" value="cw"/><listcell label="getBrowser().contentWindow" value="getBrowser().contentWindow"/></listitem><listitem label="" value=""><listcell label="print" value="print"/><listcell label="EJS_appendToConsole" value="EJS_appendToConsole"/></listitem><listitem label="" value=""><listcell label="props" value="props"/><listcell label="EJS_printPropertiesForTarget" value="EJS_printPropertiesForTarget"/></listitem></listbox>');

