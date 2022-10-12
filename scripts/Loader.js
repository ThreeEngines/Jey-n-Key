
function enableLoader () {
    document.querySelector("body").style.visibility = "hidden";
    document.querySelector("#loader").style.visibility = "visible";
}

function disableLoader() {
    document.querySelector("#loader").style.display = "none";
    document.querySelector("body").style.visibility = "visible";
}

function isLoading() {
    return document.readyState
}