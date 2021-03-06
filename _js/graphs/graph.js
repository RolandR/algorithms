
/*
	Graph using adjacency list
*/

function Graph(d){

	var directed = d;

	function Vertex(n){
		var name = n;
		var incidence = new DoublyLinkedList();
		var listPos = null;

		var attributes = {};

		vertexCount++;

		function remove(){
			var incident = incidence.getFirst();
			var next;
			while(incident && incident.isElement){
				next = incident.getNext();
				incident.getE().remove();
				incident = next;
			}
			listPos.remove();
			vertexCount--;
			return name;
		}

		function isConnectedTo(vertex){
			var incident = incidence.getFirst();
			while(incident && incident.isElement){
				var edge = incident.getE();
				if(edge.pointsTo(vertex)){
					return edge;
				}
				incident = incident.getNext();
			}
			return false;
		}

		function hasIncomingFrom(vertex){
			var incident = incidence.getFirst();
			while(incident && incident.isElement){
				var edge = incident.getE();
				if(edge.comesFrom(vertex)){
					return edge;
				}
				incident = incident.getNext();
			}
			return false;
		}

		function connectTo(vertex, weight){
			
			if(this.isConnectedTo(vertex)){
				return false;
			}
			
			var edge = new Edge(this, vertex, weight);
			edge.setIncidencePositions([this.registerEdge(edge), vertex.registerEdge(edge)]);
			
			edge.setListPos(edgeList.insertFirst(edge));

			if(directed && this.hasIncomingFrom(vertex)){
				edge.setDirectedOnly(true);
			}
			return edge;
		}

		function registerEdge(edge){
			var incident = incidence.insertFirst(edge);
			return incident;
		}

		return {
			 getName: function(){return name;}
			,setName: function(p){name = p;}
			,getIncidence: function(){return incidence;}
			,setIncidence: function(p){incidence = p;}
			,remove: remove
			,getListPos: function(){return listPos;}
			,setListPos: function(p){listPos = p;}
			,connectTo: connectTo
			,isConnectedTo: isConnectedTo
			,hasIncomingFrom: hasIncomingFrom
			,registerEdge: registerEdge
			,attributes: attributes
			,toString: function(){return name;}
		};
	}

	function Edge(a, b, w){
		var weight = w || 1;
		var ends = [a, b];
		var listPos = null;
		var incidencePositions = null;
		var directedOnly = false;

		var attributes = {};

		edgeCount++;
		

		function remove(){
			incidencePositions[0].remove();
			incidencePositions[1].remove();
			listPos.remove();
			edgeCount--;
			return weight;
		}

		return {
			 getWeight: function(){return weight;}
			,setWeight: function(p){weight = p;}
			,isConnectedTo: function(vertex){
				return (ends[0] == vertex || ends[1] == vertex);
			}
			,pointsTo: function(vertex){
				if(directed){
					return (ends[1] == vertex);
				} else {
					return this.isConnectedTo(vertex);
				}
			}
			,comesFrom: function(vertex){
				if(directed){
					return (ends[0] == vertex);
				} else {
					return this.isConnectedTo(vertex);
				}
			}
			,getOther: function(vertex){
				if(ends[0] == vertex){
					return ends[1];
				} else {
					return ends[0];
				}
			}
			,remove: remove
			,getListPos: function(){return listPos;}
			,setListPos: function(p){listPos = p;}
			,isDirectedOnly: function(){return directedOnly;}
			,setDirectedOnly: function(p){directedOnly = p;}
			,attributes: attributes
			,getA: function(){return ends[0];}
			,getB: function(){return ends[1];}
			,setIncidencePositions: function(p){incidencePositions = p;}
		};
	}

	var vertexList = new DoublyLinkedList();
	var edgeList = new DoublyLinkedList();

	var vertexCount = 0;
	var edgeCount = 0;

	function insertVertex(name){
		var vertex = new Vertex(name);
		if(vertex){
			vertex.setListPos(vertexList.insertFirst(vertex));
		}
		return vertex;
	}

	function connect(v1, v2, w){
		return v1.connectTo(v2, w);
	}

	return {
		 isDirected: function(){return directed}
		,makeDirected: function(d){directed = d;}
		,insertVertex: insertVertex
		,connect: connect
		,getVertexCount: function(){return vertexCount;}
		,getEdgeCount: function(){return edgeCount;}
		,getVertexList: function(){return vertexList;}
		,getEdgeList: function(){return edgeList;}
	};
	
}













