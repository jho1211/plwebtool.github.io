/*
Declare some global variables
*/

var ref;
var refSeqs;
var refDescs;

// End of declaration

// Read the text contained in the text file.
async function fileRead(file){
  var text = await file.text();
  document.getElementById('fastaFileText').textContent = text;
}

// Detect when the user uploads the file and perform some operations
document.querySelector('.custom-file-input').addEventListener('change', function(e){
  if (e.target.files.length != 0){
    let file = e.target.files[0]

    // Change the label of the file input box to match the name of file uploaded
    var nextSibling = e.target.nextElementSibling
    nextSibling.innerText = file.name;

    // Read the file and tell the user it was successful
    fileRead(e.target.files[0])
    alert(file.name + " has been successfully loaded.");
  }
  else{
    // If the user doesn't upload a file, nothing to do
    var nextSibling = e.target.nextElementSibling
    nextSibling.innerText = "Choose file";
  }
})

async function runTool(fasta, fastaFile, num, genome, outputid){
  hideAllAlerts();

  var input = document.getElementById(fasta).value;
  var fileInput = document.getElementById(fastaFile).files;
  var max = parseInt(document.getElementById(num).value);
  var output;

  // Tell the user we are running the program
  showAlert("loadAlert");

  // If max value is not properly formatted, default to no limit
  if (max == -1 || max == 0 || Number.isNaN(max)){
    max = Infinity;
  }

  // Fetch the tRNA database as text from a host
  try{
    var fileName = document.getElementById(genome).value;

    ref = await getData('https://plwebtool.github.io/tools/db/' + fileName);
  }
  catch(err){
    alert('Species not implemented yet.');
  }

  // If no input detected, throw an error
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

  // Keep looking through the tRNA sequences until none remain or sequence found
  while ((i == -1) && (first <= last)){
    var mid = Math.floor((first + last) / 2);

    // Look at middle element of the list
    if (refSeqs[mid].includes(seq)){
      i = mid;
      found = true;
    }
    // Search the left half of the list
    else if (seq < refSeqs[mid]){
      last = mid - 1
    }
    // Search the right half of the list
    else{
      first = mid + 1
    }
  }

  // If we find a tRF, return the position where it was found in the list
  if (found){
    return mid;
  }
  else{
    return false;
  }
}

// Generate the subsequences for a given sequence
function generateSubsequences(seq){
  var seq_ignore_first = seq.slice(1);
  var seq_ignore_first_two = seq.slice(2);
  var seq_ignore_last_two = seq.slice(0, seq.length - 2);
  var seq_ignore_last = seq.slice(0, seq.length - 1);
  var seq_ignore_first_last = seq.slice(1, seq.length - 1);

  return [seq, seq_ignore_first, seq_ignore_first_two, seq_ignore_last_two, seq_ignore_last, seq_ignore_first_last];
}

// Returns the name of the tRF the sequence corresponds to
function trfName(desc){

  start = desc.indexOf('tRNA');
  end = desc.indexOf(' ');

  return desc.slice(start, end)
}

/* Search for the seq in the reference text
   Return the name of the tRF it corresponds to if found */
function searchRef(seq){
  let result = binarySearch(seq)

  // If the search returns a number, we return what tRF it corresponds to
  // Otherwise, we return false
  if (typeof(result) == "number"){
    return trfName(refDescs[result])
  }
  else{
    return false;
  }
}

function isTRF(seq){
  // Generate subsequences of sequence
  var subseqs = generateSubsequences(seq)

  // Search for each subsequence in the tRNA db
  for (var i = 0; i < subseqs.length; i++){
    var result = searchRef(subseqs[i]);

    // If subsequence matches, we return the match
    if (typeof(result) == "string"){
      return result + ', sequence matched: ' + subseqs[i];
    }
  }

  return false;
}

function findTRFs(fasta, limit){
  // Convert the FASTA text to a list of lines from the text
  var fastaArray = fasta.split('\n');

  // Filter for the headers and the sequences and store in separate lists
  var descs = nthElements(fastaArray, 0, 2);
  var seqs = nthElements(fastaArray, 1, 2);

  // Do the same for the tRNA database text
  var refArray = ref.split('\n');
  refDescs = nthElements(refArray, 0, 2);
  refSeqs = nthElements(refArray, 1, 2);

  var newFastaArray = [];

  // Look through each sequence in the sample and search for it in the tRNA db
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
