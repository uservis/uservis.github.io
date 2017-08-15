//////////////////////////////////
//Graph Structure V1.0
//author: Nan Cao 
//contact: nancao@us.ibm.com
graph = function() {
	
	this.nodes = [];
	this.links = [];
	this.neilinks = {};
	this.metainfo = {};
	this.nodedims = [];
	this.edgedims = [];
	
	this.refresh = function() {
		if(this.links.length == 0) {
			return;
		}
		
		var pool = {};
		if(typeof this.links[0].target == 'string') {
			for(var i = 0; i < this.nodes.length; ++i) {
				var sid = id(this.nodes[i]);
				if(sid == '') {
					sid = this.nodes[i].id = 'n' + i;
				}
				pool[sid] = this.nodes[i];
			}
		}
				
		this.neilinks = {};
		for(var i = 0; i < this.links.length; ++i) {
			var link = this.links[i];
			var n1 = link.source;
			var n2 = link.target;
			
			if(typeof n1 == 'number') {
				n1 = link.source = this.nodes[n1];
			} else if(typeof n1 == 'string') {
				n1 = link.source = pool[n1];
			}
			if (typeof n2 == 'number') {
				n2 = link.target = this.nodes[n2];
			} else if(typeof n2 == 'string') {
				n2 = link.target = pool[n2];
			}
			
			var id1 = id(n1);
			var id2 = id(n2);
			
			if(!this.neilinks[id1]) {
				this.neilinks[id1] = [];
			} 
			this.neilinks[id1].push(link);
			if(!this.neilinks[id2]) {
				this.neilinks[id2] = [];
			}
			this.neilinks[id2].push(link);
		}
		
		
		for(var i = 0; i < _nodes.length; ++i) {
			_nodes[i].dgree = _graph.degree(_nodes[i]);
		}
		
		this.edgedims = [];
		this.nodedims = [];
		var numerical = [];
		for(var key in this.nodes[0]) {
			
			if(key == 'id' || key == 'name' || key == 'label') {
				continue;
			}
			
			dim = {};
			if( typeof this.nodes[0][key] == 'number') {
				dim.label = key;
				dim.type = 'numerical';
				numerical.push(dim);
			} 
			
			if(typeof this.nodes[0][key] == 'string') {
				if(this.nodes[0][key].indexOf('http')==0) {
					dim.lable = key;
					dim.type = 'image';
				} else {
					dim.label = key;
					dim.type = 'categorical';
				}
			}
			
			_node_dims.push(dim);
		}
		
		if(numerical.length != 0) {
			var max = [], min = [];
			for(var i = 0; i < numerical.length; ++i) {
				max.push(0);
				min.push(10000000);
			}
			for(var i = 0; i < this.nodes.length; ++i) {
				for(var j = 0; j < numerical.length; ++j) {
					max[j] = Math.max(this.nodes[i][numerical[j].label], max[j]);
					min[j] = Math.min(this.nodes[i][numerical[j].label], min[j]);
				}
			}
			for(var i = 0; i < numerical.length; ++i) {
				numerical[i].domain = [min[i], max[i]];
			}
		}
		
		numerical = [];
		for(var key in this.links[0]) {
			
			if(key == 'source' || key == 'target') {
				continue;
			}
			
			dim = {};			
			if( typeof this.links[0][key] == 'number') {
				dim.label = key;
				dim.type = 'numerical';
				numerical.push(dim);
			} else if(typeof this.links[0][key] == 'string') {
				dim.label = key;
				dim.type = 'categorical';
			}
			_edge_dims.push(dim);
		}
		
		if(numerical.length != 0) {
			
			var max = [], min = [];
			for(var i = 0; i < numerical.length; ++i) {
				max.push(0);
				min.push(10000000);
			}
			for(var i = 0; i < this.links.length; ++i) {
				for(var j = 0; j < numerical.length; ++j) {
					max[j] = Math.max(this.links[i][numerical[j].label], max[j]);
					min[j] = Math.min(this.links[i][numerical[j].label], min[j]);
				}
			}
			for(var i = 0; i < numerical.length; ++i) {
				numerical[i].domain = [min[i], max[i]];
			}
		}
		
	};
	
	this.add = function(node) {
		var nid = id(node);
		if(!this.neilinks[nid]) {
			this.neilinks[nid] = [];
		}
		this.nodes.push(node);
	};
	
	this.remove = function(node) {
		this.nodes.splice(this.node.indexOf(node), 1);
		delete this.neilinks[id(node)];
	};
	
	this.degree = function(n) {
		return this.neilinks[id(n)].length;
	};
	
	this.neighbor = function(n) {
		var nodes = [];
		var ego = this.neilinks[id(n)];
		for(var i = 0; i < ego.length; ++i) {
			if(ego[i].source == n) {
				nodes.push(ego[i].target);
			} else if(ego[i].target == n) {
				nodes.push(ego[i].source);
			}
		}
		return nodes;
	};
		
	this.ego = function(n) {
		return this.neilinks[id(n)];
	};
	
	this.link = function(n1, n2) {
		var list = this.ego(n1).length > this.ego(n2).length ? this.ego(n2) : this.ego(n1);
		var id1 = id(n1), id2 = id(n2);
		for(var i = 0; i < list.length; ++i) {
			if((id(list[i].target) === id1 && id(list[i].source) === id2) || 
				(id(list[i].target) === id2 && id(list[i].source) === id1)) {
				return list[i];
			}
		}
		return null;
	};
	
	this.connect = function(n1, n2) {
		var nid1 = id(n1);
		var nid2 = id(n2);
		
		if(!this.neilinks[nid1]) {
			if(typeof n1 === 'string') {
				n1 = {id:nid1};
			}
			this.add(n1);
		}
		if(!this.neilinks[nid2]) {
			if(typeof n2 === 'string') {
				n2 = {id:nid2};
			}
			this.add(n2);
		}
		var link = this.link(n1, n2);
		if(link == null) {
			link = {source:n1, target:n2, value:0};
			this.links.push(link);
			this.neilinks[nid1].push(link);
			this.neilinks[nid2].push(link);
		}
		link.value = link.value + 1;
		return link;
	};
	
	this.disconnect = function(link) {
		var n1 = link.source;
		var n2 = link.target;
		
		var nid1 = id(n1);
		var nid2 = id(n2);
				
		this.neilinks[nid1].splice(this.neilinks[nid1].indexOf(link), 1);
		this.neilinks[nid2].splice(this.neilinks[nid2].indexOf(link), 1);
		
		this.links.splice(this.links.indexOf(link), 1);
	};
	
	this.isEmpty = function() {
		return this.nodes.length == 0;	
	};
	
	function id(node) {
		var id = '';
		if(node.id) {
			id = node.id;
		} else if(node._id) {
			id = node._id;
		} else if(node.name) {
			id = node.name;
		} else if(node.label) {
			id = node.label;
		} else if(typeof node === 'string') {
			id = node;
		}
		return id;
	};
};
