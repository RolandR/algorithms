function max(numbers){
	var foundMax = numbers[0];
	for(var i in numbers){
		if(numbers[i] > foundMax){
			foundMax = numbers[i];
		}
	}
	return foundMax;
}

function pad(number, width, z) {
	z = z || '0';
	number = number + '';
	
	if(number.length >= width){
		return number;
	} else {
		return new Array(width - number.length + 1).join(z) + number;
	}
}