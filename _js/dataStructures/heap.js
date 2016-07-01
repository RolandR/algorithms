/*

=== Heap using Binary Tree ===

*/


function Heap(){

	var root = new Element(null);

	var length = 0;

	var freeNodes = new SinglyLinkedList();
	freeNodes.insert(root);
	var newNodes = new SinglyLinkedList();
	var pairs = [];

	function Element(p){
		var e = null;
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
		};
	}

	function Pair(k, v, n){
		var key = k;
		var value = v;
		var node = n;

		function updateKey(k, foo){			
			key = k;
			
			if(node.getParent()){
				if(key < node.getParent().getE().getKey()){
					upheap(node);
				} else {
					downheap(node);
				}
			} else {
				downheap(node);
			}
		}

		return {
			 getKey: function(){return key;}
			,updateKey: updateKey
			,getValue: function(){return value;}
			,setValue: function(p){value = p;}
			,getNode: function(){return node;}
			,setNode: function(p){node = p;}
		};
	}

	function swap(a, b){
		var aContent = a.getE();
		a.setE(b.getE());
		b.setE(aContent);
		
		a.getE().setNode(a);
		b.getE().setNode(b);
	}

	function insert(key, value){
		
		var node = freeNodes.remove();
		var pair = pairs.push(new Pair(key, value, node));
		pair = pairs[pair-1];

		node.setExternal(false);
		node.setE(pair);
		node.setLeft(new Element(node));
		node.setRight(new Element(node));
		freeNodes.insert(node.getLeft());
		freeNodes.insert(node.getRight());
		
		newNodes.insertFirst(node);

		length++;

		return upheap(node);
	}

	function smallestKey(nodes){
		var smallest = null;
		for(var i in nodes){
			if(smallest == null){
				smallest = nodes[i];
			} else if(!nodes[i].getExternal()){
				if(nodes[i].getE().getKey() < smallest.getE().getKey()){
					smallest = nodes[i];
				}
			}
		}
		return smallest;
	}

	function upheap(node){
		if(node.getParent()){
			if(node.getE().getKey() < node.getParent().getE().getKey()){
				swap(node, node.getParent());
				return upheap(node.getParent());
			} else {
				return node;
			}
		} else {
			return node;
		}
	}

	function downheap(node){
		
		var smallest = smallestKey([node, node.getRight(), node.getLeft()]);
		if(smallest == node){
			return node;
		} else {
			swap(node, smallest);
			return downheap(smallest);
		}
		
		return node;
		
	}

	function remove(){
		// return content of smallest element (root)
		
		if(length > 0){
			var e = root.getE();
			e.setNode(null);
			var last = newNodes.remove();
			swap(root, last);
			last.setExternal(true);
			last.setE(null);
			freeNodes.insertFirst(last);
			length--;
			if(length > 0){
				downheap(root);
			}
			return e;
		} else {
			return null;
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
			document.getElementById(elementId).innerHTML += outString;
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
		,remove: remove
		,print: print
		,root: root
	};
}

/*
	Heap Sort
	
	Takes O(n log n)
*/

function heapSort(sortString){
	sortString = sortString.split("");
	var sortHeap = new Heap();

	for(var i in sortString){
		var el = sortString[i];
		sortHeap.insert(el, el);
	}
	
	var sortedString = "";

	var nextEl;
	do{
		nextEl = sortHeap.remove();
		if(nextEl != null){
			sortedString += nextEl.getKey();
		}
	} while(nextEl != null)

	return sortedString;
}































