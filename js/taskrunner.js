taskrunner = function() {
	
	var taskrunner = {},
		tasks = null,
		judge = -1,
		vis = vis,
		dispatch = d3.dispatch("start", "stop", "next", "terminate");
		
	var did = -1,
		vid = 0,
		tid = -1,
		start = -1,
		end = 0,
		report = [];
	
	taskrunner.tasks = function(_) {
		
		if(arguments.length == 0) {
			return tasks;
		}
		tasks = _;
				
		return taskrunner;
	};

	taskrunner.judge = function(_) {
		
		if(arguments.length == 0) {
			return judge;
		}
		judge = _;
		end = new Date().getTime();

		console.log(end);
				
		return taskrunner;
	};
	
	taskrunner.start = function() {
		dispatch.start(tasks[vid][did], vid, did);
		
		start = new Date().getTime();
		
		return taskrunner;
	};
	
	taskrunner.stop = function() {
		
		if(start == -1) {
			return;
		}
		
		if(judge < 0) {
			end = new Date().getTime();
		}
		
		var items = tasks[tid].dots;
		var anomaly = false;

		for(var i = 0; i < items.length; ++i) {
			if(items[i].isAnomaly) {
				anomaly = true;
				break;
			}
		}
		var res = '' + tid + ','  
				+ tasks[tid].q + ',' 
				+ anomaly + ',' 
				+ judge + ',' 
				+ (end - start) + ','
				+ '\n';
		

		console.log(res);
		
		report.push(res);
		
		start = -1;
		end = 0;
		judge = -1;
		
		dispatch.stop(res);
		
		return taskrunner;
	};
	
	taskrunner.reset = function() {
		start = -1;
		end = -1;
		report = [];
		did = -1;
		vid = 0;
		return taskrunner;
	};
	
	taskrunner.next = function() {		
		
		if(tid + 1 < tasks.length) {
			tid ++;
		} else {
			
			console.log(report);
			console.log(report.length);
			
			var d = new Date();
			var n = d.getTime();
			var blob = new Blob(report, {type: "text/plain;charset=utf-8"});
			saveAs(blob, "results[" + n + "].csv");
			
			dispatch.terminate();

			return;
		}

		dispatch.next(tasks[tid], tid);
		
		return taskrunner;
	};
	
	taskrunner.report = function() {
		return report;	
	};
	
	taskrunner.dispatch = dispatch;
			
	return taskrunner;
}
