
/*
	DAG-Based distances

	runs in O(n+m) using adjacency list
	
*/
function dagDistances(graphTool){

	var selectedVertex = graphTool.getSelectedVertex();
	
	if(!selectedVertex){
		return false;
	}

	graphTool.resetAttributes();

	var graph = graphTool.getGraph();

	var n = graph.getVertexCount();

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
		
		vertex = vertex.getNext();
	}

	var edge = graph.getEdgeList().getFirst();
	while(edge && edge.isElement){
		var e = edge.getE();
		e.attributes.explored = false;
		e.attributes.aExplored = false;
		edge = edge.getNext();
	}

	var orderedVertices = [];

	var vertex = graph.getVertexList().getFirst();
	while(vertex && vertex.isElement){
		var v = vertex.getE();
		if(v.attributes.explored === false){
			topoSort(v);
		}
		vertex = vertex.getNext();
	}
	
	function topoSort(vertex){

		if(vertex.attributes.explored === false){
			
			vertex.attributes.explored = true;

			var edge = vertex.getIncidence().getFirst();
			
			while(edge && edge.isElement){
				
				var e = edge.getE();

				if(e.attributes.explored === false && e.comesFrom(vertex)){
					
					var other = e.getOther(vertex);
					
					if(other.attributes.explored == false){
						e.attributes.explored = true;
						e.attributes.discovery = true;
						
						topoSort(other);
					} else {
						e.attributes.explored = true;
						e.attributes.discovery = false;
					}
				}
				
				edge = edge.getNext();
			}

			vertex.attributes.number = n;
			orderedVertices[n] = vertex;
			n--;
		}
	}

	graphTool.render();

	graphTool.addAnimationFrame(function(a){
		var v = a[0];
		graphTool.highlightNode(v);
		v.attributes.aExplored = true;
		v.attributes.label = ""+v.attributes.distance;
	}, [selectedVertex]);

	for(var i in orderedVertices){

		var vertex = orderedVertices[i];
		
		var edge = vertex.getIncidence().getFirst();
		while(edge && edge.isElement){
			var e = edge.getE();
			
			if(e.comesFrom(vertex)){
				
				var other = e.getOther(vertex);
				
				var newDistance = vertex.attributes.distance + e.getWeight();
				if(newDistance < other.attributes.distance){
					other.attributes.distance = newDistance;
					other.attributes.discoveryEdge = e;

					graphTool.addAnimationFrame(function(a){
						var v = a[0];
						v.attributes.aExplored = true;
						v.attributes.label = a[1];
						var e = a[2];
						var edge = graph.getEdgeList().getFirst();
						while(edge && edge.isElement){
							if(edge.getE().getB() == v){edge.getE().attributes.aExplored = false;};
							edge = edge.getNext();
						}
						e.attributes.aExplored = true;
						e.attributes.aDiscovery = true;
						graphTool.highlightNode(e.getOther(v));
					}, [other, newDistance, e]);
				}
			}
			
			edge = edge.getNext();
		}
	}
	
	
}









