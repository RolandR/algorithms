/*

=== Priority Queue ===

Insert takes O(n) time
Remove takes O(1) time

*/


function PriorityQueue(){

	var first = null;
	var last = null;

	var length = 0;

	function Element(content){
		var e = content;
		var next = null;

		return {
			 getE: function(){return e;}
			,getNext: function(){return next;}
			,setNext: function(n){next = n;}
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

	function insert(key, value){
		var pair = new Pair(key, value);
		
		if(length == 0){
			
			first = new Element(pair);
			last = first;
			
		} else {
			var node = first;
			var previous = null;
			
			do{
				if(node.getE().getKey() > pair.getKey()){
					// Insert before
					if(previous){
						previous.setNext(new Element(pair));
						previous.getNext().setNext(node);
					} else {
						first = new Element(pair);
						first.setNext(node);
					}
					break;
				} else {
					if(!node.getNext()){
						node.setNext(new Element(pair));
						last = node.getNext();
						break;
					}
				}
				previous = node;
				node = node.getNext();
			} while (node)
		}

		length++;
	}

	function getAt(key){		
		var node = first;
		
		while(node){
			if(node.getE().getKey() == key){
				return node.getE().getValue();
			}
			node = node.getNext();
		}

		return null;
	}

	function peek(){
		return first;
	}

	function remove(){
		if(length > 0){
			var e = first.getE();
			first = first.getNext();
			length--;
			return e;
		} else {
			return null;
		}
	}

	function print(){
		var outString = "Length: "+length+"\n";

		if(length > 0){
			var node = first;
			do{
				outString += "("+node.getE().getKey()+", "+node.getE().getValue()+")";
				if(node != last){
					outString += " -> ";
				}
				node = node.getNext();
			} while (node)
		}
		
		return outString;
	}

	return {
		 insert: insert
		,peek: peek
		,getAt: getAt
		,remove: remove
		,print: print
	};
}

/*
	Takes O(n²)
	Insertion Sort (PQ-Sort)
*/

function sortUsingPriorityQueue(sortString){
	sortString = sortString.split("");
	var sortQueue = new PriorityQueue();

	for(var i in sortString){
		var el = sortString[i];
		sortQueue.insert(el, el);
	}

	var sortedString = "";

	var nextEl;
	do{
		nextEl = sortQueue.remove();
		if(nextEl != null){
			sortedString += nextEl.getKey();
		}
	} while(nextEl != null)

	return sortedString;
}






























