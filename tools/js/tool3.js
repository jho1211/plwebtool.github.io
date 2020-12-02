document.getElementById('refInput').addEventListener('change', function(e){
  refFileUpload(e);
})

document.getElementById('sampleInput').addEventListener('change', function(e){
  sampleFileUpload(e);
})

function refFileRead(file){
  const reader = new FileReader();
  reader.onload = refFileLoad;

  reader.readAsText(file);
}

function sampleFileRead(file){
  const reader = new FileReader();
  reader.onload = sampleFileLoad;

  reader.readAsText(file);
}

function sampleFileLoad(event){
  event.target.result.replace(/\r/g, "\n");

  document.getElementById('sampleInputText').textContent = event.target.result;
  console.log(event.target.result);
}

function refFileLoad(event){
  event.target.result.replace(/\r/g, "\n");

  document.getElementById('refInputText').textContent = event.target.result;
  console.log(event.target.result);
}

function refFileUpload(e){
  if (e.target.files.length != 0){
    let file = e.target.files[0]

    var nextSibling = e.target.nextElementSibling
    nextSibling.innerText = file.name;

    refFileRead(e.target.files[0])
    alert(file.name + " has been successfully loaded.");
  }
  else{
    var nextSibling = e.target.nextElementSibling
    nextSibling.innerText = "Choose file";
  }
}

function sampleFileUpload(e){
  if (e.target.files.length != 0){
    let file = e.target.files[0]

    var nextSibling = e.target.nextElementSibling
    nextSibling.innerText = file.name;

    sampleFileRead(e.target.files[0])
    alert(file.name + " has been successfully loaded.");
  }
  else{
    var nextSibling = e.target.nextElementSibling
    nextSibling.innerText = "Choose file";
  }
}

function nthElements(arr, start, step){
  var newArr = [];

  for (var i = start; i < arr.length; i += step){
    newArr.push(arr[i]);
  }

  return newArr;
}

/* Plan for Code:

1. Load the textContent for the refInputText and sampleInputText
2. Sort the refInput so that we can use binary search to speed up the process
  - To simplify things, we can first filter by the ref sequences with > #threshold hits because we do not care about matching sequences with < #threshold
    - Append these sequences to a new array
  - Then, we can ignore the sequence descriptors and only sort by these sequences
    - Using the builtin sort() method

3. Iterate through each sample sequence and binary search for that sequence in the reference sequence
4. If the sequence matches a sequence found in the reference sequence, then we do not append it to the list
  - If it does not appear in the reference, then we do append it to the list
*/

function runTool(sample, ref, th, lim){
  // Show that the tool is loading.
  showAlert('loadAlert');

  // Load textContent from refInputText + sampleInputText
  var refText = document.getElementById(ref).textContent;
  var sampleText = document.getElementById(sample).textContent;
  var threshold = parseInt(document.getElementById(th).value);
  var limit = parseInt(document.getElementById(lim).value);

  // Check if there are any parameters missing
  // Check if one or more inputs are missing:
  if ((refText == "") || (sampleText == "")){
    hideAlert('loadAlert');
    showAlert('errorAlert');
    return null;
  }

  // Check if read threshold value is valid:
  if (Number.isNaN(threshold)){
    hideAlert('loadAlert');
    alert("Please enter a valid threshold number!");
    clearInput('threshold');
    return null;
  }

  // Check if limit value is valid:
  if (Number.isNaN(limit)){
    limit = Infinity;
  }

  var sampleArray = sampleText.split('\n');
  var refArray = refText.split('\n');

  var sampleDescs = nthElements(sampleArray, 0, 2);
  var sampleSeqs = nthElements(sampleArray, 1, 2);

  var refDescs = nthElements(refArray, 0, 2);
  var refSeqs = nthElements(refArray, 1, 2);

  // Filter for ref sequences with > #threshold
  var relevantRefSeqs = filterThreshold(refSeqs, refDescs, threshold)

  // Sort the relevantRefSeqs for binary search
  relevantRefSeqs.sort();

  // Iterate through the samples and search for them in the reference
  // Return the ones that do not appear in the reference
  var output = findClean(sampleSeqs, sampleDescs, relevantRefSeqs, limit);

  document.getElementById('fastaOutput').value = output;

  hideAllAlerts();
  showAlert("successAlert");

  return null;
}

function findClean(seqs, descs, ref, limit){
  var res = [];

  // Iterate through each sample sequence and binary search for the sequence in the reference
  for (var i = 0; i < seqs.length; i++){
    // If there are #limit of sequences already found, then we are finished
    if (res.length >= (limit * 2)){
      return res.join('\n');
    }

    // If it does not appear in the reference, then we append it to the list
    if (!binarySearch(seqs[i], ref)){
      res.push(descs[i]);
      res.push(seqs[i]);
    }
  }

  return res.join('\n');
}

function hitNumber(desc){
  // Determines the hit number from a descriptor
  // Find the index for '_x' to determine where the number starts
  var index = desc.indexOf("_x"); // returs the index where '_' is
  var actualIndex = index + 2; // need to add 2 to index to find the number

  return parseInt(desc.substring(actualIndex, desc.length));
}

function filterThreshold(seqs, descs, threshold){
  // Filter for ref sequences that contain > #threshold by checking their hit number
  var res = []

  for (var i = 0; i < seqs.length; i++){
    if (hitNumber(descs[i]) >= threshold){
      res.push(seqs[i])
    }
  }

  return res;
}

function binarySearch(seq, ref){
  var first = 0;
  var last = ref.length - 1;
  let i = -1;
  var found = false;

  while ((i == -1) && (first <= last)){
    var mid = Math.floor((first + last) / 2);

    if (ref[mid].includes(seq)){
      i = mid;
      found = true;
    }

    else if (seq < ref[mid]){
      last = mid - 1;
    }

    else{
      first = mid + 1;
    }
  }

  return found;
}
