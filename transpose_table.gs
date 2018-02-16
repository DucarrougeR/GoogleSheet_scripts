function transposeArray(array){
  var result = [];
  var col;
  var row; 
  
  for (col = 0; col < array[0].length; col++) { // Loop over array cols
    result[col] = [];
    
    for (row = 0; row < array.length; row++) { // Loop over array rows
      result[col][row] = array[row][col]; // Rotate
    }
  }
  return result;
}