/*

=== Tree ===

*/


function Tree(){

	//eh, I've done trees

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

