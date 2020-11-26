function copyOutput(id){
  document.getElementById(id).select();
  document.execCommand("copy");
}

function clearInput(id){
  document.getElementById(id).value = "";
}
