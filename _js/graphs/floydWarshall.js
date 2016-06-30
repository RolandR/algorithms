

function floydWarshall(graphTool){
	
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
		edge = edge.getNext();
	}

	graphTool.render();

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

					if(i.isConnectedTo(k) && k.isConnectedTo(j)){
						var newEdge = graph.connect(i, j, 2);
						if(newEdge){
							newEdge.attributes.temporary = true;
							newEdge.attributes.invisible = true;

							graphTool.registerEdge(newEdge);
							
							graphTool.addAnimationFrame(function(a){
								var e = a[0];
								e.attributes.invisible = false;
							}, [newEdge]);
							
						}
					}
				
				}
				jVertex = jVertex.getNext();
			}
			
			}
			iVertex = iVertex.getNext();
		}
		
		kVertex = kVertex.getNext();
	}

	graphTool.render();

	/*var g = [];
	g[0] = Object.create(graph);

	for(var k = 1; k <= n; k++){
		g[k] = Object.create(g[k-1]);
		for(var i = 1; i <= n; i++){
			if(i != k){
				for(var j = 1; j <= n; j++){
					if(j != k && j != i){
						
					}
				}
			}
		}
	}*/
}

