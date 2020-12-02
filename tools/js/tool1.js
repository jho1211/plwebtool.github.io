/*
Declare some global variables
*/

var ref;
var refSeqs;
var refDescs;

// End of declaration

async function getData(url){

  const response = await fetch(url);

  return response.text();
}

async function runTool(fasta, fastaFile, numTRFs, genome, outputid){
  hideAllAlerts();

  var input = document.getElementById(fasta).value;
  var fileInput = document.getElementById(fastaFile).files;
  var max = parseInt(document.getElementById(numTRFs).value);
  var output;

  showAlert("loadAlert");

  if (max == -1 || max == 0 || isNaN(max)){
    max = Infinity;
  }

  try{
    var fileName = document.getElementById(genome).value;

    ref = await getData('https://plwebtool.github.io/tools/db/' + fileName);
  }
  catch(err){
    alert('Species not implemented yet.');
  }

  if (input == ""){
    if (fileInput.length == 0){

      showAlert("errorAlert");
      hideAlert("loadAlert");

      return undefined;
    }
    else{
      input = document.getElementById("fastaFileText").textContent;
    }
  }
  else{
    input = document.getElementById(fasta).value;

  }

  output = findTRFs(input, max);

  document.getElementById(outputid).value = output;

  hideAlert('loadAlert');
  showAlert("successAlert");

  enableButton("download");

  return undefined;
}

function binarySearch(seq){
  var first = 0;
  var last = refSeqs.length - 1;
  let i = -1;
  var found = false;

  while ((i == -1) && (first <= last)){
    var mid = Math.floor((first + last) / 2);

    if (refSeqs[mid].includes(seq)){
      i = mid;
      found = true;
    }

    else if (seq < refSeqs[mid]){
      last = mid - 1
    }

    else{
      first = mid + 1
    }
  }

  if (found){
    return mid;
  }
  else{
    return false;
  }
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

  start = desc.indexOf('tRNA');
  end = desc.indexOf(' ');

  // Returns the name of the tRF the sequence corresponds to
  return desc.slice(start, end)
}

function searchRef(seq){
  /* Search for the seq in the reference text
     Return the name of the tRF it corresponds to if found */

  let result = binarySearch(seq)

  if (typeof(result) == "number"){
    return trfName(refDescs[result])
  }
  else{
    return false;
  }
}

function isTRF(seq){
  var subseqs = generateSubsequences(seq)

  for (var i = 0; i < subseqs.length; i++){
    var result = searchRef(subseqs[i]);

    if (typeof(result) == "string"){
      return result + ', sequence matched: ' + subseqs[i];
    }
  }

  return false;
}

function findTRFs(fasta, limit){
  var fastaArray = fasta.split('\n');

  var descs = nthElements(fastaArray, 0, 2);
  var seqs = nthElements(fastaArray, 1, 2);

  var refArray = ref.split('\n');
  refDescs = nthElements(refArray, 0, 2);
  refSeqs = nthElements(refArray, 1, 2);

  var newFastaArray = [];

  for (var i = 0; i < seqs.length; i++){

    if ((newFastaArray.length / 2) == limit){
      return newFastaArray.join('\n');
    }

    var result = isTRF(seqs[i]);


    if (typeof(result) == "string"){
      newFastaArray.push(descs[i] + ' (' + result + ' )');
      newFastaArray.push(seqs[i]);
    }
  }

  return newFastaArray.join('\n');
}
