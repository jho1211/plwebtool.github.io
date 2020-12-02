function copyOutput(id){
  document.getElementById(id).select();
  document.execCommand("copy");
}

function downloadOutput(buttonID, id, filename){
  var text = document.getElementById(id).value;

  var blob = new Blob([text], {type: "text/plain"});
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  window.URL.revokeObjectURL(url);
  a.remove();

  return undefined;
}

function disableButton(id){
  document.getElementById(id).setAttribute("disabled", true);
}

function enableButton(id){
  document.getElementById(id).removeAttribute("disabled");
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

function nthElements(arr, start, step){
  var newArr = [];

  for (var i = start; i < arr.length; i += step){
    newArr.push(arr[i]);
  }

  return newArr;
}

async function getData(url){

  const response = await fetch(url);

  return response.text();
}
