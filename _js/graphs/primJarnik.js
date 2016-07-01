
/*
	Prim-Jarnik's Algorithm

	Finds Minimum Spanning Tree

	runs in O((n+m) log n) or O(m log n) using adjacency list
	
*/
function primJarnik(graphTool){
	
	var selectedVertex = graphTool.getSelectedVertex();
	
	if(!selectedVertex){
		return false;
	}

	var queue = new Heap();

	graphTool.resetAttributes();

	var graph = graphTool.getGraph();

	var vertex = graph.getVertexList().getFirst();
	while(vertex && vertex.isElement){
		var v = vertex.getE();
		v.attributes.explored = false;
		v.attributes.aExplored = false;

		if(v == selectedVertex){
			v.attributes.distance = 0;
		} else {
			v.attributes.distance = Infinity;
		}

		var node = queue.insert(v.attributes.distance, v);
		v.attributes.queueElement = node.getE();
		
		vertex = vertex.getNext();
	}

	var edge = graph.getEdgeList().getFirst();
	while(edge && edge.isElement){
		var e = edge.getE();
		e.attributes.explored = false;
		e.attributes.aExplored = false;
		edge = edge.getNext();
	}

	graphTool.render();

	var next = queue.remove();
	while(next){
		var vertex = next.getValue();
		vertex.attributes.explored = true;

		var newBetterDistances = []; // just for visualisation
		
		var edge = vertex.getIncidence().getFirst();
		while(edge && edge.isElement){
			var e = edge.getE();
			var other = e.getOther(vertex);
			if(other.attributes.explored === false && e.comesFrom(vertex)){
				var newDistance = e.getWeight();
				if(newDistance < other.attributes.distance){
					newBetterDistances.push([other, newDistance]);
					other.attributes.distance = newDistance;
					other.attributes.queueElement.updateKey(newDistance, other.getName());
					other.attributes.discoveryEdge = e;
				}
			}
			
			edge = edge.getNext();
		}

		graphTool.addAnimationFrame(function(a){
			var v = a[0];
			graphTool.highlightNode(v);
			v.attributes.aExplored = true;
			v.attributes.label = ""+v.attributes.distance;
			if(v.attributes.discoveryEdge){
				v.attributes.discoveryEdge.attributes.aExplored = true;
				v.attributes.discoveryEdge.attributes.aDiscovery = true;
			}
			var arr = a[1];
			for(var i in arr){
				arr[i][0].attributes.label = arr[i][1];
			}
		}, [vertex, Array.from(newBetterDistances)]);
		
		next = queue.remove();
	}
	
}









