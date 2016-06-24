

/*
	Match string in text by brute force
	runs in O(nm)
	
*/
function matchBruteForce(text, string){

	var difference = text.length - string.length;
	
	if(difference >= 0){

		for(var i = 0; i <= difference; i++){
			
			var match = true;
			
			for(var e = 0; e < string.length; e++){
				if(string[e] != text[e+i]){
					match = false;
					break;
				}
			}

			if(match){
				return i;
			}
		}

		return -1;
		
	} else {
		console.error("String is longer than Text!");
		return -1;
	}
}
