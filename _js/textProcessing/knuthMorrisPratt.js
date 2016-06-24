

/*
	Match string in text using Knuth-Morris-Pratt's algorithm
	Runs in O(m+n)
	
*/
function matchKMP(text, string){

	var difference = text.length - string.length;
	
	if(difference >= 0){


		// f[j] is length of longest prefix of 0..j that is also
		//   suffix of 1..j

		var f = [0];

		var i = 1;
		var j = 0;

		while(i < string.length){
			if(string[i] == string[j]){
				f[i] = j + 1;
				i++;
				j++;
			} else if(j > 0){
				j = f[j-1];
			} else {
				f[i] = 0;
				i++;
			}
		}

		console.log(f);

		i = 0;
		j = 0;

		//var compared = "";

		while(i < text.length){

			//compared += string[j];
				
			if(text[i] == string[j]){
				if(j == string.length-1){
					return i-j;
				} else {
					i++;
					j++;
				}
			} else {

				/*var whitespace = "";
				var x = i - compared.length + 1;
				while(x--){
					whitespace += " ";
				}
				console.log(text + "\n" + whitespace + compared);
				compared = "";*/
				
				if(j>0){
					j = f[j-1];
				} else {
					i++;
				}
			}
		}

		return -1;
		
	} else {
		console.error("String is longer than Text!");
		return -1;
	}
}
