/*

=== Stack data structure ===

When growing arrays:
Incremental strategy adds n new elements to array when growing
	T(n) for n push operations is O(n²)
Doubling strategy doubles size of array when growing
	T(n) for n push operations is O(n)

*/


function Stack(){
	var data = [];
	var stackPointer = 0;

	function push(element){
		data[stackPointer] = element;
		stackPointer++;
	}

	function pop(){
		if(stackPointer != 0){
			stackPointer--;
			return data[stackPointer];
		}
	}

	function top(){
		if(stackPointer != 0){
			return data[stackPointer - 1];
		}
	}

	function size(){
		return stackPointer;
	}

	function isEmpty(){
		return (stackPointer == 0);
	}

	function print(){
		var outString = "StackPointer: "+stackPointer+"\n"
		for(var i = 0; i < stackPointer; i++){
			outString += data[i];
			if(i != stackPointer-1){
				outString += ", ";
			}
		}
		return outString;
	}

	return {
		 push: push
		,pop: pop
		,top: top
		,size: size
		,isEmpty: isEmpty
		,print: print
	};
}
