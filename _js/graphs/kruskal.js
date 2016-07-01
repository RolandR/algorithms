
/*
	Kruskal's Algorithm

	Finds Minimum Spanning Tree

	runs in O((n+m) log n)
	
*/
function kruskal(graphTool){

	var queue = new Heap();
	var partition = new Partition();

	graphTool.resetAttributes();

	var graph = graphTool.getGraph();

	var vertex = graph.getVertexList().getFirst();
	while(vertex && vertex.isElement){
		var v = vertex.getE();
		v.attributes.explored = false;
		v.attributes.aExplored = false;

		v.attributes.partitionEl = partition.insert(v);
		
		vertex = vertex.getNext();
	}

	var edge = graph.getEdgeList().getFirst();
	while(edge && edge.isElement){
		var e = edge.getE();
		e.attributes.explored = false;
		e.attributes.aExplored = false;

		var node = queue.insert(e.getWeight(), e);
		e.attributes.queueElement = node.getE();
		
		edge = edge.getNext();
	}

	graphTool.render();

	var next = queue.remove();
	while(next){
		var edge = next.getValue();
		edge.attributes.explored = true;

		var from = edge.getA();
		var to = edge.getB();

		if(from.attributes.partitionEl.getSett() != to.attributes.partitionEl.getSett()){
			from.attributes.partitionEl.union(to.attributes.partitionEl);
			
			graphTool.addAnimationFrame(function(a){
				a[0].attributes.aExplored = true;
				a[1].attributes.aExplored = true;
				a[2].attributes.aExplored = true;
				a[2].attributes.aDiscovery = true;
			}, [from, to, edge]);
			
		}
		
		next = queue.remove();
	}

	graphTool.addAnimationFrame(function(a){
		var edge = a[0].getFirst();
		while(edge && edge.isElement){
			var e = edge.getE();
			if(!e.attributes.aDiscovery){
				e.attributes.invisible = true;
			};
			edge = edge.getNext();
		}
	}, [graph.getEdgeList()]);
	
}









