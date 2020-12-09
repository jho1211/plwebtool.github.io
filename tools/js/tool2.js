var reference;

function fileRead(file){
  const reader = new FileReader();
  reader.onload = fileLoad;

  reader.readAsText(file);
}

// Read the text contained in the text file.
async function fileRead(file){
  var text = await file.text();
  document.getElementById('fastaFileText').textContent = text;
}

document.querySelector('.custom-file-input').addEventListener('change', function(e){
  if (e.target.files.length != 0){
    let file = e.target.files[0]

    var nextSibling = e.target.nextElementSibling
    nextSibling.innerText = file.name;

    fileRead(e.target.files[0])
    alert(file.name + " has been successfully loaded.");
  }
  else{
    var nextSibling = e.target.nextElementSibling
    nextSibling.innerText = "Choose file";
  }
})

async function runTool(fasta, fileInput, limit, outputid){
  var input = document.getElementById(fasta).value;
  var files = document.getElementById(fileInput).files;
  var max = parseInt(document.getElementById(limit).value);

  showAlert("loadAlert");

  if (max == -1 || max == 0 || isNaN(max)){
    max = Infinity;
  }

  if (input == ""){
    if (files.length == 0){

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

  reference = await getData('https://plwebtool.github.io/tools/db/ribo58s.fa');

  var output = generateDRNA(input, max)
  hideAlert("loadAlert");

  showAlert("successAlert");

  document.getElementById(outputid).value = output;

  enableButton("download");
}

function isDRNA(seq, ref){
  /* Returns false if sequence is not a dRNA/CdRNA.
  Returns the matching sequence if it is a match */

  return ((seq.length == 12) || (seq.length == 13 && seq[0] == "C"))
}

function generateDRNA(input, max){

  var inputArray = input.split('\n');
  var descs = nthElements(inputArray, 0, 2);
  var seqs = nthElements(inputArray, 1, 2);

  var dArray = []

  for (var i = 0; i < seqs.length; i++){
    if ((dArray.length / 2) == max){
      return dArray.join('\n');
    }

    if (isDRNA(seqs[i], reference)){
      dArray.push(descs[i]);
      dArray.push(seqs[i]);
    }
  }

  return dArray.join('\n');
}
