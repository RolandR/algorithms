/*

=== Huffman tree ===

*/


function HuffmanTree(){

	var root = null;

	var values = {};

	function Element(p, l, external){
		var e = null;
		var freq = null; // hack for leafs
		var isLeftChild = l;
		var parent = p;
		var left = null;
		var right = null;
		var isExternal = external;

		return {
			 getE: function(){return e;}
			,setE: function(p){e = p;}
			,getParent: function(){return parent;}
			,setParent: function(p){parent = p;}
			,getLeft: function(){return left;}
			,setLeft: function(p){left = p;}
			,getRight: function(){return right;}
			,setRight: function(p){right = p;}
			,getExternal: function(){return isExternal;}
			,setExternal: function(p){isExternal = p;}
			,isLeft: function(){return isLeftChild;}
			,setIsLeft: function(p){isLeftChild = p;}
			,getFrequency: function(){return freq;}
			,setFrequency: function(p){freq = p;}
		};
	}

	function generate(string){
		var frequencies = {};
		for(var i in string){
			if(frequencies[string[i]] > -1){
				frequencies[string[i]]++;
			} else {
				frequencies[string[i]] = 1;
			}
		}

		var smallestSubtrees = new Heap();

		for(var i in frequencies){
			var subtree = new Element(null, false, true);
			subtree.setE(i);
			subtree.setFrequency(frequencies[i]);
			smallestSubtrees.insert(frequencies[i], subtree);
		}

		var first =  smallestSubtrees.remove();
		var second = smallestSubtrees.remove();

		while(first && second){
			var subtree = new Element(null, false, false);

			var firstSubtree = first.getValue();
			firstSubtree.setIsLeft(true);
			firstSubtree.setParent(subtree);
			subtree.setLeft(firstSubtree);

			var secondSubtree = second.getValue();
			secondSubtree.setParent(subtree);
			subtree.setRight(secondSubtree);

			var frequency = first.getKey() + second.getKey();

			subtree.setE(frequency);

			smallestSubtrees.insert(frequency, subtree);

			first =  smallestSubtrees.remove();
			second = smallestSubtrees.remove();
		}
		
		root = first.getValue();
		root.setE(first.getKey());

		var codeTable = getCodeTable();
		for(var i in codeTable){
			values[codeTable[i][0]] = codeTable[i][1];
		}
	}

	function encode(string){
		var out = "";
		for(var i in string){
			if(values[string[i]] > -1){
				out += values[string[i]];
			} else {
				console.warn("Skipped "+string[i]);
			}
		}
		return out;
	}

	function decode(string){
		var out = "";
		var node = root;
		
		for(var i in string){
			if(string[i] == "0"){
				node = node.getLeft();
			} else if(string[i] == "1"){
				node = node.getRight();
			}
			if(node.getExternal()){
				out += node.getE();
				node = root;
			}
		}
		return out;
	}

	function getCodeTable(node, pathSoFar){

		if(!node){
			node = root;
		}
		if(!pathSoFar){
			pathSoFar = "";
		}
		
		if(node.getExternal()){ // "external"
			return [[node.getE(), pathSoFar]];
		}
		var leftCodes  = getCodeTable(node.getLeft(),  pathSoFar + "0");
		var rightCodes = getCodeTable(node.getRight(), pathSoFar + "1");

		return leftCodes.concat(rightCodes); // join(left, right)
		
	}

	function print(elementId){
		var outString = "Length: "+length+"<br />\n";

		var arr = buildFancy(root);
		var out = "";
		for(var i in arr){
			out += arr[i] + "<br />\n";
		}

		outString += out;
		outString += "<br />\n";

		for(var i in values){
			outString += i + ": " + values[i] + "<br />\n";
		}

		if(elementId){
			document.getElementById(elementId).innerHTML = outString;
		}
		
		return outString;
	}

	function buildFancy(node){

		if(node.getExternal()){
			return ['<span style="background-color: #FFFFAA">'+node.getFrequency() + ', ' + node.getE()+'</span>'];
		} else {				
			var out = [];
			out.push('<span style="background-color: #FFCCAA">'+node.getE()+'</span>');
			
			var left = buildFancy(node.getLeft());
			var right = buildFancy(node.getRight());
			for(var i in left){
				var l = left[i];
				if(i == 0){
					l = "├" + l;
				} else {
					l = "│" + l;
				}
				out.push(l);
			}
			for(var i in right){
				var r = right[i];
				if(i == 0){
					r = "└" + r;
				} else {
					r = "&nbsp;" + r;
				}
				out.push(r);
			}
			
			return out;
		}
	}

	return {
		 generate: generate
		,getCodeTable: getCodeTable
		,encode: encode
		,decode: decode
		,print: print
		,getRoot: function(){return root;}
	};
}
























