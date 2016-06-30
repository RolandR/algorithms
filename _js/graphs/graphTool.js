/*
	GraphTool - for displaying and interacting with graphs
*/

function GraphTool(graph, containerId){
	var container = document.getElementById(containerId);
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");

	container.innerHTML = "";
	context.clearRect(0, 0, canvas.width, canvas.height);

	container.appendChild(canvas);

	scale();
	window.onresize = scale;

	var nameCharCode = 65; //A
	
	var selectedNode = null;
	var selectedEdge = null;
	var highlightedNode = null;
	var moveStart = null;
	var screenMoveStart = null;
	var moving = false;

	function selectEdge(e){
		if(selectedNode){
			selectedNode.attributes.marked = false;
			selectedNode = null;
		}

		if(selectedEdge){
			selectedEdge.attributes.marked = false;
			selectedEdge.div.setAttribute("contentEditable", false);
		}
		selectedEdge = e;
		selectedEdge.attributes.marked = true;
		render();
	}

	function selectNode(v){
		if(selectedEdge){
			selectedEdge.attributes.marked = false;
			selectedEdge.div.setAttribute("contentEditable", false);
			selectedEdge = null;
		}

		if(selectedNode){
			selectedNode.attributes.marked = false;
		}
		selectedNode = v;
		selectedNode.attributes.marked = true;
		render();
	}

	window.onkeydown = function(e){
		if(e.code == "Delete"){
			if(selectedNode){
				
				var edge = selectedNode.getIncidence().getFirst();
				while(edge && edge.isElement){
					var e = edge.getE();

					container.removeChild(e.div);
					
					edge = edge.getNext();
				}
				
				selectedNode.remove();
				container.removeChild(selectedNode.div);
				selectedNode = null;
				render();
			}
			if(selectedEdge){

				unregisterEdge(selectedEdge);
				selectedEdge.remove();
				selectedEdge = null;
				render();
				
			}
		}
		if(e.code == "Escape"){
			if(selectedNode){
				selectedNode.attributes.marked = false;
				selectedNode = null;
				render();
			}
			if(selectedEdge){
				selectedEdge.attributes.marked = false;
				selectedEdge = null;
				render();
			}
		}
	}

	canvas.onclick = function(e){
		var name = String.fromCharCode(nameCharCode++);
		var v = graph.insertVertex(name);
		
		v.pos = [
			 e.offsetX
			,e.offsetY
		];

		registerVertex(v);

		if(selectedNode){
			makeConnection(v);
		}

		render();
		
	}

	function makeConnection(v){
		
		var weight = 1;
		var e = graph.connect(selectedNode, v, weight);
		
		registerEdge(e);
		
		selectedNode.attributes.marked = false;
		selectedNode = null;
	}

	function registerVertex(v){
		v.mousedown = function(e){
			moveStart = [
				 v.pos[0]
				,v.pos[1]
			];
			screenMoveStart = [
				 e.clientX
				,e.clientY
			];
			window.onmouseup = v.mouseup;
			window.onmousemove = v.mousemove;
		}

		v.mouseup = function(e){
			if(moveStart && screenMoveStart){
				if(Math.abs(e.clientX - screenMoveStart[0]) > 2 && Math.abs(e.clientY - screenMoveStart[1]) > 2){
					moving = true;
				}
				
				if(!moving){
					if(!selectedNode){
						selectNode(v);
					} else {
						if(selectedNode != v){
							if(selectedNode.isConnectedTo(v)){
								selectNode(v);
							} else {
								makeConnection(v);
							}
						} else {
							selectedNode.attributes.marked = false;
							selectedNode = null;
							render();
						}
					}
				}
			}
			moveStart = null;
			screenMoveStart = null;
			canvas.onmouseup = null;
			canvas.onmousemove = null;
			moving = false;
			render();
		}

		v.mousemove = function(e){
			if(moveStart && screenMoveStart){
				var newX = moveStart[0] + (e.clientX - screenMoveStart[0]);
				var newY = moveStart[1] + (e.clientY - screenMoveStart[1]);
				v.div.setAttribute("style", "top: "+newY+"px; left: "+newX+"px;");
				v.pos = [
					 newX
					,newY
				];

				var edge = v.getIncidence().getFirst();
				while(edge && edge.isElement){
					var e = edge.getE();

					var a = e.getA();
					var b = e.getB();

					var aspect = 2;
					if(graph.isDirected()){
						var aspect = 4;
					}
					var x = b.pos[0] + (a.pos[0] - b.pos[0])/aspect;
					var y = b.pos[1] + (a.pos[1] - b.pos[1])/aspect;

					e.div.style.top = y+"px";
					e.div.style.left = x+"px";
					
					edge = edge.getNext();
				}
				
				render();
				
				if(Math.abs(e.clientX - screenMoveStart[0]) > 2 && Math.abs(e.clientY - screenMoveStart[1]) > 2){
					moving = true;
				}
			}
		}

		v.div = document.createElement("div");
		v.div.className = "vertexLabel";
		v.div.style.left = v.pos[0] + "px";
		v.div.style.top = v.pos[1] + "px";
		v.div.innerHTML = name;
		v.div.onmousedown = v.mousedown;
		container.appendChild(v.div);
	}

	function unregisterEdge(e){
		container.removeChild(e.div);
		render();
	}

	function registerEdge(e){
		
		e.clicked = function(ev){
			e.div.setAttribute("contentEditable", true);
			if(e == selectedEdge){
				
			} else {
				selectEdge(e);
			}
		}

		e.edit = function(ev){
			switch(ev.code){
				case "Delete":
					ev.stopPropagation();
				break;
				case "Escape":
					e.div.setAttribute("contentEditable", false);
					e.div.innerHTML = e.getWeight();
				break;
				case "Enter":
					ev.preventDefault();
					e.div.setAttribute("contentEditable", false);

					var newValue = e.div.innerHTML;
					newValue = parseFloat(newValue);
					if(isNaN(newValue)){
						newValue = e.getWeight();
					}
					e.div.innerHTML = newValue;
					e.setWeight(newValue);
				break;
			}
		}

		e.div = document.createElement("div");
		e.div.className = "edgeLabel";
		
		e.div.innerHTML = e.getWeight();
		e.div.onclick = e.clicked;
		e.div.onkeydown = e.edit;
		e.div.onkeyup = e.edit;
		container.appendChild(e.div);
		
		updateLabelPositions();
		render();
	}

	function render(){

		var vertexRadius = 16;

		context.clearRect(0, 0, canvas.width, canvas.height);

		var edge = graph.getEdgeList().getFirst();
		 
		while(edge && edge.isElement){
			
			var e = edge.getE();

			if(!e.isDirectedOnly() || graph.isDirected()){

				var ax = e.getA().pos[0]+0.5;
				var ay = e.getA().pos[1]+0.5;
				var bx = e.getB().pos[0]+0.5;
				var by = e.getB().pos[1]+0.5;
				

				context.beginPath();
				
				context.moveTo(ax, ay);
				context.lineTo(bx, by);

				if(graph.isDirected()){
					var distance = Math.sqrt((by-ay)*(by-ay) + (bx-ax)*(bx-ax));

					var xUnit = (bx-ax)/distance;
					var yUnit = (by-ay)/distance;
					
					//Draw arrows

					var x = bx - vertexRadius*xUnit;
					var y = by - vertexRadius*yUnit;
					context.moveTo(x, y);
					context.lineTo(x - 20*yUnit - 20*xUnit, y + 20*xUnit - 20*yUnit);
					context.moveTo(x, y);
					context.lineTo(x + 20*yUnit - 20*xUnit, y - 20*xUnit - 20*yUnit);
					
				}

				context.strokeStyle = "#555555";
				
				if(e.attributes.aExplored === false){
					context.strokeStyle = "#AAAAAA";
				} else if(e.attributes.aExplored === true){
					if(e.attributes.aDiscovery === true){
						context.strokeStyle = "#55FF55";
					} else if(e.attributes.aDiscovery === false){
						context.strokeStyle = "#FFBBBB";
						//context.setL = "#BBBBBB";
					}
				}
				
				if(e.attributes.temporary === true){
					context.strokeStyle = "#0088FF";
				}

				if(!e.attributes.invisible){
					context.stroke();
				}

				e.div.className = "edgeLabel";
				
				if(e.attributes.marked){
					e.div.className += " activeEdge";
				}

				if(e.attributes.aExplored === false){
					e.div.className += " unexplored";
				} else if(e.attributes.aExplored === true){
					if(e.attributes.aDiscovery === true){
						e.div.className += " discovery";
					} else if(e.attributes.aDiscovery === false){
						e.div.className += " back";
					}
				}

				if(e.attributes.aWarn === true){
					e.div.className += " warn";
				}

				if(e.attributes.aOkay === true){
					e.div.className += " okay";
				}

				if(e.attributes.temporary === true){
					e.div.className += " temp";
				}

				if(e.attributes.invisible === true){
					e.div.className += " invisible";
				}
			}
			
			edge = edge.getNext();
		}
		
		var vertex = graph.getVertexList().getFirst();
		 
		while(vertex && vertex.isElement){
			var v = vertex.getE();

			v.div.className = "vertexLabel";
			
			if(v.attributes.marked){
				v.div.className += " activeVertex";
			}

			if(v.attributes.aExplored === false){
				v.div.className += " unexplored";
			} else if(v.attributes.aExplored === true){
				v.div.className += " explored";
			}

			if(v.attributes.aWarn === true){
				v.div.className += " warn";
			}

			if(v.attributes.aOkay === true){
				v.div.className += " okay";
			}

			if(v.attributes.highlighted === true){
				v.div.className += " highlighted";
			}

			if(v.attributes.label){
				v.div.innerHTML = v.attributes.label;
			} else {
				v.div.innerHTML = v.getName();
			}
			
			vertex = vertex.getNext();
		}
	}

	function updateLabelPositions(){
		
		var edge = graph.getEdgeList().getFirst();
		while(edge && edge.isElement){
			var e = edge.getE();

			var a = e.getA();
			var b = e.getB();

			var aspect = 2;
			if(graph.isDirected()){
				var aspect = 4;
			}
			var x = b.pos[0] + (a.pos[0] - b.pos[0])/aspect;
			var y = b.pos[1] + (a.pos[1] - b.pos[1])/aspect;

			e.div.style.top = y+"px";
			e.div.style.left = x+"px";

			if(!graph.isDirected() && e.isDirectedOnly()){
				e.div.style.display = "none";
			} else {
				e.div.style.display = "block";
			}
			
			edge = edge.getNext();
		}
		
	}

	var actions = [];
	var stepButton = document.getElementById("step");
	stepButton.onclick = performAction;
	var skipButton = document.getElementById("skip");
	skipButton.onclick = skipActions;

	function addAnimationFrame(action, arguments){
		actions.push([action, arguments]);
		stepButton.disabled = false;
		skipButton.disabled = false;
	}

	function performAction(){
		
		var action = actions.shift();

		if(actions.length <= 0){
			stepButton.disabled = true;
			skipButton.disabled = true;
		}

		if(action){
			action[0](action[1]);
		}

		render();
	}

	function skipActions(){

		var action;
		
		do{
			action = actions.shift();

			if(action){
				action[0](action[1]);
			}
		} while(actions.length > 0);

		stepButton.disabled = true;
		skipButton.disabled = true;

		render();
	}

	function removeTemporaryEdges(){
		var edge = graph.getEdgeList().getFirst();
		while(edge && edge.isElement){
			var e = edge.getE();
			if(e.attributes.temporary){
				unregisterEdge(e);
				e.remove();
			}
			edge = edge.getNext();
		}
	}
	
	var exportButton = document.getElementById("exportButton");
	exportButton.onclick = exportButtonClick;

	function exportButtonClick(){
		document.getElementById("exportContainer").style.display = "block";
		var exportField = document.getElementById("exportField");

		var base64Code = btoa(asString());

		exportField.value = base64Code;
		
		exportField.focus();
		exportField.select();

		exportField.onkeydown = function(e){
			e.stopPropagation();
			
			if(e.code == "Enter" || e.code == "Escape" || e.code == "Delete"){
				document.getElementById("exportContainer").style.display = "none";
			}
		}

		exportField.onkeyup = function(e){
			e.stopPropagation();
			
			if(e.code == "KeyC"){
				document.getElementById("exportContainer").style.display = "none";
			}
		}
	}

	function asString(){

		/*
			Version 1:
			0: version
			1: directed
			2: vertices (name)
			3: edges (name a, name b, weight, directedOnly)
		*/
		
		var array = [];
		array[0] = 1;
		array[1] = graph.isDirected() ? 1 : 0;
		array[2] = []; // vertices
		var v = graph.getVertexList().getFirst();
		while(v && v.isElement){
			array[2].push([
				 v.getE().getName()
				,v.getE().pos[0]
				,v.getE().pos[1]
			]);
			v = v.getNext();
		}
		
		array[3] = [];
		var e = graph.getEdgeList().getFirst();
		while(e && e.isElement){
			var edge = e.getE();
			array[3].push([
				 edge.getA().getName()
				,edge.getB().getName()
				,edge.getWeight()
				,edge.isDirectedOnly() ? 1 : 0
			]);
			e = e.getNext();
		}
		
		return JSON.stringify(array);
	}

	function fromString(string){
		try{
			var array = JSON.parse(string);
		}catch(ex){
			console.log(ex);
			
			document.getElementById("importButton").className += " warn";
			setTimeout(function(){
				document.getElementById("importButton").className = document.getElementById("importButton").className.replace(" warn", '');
			}, 500);
				
			return false;
		}
		
		// version 1: (array[0])
		
		graph = new Graph(array[1] == 1);

		var verticesByName = {};
		for(var i in array[2]){
			var name = array[2][i][0];
			verticesByName[name] = graph.insertVertex(name);
			verticesByName[name].pos = [array[2][i][1], array[2][i][2]];
			registerVertex(verticesByName[name]);
		}

		for(var i in array[3]){
			var from = verticesByName[array[3][i][0]];
			var to = verticesByName[array[3][i][1]];
			var weight = array[3][i][2];
			var directedOnly = (array[3][i][3]) ? true : false;

			if(from && to){
				var edge = graph.connect(from, to, weight);
				edge.setDirectedOnly(directedOnly);
				registerEdge(edge);
			}
		}

		if(graph.isDirected()){
			document.getElementById("toggleDirectedButton").innerHTML = "Make Undirected";
			document.getElementById("graphToolTitle").innerHTML = "Directed Graph";
		} else {
			document.getElementById("toggleDirectedButton").innerHTML = "Make Directed";
			document.getElementById("graphToolTitle").innerHTML = "Undirected Graph";
		}

		render();
	}

	function resetAttributes(){

		removeTemporaryEdges();

		actions = [];
		stepButton.disabled = true;
		skipButton.disabled = true;

		selectedNode = null;
		selectedEdge = null;
		highlightedNode = null;
		
		var vertex = graph.getVertexList().getFirst();
		while(vertex && vertex.isElement){
			var v = vertex.getE();
			v.attributes = {};
			vertex = vertex.getNext();
		}

		var edge = graph.getEdgeList().getFirst();
		while(edge && edge.isElement){
			var e = edge.getE();
			e.attributes = {};
			edge = edge.getNext();
		}

		updateLabelPositions();
		render();
	}

	function highlightNode(v){
		console.log(v);
		if(highlightedNode){
			highlightedNode.attributes.highlighted = false;
		}
		highlightedNode = v;
		v.attributes.highlighted = true;
		render();
	}

	function getGraph(){
		return graph;
	}

	function getSelectedVertex(){
		return selectedNode;
	}

	function toggleDirected(){
		if(graph.isDirected()){
			graph.makeDirected(false);
			document.getElementById("toggleDirectedButton").innerHTML = "Make Directed";
			document.getElementById("graphToolTitle").innerHTML = "Undirected Graph";
		} else {
			graph.makeDirected(true);
			document.getElementById("toggleDirectedButton").innerHTML = "Make Undirected";
			document.getElementById("graphToolTitle").innerHTML = "Directed Graph";
		}

		updateLabelPositions();
		render();
	}

	function scale(){
		var size = min([container.offsetWidth, container.offsetHeight]);
		canvas.width = size;
		canvas.height = size;
		
		render();
	}

	return {
		 render: render
		,getGraph: getGraph
		,addAnimationFrame: addAnimationFrame
		,performAction: performAction
		,skipActions: skipActions
		,resetAttributes: resetAttributes
		,getSelectedVertex: getSelectedVertex
		,toggleDirected: toggleDirected
		,registerEdge: registerEdge
		,unregisterEdge: unregisterEdge
		,highlightNode: highlightNode
		,asString: asString
		,fromString: fromString
	};
	
}

function graphToolImport(){
	document.getElementById("importContainer").style.display = "block";
	var importField = document.getElementById("importField");
	importField.focus();
	importField.select();

	importField.onkeyup = function(e){
		e.stopPropagation();
		
		if(e.code == "Escape"){
			document.getElementById("importContainer").style.display = "none";
		} else if(e.code == "Enter" || e.code == "KeyV"){
			document.getElementById("importContainer").style.display = "none";
			var base64Code = importField.value;
			
			graphTool = new GraphTool(new Graph(), 'graphTool');
			
			try{
				graphTool.fromString(atob(base64Code));
			}catch(ex){
				console.log(ex);

				document.getElementById("importButton").className += " warn";
				setTimeout(function(){
					document.getElementById("importButton").className = document.getElementById("importButton").className.replace(" warn", '');
				}, 500);
			}
			
			importField.value = "";
		}
	}
}

function graphExampleSelect(e){
	var value = e.options[e.selectedIndex].value;
	if(value){
		graphTool = new GraphTool(new Graph(), 'graphTool');
		
		try{
			graphTool.fromString(atob(value));
		}catch(ex){
			console.log(ex);

			document.getElementById("examplesSelect").className += " warn";
			setTimeout(function(){
				document.getElementById("examplesSelect").className = document.getElementById("examplesSelect").className.replace(" warn", '');
			}, 500);
		}
	}
}

























