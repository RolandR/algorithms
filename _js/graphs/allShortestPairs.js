
/*
	Finds all shortest paths between all pairs of vertices
	Similar to Floyd-Warshall's Algorithm

	Runs in O(n^3) assuming areAdjacent is O(1) (Adjacency matrix)
*/

function allShortestPairs(graphTool){
	
	graphTool.resetAttributes();

	var graph = graphTool.getGraph();

	var i = 0;
	var vertex = graph.getVertexList().getFirst();
	while(vertex && vertex.isElement){
		i++;
		var v = vertex.getE();
		v.attributes.explored = false;
		v.attributes.aExplored = false;
		v.attributes.number = i;
		vertex = vertex.getNext();
	}

	var n = i;

	var edge = graph.getEdgeList().getFirst();
	while(edge && edge.isElement){
		var e = edge.getE();
		e.attributes.explored = false;
		e.attributes.aExplored = false;
		e.attributes.label = e.getWeight();
		e.attributes.w = e.getWeight();
		edge = edge.getNext();
	}

	graphTool.render();

	var newBetterDistances = [];

	var kVertex = graph.getVertexList().getFirst();
	while(kVertex && kVertex.isElement){
		var k = kVertex.getE();

		graphTool.addAnimationFrame(function(a){
			var v = a[0];
			graphTool.highlightNode(v);
		}, [k]);

		var iVertex = graph.getVertexList().getFirst();
		while(iVertex && iVertex.isElement){
			var i = iVertex.getE();
			if(i != k){

			var jVertex = graph.getVertexList().getFirst();
			while(jVertex && jVertex.isElement){
				var j = jVertex.getE();
				if(j != i && j != k){

					var ik = i.isConnectedTo(k);
					var kj = k.isConnectedTo(j);
					var ij = i.isConnectedTo(j);
					
					if(ik && kj){
						
						if(!ij){
							
							var newEdge = graph.connect(i, j, ik.attributes.w + kj.attributes.w);
							newEdge.attributes.temporary = true;
							newEdge.attributes.invisible = true;
							newEdge.attributes.w = newEdge.getWeight();

							graphTool.registerEdge(newEdge);
							
							graphTool.addAnimationFrame(function(a){
								var e = a[0];
								e.attributes.invisible = false;
							}, [newEdge]);
							
						} else {
							
							if(ij.attributes.w > ik.attributes.w + kj.attributes.w){
								ij.attributes.w = (ik.attributes.w + kj.attributes.w);
								newBetterDistances.push([ij, ij.attributes.w]);
							}
							
						}
					}
				
				}
				jVertex = jVertex.getNext();
			}
			
			}
			iVertex = iVertex.getNext();
		}

		if(newBetterDistances.length > 0){
			graphTool.addAnimationFrame(function(a){
				var arr = a[0];
				for(var i in arr){
					arr[i][0].attributes.label = arr[i][1];
				}
			}, [Array.from(newBetterDistances)]);
			newBetterDistances = [];
		}
		
		kVertex = kVertex.getNext();
	}

	graphTool.render();
}

































