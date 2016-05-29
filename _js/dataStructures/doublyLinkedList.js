/*

=== Doubly linked list ===

*/


function DoublyLinkedList(){

	var head = new function(){
		var next = null;
		var prev = null;
		return {
			 getNext: function(){return next;}
			,setNext: function(n){next = n;}
			,getPrev: function(){return prev;}
			,setPrev: function(p){prev = p;}
			,isElement: false
			,name: "head"
		};
	};
	
	var tail = new function(){
		var next = null;
		var prev = null;
		return {
			 getNext: function(){return next;}
			,setNext: function(n){next = n;}
			,getPrev: function(){return prev;}
			,setPrev: function(p){prev = p;}
			,isElement: false
			,name: "tail"
		};
	};

	head.setPrev(head);
	head.setNext(tail);
	tail.setPrev(head);
	tail.setNext(tail);

	var length = 0;

	function Element(content, p, n){
		var e = content;
		var next = n;
		var prev = p;

		function remove(){
			prev.setNext(next);
			next.setPrev(prev);
			length--;
			return e;
		}

		return {
			 getE: function(){return e;}
			,setE: function(p){e = p;}
			,getNext: function(){return next;}
			,setNext: function(n){next = n;}
			,getPrev: function(){return prev;}
			,setPrev: function(p){prev = p;}
			,isElement: true
			,isFirst: function(){return (this.prev == head);}
			,isLast: function(){return (this.next == tail);}
			,remove: remove
		};
	}

	function insertBefore(content, position){

		var prev = position.getPrev();
		var newNode = new Element(content, prev, position);
		prev.setNext(newNode);
		position.setPrev(newNode);
		
		length++;

		return newNode;
	}

	function insertAfter(content, position){
		return insertBefore(content, position.getNext());
	}

	function insertFirst(content){
		return insertAfter(content, head);
	}

	function insertLast(content){
		return insertBefore(content, tail);
	}

	function getFirst(){
		if(length > 0){
			return head.getNext();
		} else {
			return null;
		}
	}

	function getLast(){
		if(length > 0){
			return tail.getPrev();
		} else {
			return null;
		}
	}

	function swapContent(a, b){
		var aContent = a.getE();
		a.setE(b.getE());
		b.setE(aContent);
	}

	function print(){
		var outString = "Length: "+length+"\n";

		if(length > 0){
			var node = head.getNext();
			while (node.isElement){
				outString += node.getE();
				if(node.getNext() != tail){
					outString += " <-> ";
				}
				node = node.getNext();
			}
		}
		
		return outString;
	}

	return {
		 insertBefore: insertBefore
		,insertAfter: insertAfter
		,insertFirst: insertFirst
		,insertLast: insertLast
		,swapContent: swapContent
		,getFirst: getFirst
		,getLast: getLast
		,print: print
	};
}












