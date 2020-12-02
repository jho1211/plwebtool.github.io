function copyOutput(id){
  document.getElementById(id).select();
  document.execCommand("copy");
}

function clearInput(id){
  document.getElementById(id).value = "";
}

function hasHidden(id){
  return document.getElementById(id).hasAttribute("hidden");
}

function hideAllAlerts(){
  hideAlert('successAlert');
  hideAlert('loadAlert');
  hideAlert('errorAlert');
}

function hideAlert(id){
  document.getElementById(id).setAttribute('hidden', 'true')
}

function showAlert(id){
  if (hasHidden(id)){
    document.getElementById(id).removeAttribute("hidden");
  }
}

function fileRead(file){
  const reader = new FileReader();
  reader.onload = fileLoad;

  reader.readAsText(file);
}

function fileLoad(event){
  document.getElementById('fastaFileText').textContent = event.target.result;
}

// Changes the label of the file input to match the name of the document
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
