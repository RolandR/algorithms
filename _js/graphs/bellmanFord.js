
/*
	Bellman-Ford Algorithm

	runs in O(nm) using adjacency list
	
*/
function bellmanFord(graphTool){
	
	var selectedVertex = graphTool.getSelectedVertex();
	
	if(!selectedVertex){
		return false;
	}

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

	graphTool.addAnimationFrame(function(a){
		var v = a[0];
		graphTool.highlightNode(v);
		v.attributes.aExplored = true;
		v.attributes.label = ""+v.attributes.distance;
	}, [selectedVertex]);

	for(var i = 1; i < graph.getVertexCount(); i++){
		var edge = graph.getEdgeList().getFirst();
		while(edge && edge.isElement){
			var e = edge.getE();

			var from = e.getA();
			var to = e.getB();

			var newDistance = from.attributes.distance + e.getWeight();

			if(newDistance < to.attributes.distance){
				to.attributes.distance = newDistance;
				to.attributes.discoveryEdge = e;

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
				}, [to, newDistance, e]);
			}
			
			edge = edge.getNext();
		}
	}	
}

