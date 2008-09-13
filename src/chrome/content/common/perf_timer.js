(function(){
	function PerfTimer(){
		this.start = new Date()
	}
	PerfTimer.prototype = {
		start: function(){
			this.start = new Date()
		},
		stop: function(){
			this.stop = new Date()
			return this.stop.getTime()-this.start.getTime()
		}
	} 
   DE_MOUSELESS_EXTENSION_NS["PerfTimer"] =  PerfTimer;
})()