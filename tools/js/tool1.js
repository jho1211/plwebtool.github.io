function runTool(fasta, numTRFs, genome){
  var input = document.getElementById(fasta).value;
  var refFileName = document.getElementById(genome).value;

  try{
    var fileName = document.getElementById(genome).value;
    var fileToRead = fetch('../db/' + fileName + '.txt')
    console.log(fileToRead.text);
  }
  catch(err){
    console.log(err);
  }

  console.log(refFileName);
}

function binarySearch(seq, ref){
  var first = 0;
  var last = ref.length - 1;
  var i = -1;
  var found = false;

  while ((i == -1) && (first <= last)){
    var mid = Math.floor((first + last) / 2);

    if (ref[mid] == seq){
      i = mid;
      found = true;
    }

    else if (seq < ref[mid]){
      last = mid - 1
    }

    else{
      first = mid + 1
    }
  }

  return found
}

function generateSeqs(fasta, ref){

}
