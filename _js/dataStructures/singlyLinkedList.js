/*

=== Singly linked list ===
(Queue)

Space used is O(n)
Operations take O(1)

*/


function SinglyLinkedList(){

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

	function insert(element){
		if(length == 0){
			
			first = new Element(element);
			last = first;
			
		} else {
			last.setNext(new Element(element));
			last = last.getNext();
		}

		length++;
	}

	function insertFirst(element){
		
		var oldFirst = first;
		first = new Element(element);
		first.setNext(oldFirst);

		length++;
	}

	function remove(){
		if(length > 0){
			var e = first.getE();
			first = first.getNext();
			length--;
			return e;
		}
	}

	function print(){
		var outString = "Length: "+length+"\n";

		if(length > 0){
			var node = first;
			do{
				outString += node.getE();
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
		,insertFirst: insertFirst
		,remove: remove
		,print: print
	};
}

