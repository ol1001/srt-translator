window.onload = getFile;

function getFile() {

    // select elements
    var inputElement = document.getElementById("file"),
        dropArea = document.getElementById("dropArea");


    // add event listeners
    inputElement.addEventListener("change", handleFileSelect, false);
    dropArea.addEventListener("dragover", handleFileDrag, false);
    dropArea.addEventListener("drop", handleFileSelect, false);

    // drag file
    function handleFileDrag(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }

    // handle input or drop files
    function handleFileSelect(e) {
        e.stopPropagation();
        e.preventDefault();

        var file = null;

        if (e.type === "change") {
            file = e.target.files[0];

            // change label text
            changeContent(file.name);

        } else if (e.type === "drop") {
            file = e.dataTransfer.files[0];

            // change drop area text
            changeContent(file.name);
        }

        //Validate input file
        if (fileValidator(file)){
            readContent(file);
        }
    }
}

/* Accessory Functions*/

function changeContent(name) {
    var uploadFileArea = document.getElementById("uploadFile"),
        dictionary = document.getElementById("dictionary"),
        h2 = document.createElement('h2'),
        outputContainer = document.getElementById('totalNumber');

        dictionary.insertBefore(h2, outputContainer);
        h2.id = 'fileInfo';
        h2.textContent = name;
        uploadFileArea.className = 'elementToHide';
}

function fileValidator(file){
    if (file.name.match(/.+\.(srt)$/i) && file.size <= 200000){
        return true;
    } else {
        alert("Please upload file with .srt extension");
        return false;
    }
}
function readContent(file) {
        var fileReader = new FileReader();

        fileReader.onload = function (event) {
            var srtFile = fileReader.result;
            parseSrt(srtFile);
        };
        fileReader.onerror = function (event) {
            console.error("File could not be read! Code " + event.target.error.code);
        };
        fileReader.readAsText(file);
}
function parseSrt(srtFile) {
    var textFile = srtFile.replace(/(\d.*)|\[|]|<i>|<\/i>|\n+|\W/g, " ");
    textFile = textFile.replace(/\s+/g, " ");

    var wordsArray = textFile.split(" ");

    var refNumber = refCount(wordsArray);

    var count = 0;
    for (var property in refNumber) {
        if (refNumber.hasOwnProperty(property)) count++;
    }
    var keys = Object.keys(refNumber);
    var numberOfWords = 0;

    for (var i = 0; i < count; i++) {
        if (refNumber[keys[i]] >= 2) {
            if (keys[i].toLowerCase().length > 3) {
                // console.log(keys[i].toLowerCase() + " : " + refNumber[keys[i]]);
                translateWord(keys[i].toLowerCase());
            }
            numberOfWords++;
        }
    }
   showTotalNumber(numberOfWords);
}
function refCount(array) {

    var i, l = array.length, refs = {};

    for (i = 0; i < l; i++) {
        if (refs[array[i]] === undefined) {
            refs[array[i]] = 1;
        } else {
            refs[array[i]] += 1;
        }
    }
    return refs;
}

function translateWord(word) {
    var xhttp = new XMLHttpRequest();
    var li = document.createElement('li');
    var ul = document.getElementById('translatedList');

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            if(xhttp.response != "[]") {
                var parsed = JSON.parse(xhttp.response);
                li.textContent = parsed[0].targetWord + " : " + parsed[0].translation.short;
                ul.appendChild(li);
            }
        }
    };

    xhttp.open("GET", "/translate/" + word, true);
    xhttp.send();
}

function showTotalNumber(numberOfWords) {
    var outputContainer = document.getElementById('totalNumber');
    outputContainer.className = null;
    outputContainer.textContent += numberOfWords;
}