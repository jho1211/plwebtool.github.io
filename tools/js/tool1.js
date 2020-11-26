async function getData(url){

  const response = await fetch(url);

  return response.text();
}

async function runTool(fasta, numTRFs, genome, outputid){
  var input = document.getElementById(fasta).value;
  var refFileName = document.getElementById(genome).value;

  try{
    var fileName = document.getElementById(genome).value;
    var ref;

    ref = await getData('https://plwebtool.github.io/tools/db/' + fileName + '.txt');
  }
  catch(err){
    alert('Species not implemented yet.');
  }

  var output = findTRFs(input, ref)

  document.getElementById(outputid).value = output;
}

/*
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
*/

function oddArray(arr){
  // Returns the odd numbered index elements
  var newArr = [];

  for (i = 0; i < arr.length; i++){

    if ((i % 2) == 1){
      newArr.push(arr[i]);
    }
  }

  return newArr
}

function evenArray(arr){
  // Returns the even numbered index elements
  var newArr = [];

  for (i = 0; i < arr.length; i++){

    if ((i % 2) == 0){
      newArr.push(arr[i]);
    }
  }

  return newArr
}

function generateSubsequences(seq){
  var seq_ignore_first = seq.slice(1);
  var seq_ignore_first_two = seq.slice(2);
  var seq_ignore_last_two = seq.slice(0, seq.length - 2);
  var seq_ignore_last = seq.slice(0, seq.length - 1);
  var seq_ignore_first_last = seq.slice(1, seq.length - 1);

  return [seq, seq_ignore_first, seq_ignore_first_two, seq_ignore_last_two, seq_ignore_last, seq_ignore_first_last];
}

function trfName(desc){

  // Returns the name of the tRF the sequence corresponds to
  if (desc[11] == '-'){
      return desc.slice(3, 11)
      }
    else{
      return desc.slice(3, 12);
    }
}

function searchRef(seq, ref){
  /* Search for the seq in the reference text
     Return the name of the tRF it corresponds to if found */

  var refArray = ref.split('\n');
  var refDescs = evenArray(refArray);
  var refSeqs = oddArray(refArray);

  for (i = 0; i < refSeqs.length; i++){
    if (refSeqs[i].includes(seq)){
      return trfName(refDescs[i]);
    }
  }

  return false; // return false if nothing is found
}

function isTRF(seq, ref){
  var subseqs = generateSubsequences(seq)

  for (i = 0; i < subseqs.length; i++){
    var result = searchRef(subseqs[i], ref);

    if (typeof(result) == "string"){
      return result + ', sequence matched: ' + subseqs[i];
    }
  }

  return false;
}

function findTRFs(fasta, ref){
  var fastaArray = fasta.split('\n');

  var descs = evenArray(fastaArray);
  var seqs = oddArray(fastaArray);

  var newFastaArray = []

  for (i = 0; i < seqs.length; i++){
    var result = isTRF(seqs[i], ref)

    if (typeof(result) == "string"){
      newFastaArray.push(descs[i] + ' (' + result + ' )');
      newFastaArray.push(seqs[i]);
    }
  }

  return newFastaArray.join('\n');
}
