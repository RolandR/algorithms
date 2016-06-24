

/*
	Match string in text using Boyer-Moore's algorithm
	runs in O(nm+s)
	Good for written language
	
*/
function matchBoyerMoore(text, string){

	var difference = text.length - string.length;
	
	if(difference >= 0){

		var lastOccurrence = {};

		for(var i in string){
			lastOccurrence[string[i]] = i;
		}

		var i = string.length - 1;
		var j = string.length - 1;

		var w;
		
		while(i <= text.length - 1){

			// Debug output!
			if(w != i-j){
				var whitespace = "";
				w = i-j;
				var x = w;
				while(x--){
					whitespace += " ";
				}
				console.log(text + "\n" + whitespace + string);
			}
			
			if(string[j] == text[i]){
				if(j == 0){
					return i;
				} else {
					i--;
					j--;
				}
			} else {
				
				var index = lastOccurrence[text[i]];
				if(index > -1){
					i += string.length - Math.min(j, index*1 + 1);
				} else {
					i += string.length+1;
				}
				j = string.length - 1;
			}
			
		}

		return -1;
		
	} else {
		console.error("String is longer than Text!");
		return -1;
	}
}
