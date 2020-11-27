async function getData(url){

  const response = await fetch(url);

  return response.text();
}

async function runTool(fasta, numTRFs, genome, outputid){
  var input = document.getElementById(fasta).value;
  var refFileName = document.getElementById(genome).value;
  var max = parseInt(document.getElementById(numTRFs).value);

  if (max == -1 || max == 0 || isNaN(max)){
    max = Infinity;
  }

  try{
    var fileName = document.getElementById(genome).value;
    var ref;

    ref = await getData('https://plwebtool.github.io/tools/db/' + fileName);
  }
  catch(err){
    alert('Species not implemented yet.');
  }
  
  var output = findTRFs(input, ref, max)

  if (document.getElementById('successAlert').hasAttribute('hidden')){
    document.getElementById('successAlert').removeAttribute('hidden');
  }

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

function nthElements(arr, start, step){
  var newArr = [];

  for (var i = start; i < arr.length; i += step){
    newArr.push(arr[i]);
  }

  return newArr;
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

function searchRef(seq, ref){
  /* Search for the seq in the reference text
     Return the name of the tRF it corresponds to if found */

  var refArray = ref.split('\n');
  var refDescs = nthElements(refArray, 0, 2);
  var refSeqs = nthElements(refArray, 1, 2);

  for (var i = 0; i < refSeqs.length; i++){
    if (refSeqs[i].includes(seq)){
      return trfName(refDescs[i]);
    }
  }

  return false; // return false if nothing is found
}

function isTRF(seq, ref){
  var subseqs = generateSubsequences(seq)

  for (var i = 0; i < subseqs.length; i++){
    var result = searchRef(subseqs[i], ref);

    if (typeof(result) == "string"){
      return result + ', sequence matched: ' + subseqs[i];
    }
  }

  return false;
}

function findTRFs(fasta, ref, limit){
  var fastaArray = fasta.split('\n');

  var descs = nthElements(fastaArray, 0, 2);
  var seqs = nthElements(fastaArray, 1, 2);

  var newFastaArray = [];

  for (var i = 0; i < seqs.length; i++){

    if ((newFastaArray.length / 2) == limit){
      return newFastaArray.join('\n');
    }

    var result = isTRF(seqs[i], ref);


    if (typeof(result) == "string"){
      newFastaArray.push(descs[i] + ' (' + result + ' )');
      newFastaArray.push(seqs[i]);
    }
  }

  return newFastaArray.join('\n');
}
