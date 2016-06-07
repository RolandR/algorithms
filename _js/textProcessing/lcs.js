

/*
	Find longest common subsequences of two texts
*/

function findLCS(text1, text2){
	var lengths = [];
	
	for(var i = -1; i < text1.length; i++){
		lengths[i] = [];
		lengths[i][-1] = 0;
	}
	for(var k = -1; k < text2.length; k++){
		lengths[-1][k] = 0;
	}

	var grid = " " + text2 + "\n";
	for(var i = 0; i < text1.length; i++){
		var line = text1.charAt(i);
		for(var k = 0; k < text2.length; k++){

			if(text1.charAt(i) == text2.charAt(k)){
				lengths[i][k] = lengths[i-1][k-1] + 1;
			} else {
				lengths[i][k] = max([lengths[i][k-1], lengths[i-1][k]]);
			}

			line += lengths[i][k];
			
		}

		grid += line + "\n";
	}

	console.log(grid);


	function getLCS(i, k){
		if(i < 0 || k < 0){
			return [""];
		} else if (lengths[i][k-1] == lengths[i][k] && lengths[i-1][k] == lengths[i][k]) {
			return getLCS(i, k-1).concat(getLCS(i-1, k));
			
		} else if (lengths[i][k-1] == lengths[i][k]) {
			return getLCS(i, k-1);
		} else if (lengths[i-1][k] == lengths[i][k]) {
			return getLCS(i-1, k);
		} else {
			var results = getLCS(i-1, k-1);
			for(var r in results){
				results[r] += text1.charAt(i);
			}
			return results;
		}
	}

	var results = getLCS(text1.length-1, text2.length-1);
	var resultsSet = new Set();
	for(var r in results){
		resultsSet.insert(results[r]);
	}
	return resultsSet.toArray();

	

}