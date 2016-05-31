/*

=== Binary Search Tree ===

*/


function BinarySearchTree(){

	var root = new Element(null, false);

	var length = 0;

	function Element(p, l){
		var e = null;
		var left = l;
		var parent = p;
		var left = null;
		var right = null;
		var isExternal = true;

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
			,isLeft: function(){return left;}
			,setIsLeft: function(p){left = p;}
		};
	}

	function Pair(k, v){
		var key = k;
		var value = v;

		return {
			 getKey: function(){return key;}
			,getValue: function(){return value;}
		};
	}

	function swap(a, b){
		var aContent = a.getE();
		a.setE(b.getE());
		b.setE(aContent);
	}

	function insert(key, value){
		var pair = new Pair(key, value);

		return insertRecursively(root, pair);	
		
	}

	function insertRecursively(node, pair){
		
		if(node.getExternal()){
			node.setExternal(false);
			node.setE(pair);
			node.setLeft(new Element(node, true));
			node.setRight(new Element(node, false));

			length++;

			return node;
			
		} else {
			if(pair.getKey() < node.getE().getKey()){
				return insertRecursively(node.getLeft(), pair);
			} else {
				return insertRecursively(node.getRight(), pair);
			}
		}
	}

	function search(key){
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
			if(node.getParent()){
				var replacement;
				if(node.getLeft().getExternal()){
					replacement = node.getRight();
				} else if(node.getRight().getExternal()){
					replacement = node.getLeft();
				}
				replacement.setIsLeft(node.isLeft());
				if(replacement.isLeft()){
					node.getParent().setLeft(replacement);
				} else {
					node.getParent().setRight(replacement);
				}
			}
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
			out.push('<span style="background-color: #FFCCAA">('+node.getE().getKey()+', '+node.getE().getValue()+')</span>');
			
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
		 insert: insert
		,search: search
		,remove: remove
		,print: print
		,getRoot: function(){return root;}
	};
}

/*

	Binary tree sort:
	Traverse binary tree inorder

*/

function binaryTreeSort(sortString){
	
	var tree = new BinarySearchTree();
	
	sortString = sortString.split("");

	for(var i in sortString){
		var el = sortString[i];
		tree.insert(el, el);
	}

	tree.print("out");

	var sortedString = inorderPrintKeys(tree.getRoot());
	
	function inorderPrintKeys(node){
		if(node.getExternal()){
			return "";
		} else {
			return inorderPrintKeys(node.getLeft()) + node.getE().getKey() + inorderPrintKeys(node.getRight());
		}
	}

	return sortedString;
	
}




























