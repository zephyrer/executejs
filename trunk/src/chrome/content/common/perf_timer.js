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
		},
	} 
   var NS = rno_common.Namespace
   NS.bindToNamespace("rno_common", "PerfTimer", PerfTimer)
})()