/*

=== Binary Search Tree ===

*/


function StandardTrie(){

	var root = new Element(null);
	root.setRoot(true);

	var length = 0;

	function Element(p){
		var e = "";
		var parent = p;
		var children = new PriorityQueue();
		var isRoot = false;
		var isExternal = true;

		function insert(string){

			var value = "";
			if(string.length > 0){
				value = string[0];
			}
			
			var node = children.getAt(value);
			
			if(!node){
				node = new Element(this);
				node.setE(value);
				children.insert(value, node);
				isExternal = false;
			}

			if(string.length > 1){
				node.insert(string.substring(1));
			} else if(string.length == 1){
				node.insert("");
			}
		}

		return {
			 getE: function(){return e;}
			,setE: function(p){e = p;}
			,getParent: function(){return parent;}
			,setParent: function(p){parent = p;}
			,getChildren: function(){return children;}
			,insert: insert
			,isLeft: function(){return isLeftChild;}
			,setIsLeft: function(p){isLeftChild = p;}
			,getRoot: function(){return isRoot;}
			,setRoot: function(p){isRoot = p;}
			,getExternal: function(){return isExternal;}
			,setExternal: function(p){isExternal = p;}
		};
	}

	function match(string, node){
		if(!node){
			node = root;
		}

		var value = "";

		if(node.getExternal()){
			if(node.getE() == value){
				return true;
			} else {
				return false;
			}
		}
		
		if(string.length > 0){
			value = string[0];
		}

		var children = node.getChildren();
		
		var child = children.getAt(value);
		
		if(!child){
			return false;
		} else {
			if(string.length > 1){
				return match(string.substring(1), child);
			} else {
				return match("", child);
			}
		}
	}

	/*function search(key){
		return searchRecursively(root, key);
	}

	function searchRecursively(node, key){
		if(node.getExternal()){
			return null;
		} else {
			if(node.getE().getKey() == key){
				return node;
			} else if(key < node.getE().getKey()){
				return searchRecursively(node.getLeft(), key);
			} else {
				return searchRecursively(node.getRight(), key);
			}
		}
	}

	function smallestKey(nodes){
		var smallest = null;
		for(var i in nodes){
			if(!nodes[i].getExternal()){
				if(smallest == null){
					smallest = nodes[i];
				} else {
					if(nodes[i].getE().getKey() < smallest.getE().getKey()){
						smallest = nodes[i];
					}
				}
			}
		}
		return smallest;
	}

	function remove(key){
		var node = search(key);
		if(node){
			return removeNode(node);
		}
		return null;
	}

	function removeNode(node){
		
		if(node.getLeft().getExternal()){
			return removeAboveExternal(node.getLeft());
		} else if(node.getRight().getExternal()){
			return removeAboveExternal(node.getRight());
		} else {

			var traverseNode = node.getRight();
			while(!traverseNode.getExternal()){
				traverseNode = traverseNode.getLeft();
			}

			swap(node, traverseNode.getParent());

			return removeAboveExternal(traverseNode);
			
		}
		
	}

	function removeAboveExternal(exNode){
		
		var node = exNode.getParent();
		var parent = node.getParent();
		var replacement;
		
		if(exNode.isLeft()){
			replacement = node.getRight();
		} else {
			replacement = node.getLeft();
		}
		
		replacement.setIsLeft(node.isLeft());
		replacement.setParent(parent);
		
		if(parent){
			if(node.isLeft()){
				parent.setLeft(replacement);
			} else {
				parent.setRight(replacement);
			}
		} else {
			root = replacement;
		}

		length--;

		return node;
		
	}*/

	function getAllWords(node){
		if(!node){
			node = root;
		}
		
		if(node.getExternal()){
			return [""];
		} else {
			var out = [];
			
			var child = node.getChildren().peek();
			while(child){

				var words = getAllWords(child.getE().getValue());

				for(var i in words){
					out.push(node.getE() + words[i]);
				}
				
				child = child.getNext();
			}

			return out;
		}
	}

	function print(elementId){
		var outString = "Length: "+length+"<br />\n";

		var arr = buildFancy(root);
		var out = "";
		for(var i in arr){
			out += arr[i] + "<br />\n";
		}

		outString += out;

		if(elementId){
			document.getElementById(elementId).innerHTML = outString;
		}
		
		return outString;
	}

	function buildFancy(node){
		
		if(node.getExternal()){
			return ['<span style="background-color: #FFFFAA">[]</span>'];
		} else {
			var out = [];
			out.push('<span style="background-color: #FFCCAA">('+node.getE()+')</span>');

			var child = node.getChildren().peek();
			while(child){
				var e = child.getE().getValue();

				var subtrie = buildFancy(e);

				if(child.getNext()){
					for(var i in subtrie){
						var l = subtrie[i];
						if(i == 0){
							l = "├" + l;
						} else {
							l = "│" + l;
						}
						out.push(l);
					}
				} else {
					for(var i in subtrie){
						var r = subtrie[i];
						if(i == 0){
							r = "└" + r;
						} else {
							r = "&nbsp;" + r;
						}
						out.push(r);
					}
				}
				
				child = child.getNext();
			}
			
			return out;
		}
	}

	return {
		 insert: root.insert
		,getAllWords: getAllWords
		,match: match
		,print: print
		,getRoot: function(){return root;}
	};
}





















