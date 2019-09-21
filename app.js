const fs = require("fs");
const path = require("path")
const { dialog } = require("electron").remote;

var folderAddress = document.querySelector('.folder-address');
var btnBrowseFolder = document.querySelector(".btn_browse_folder");
var showFolders = document.getElementById('display-folder')
console.log(showFolders);
let options = {
    // See place holder 1 in above image
    title: "Choose folder has file you want to delete",

    // See place holder 2 in above image
    defaultPath: "C://",

    // See place holder 3 in above image
    buttonLabel: "Choose",

    // See place holder 4 in above image

    properties: ['openDirectory']
}

//open directory


btnBrowseFolder.addEventListener('click', () => {
    dialog.showOpenDialog(options).then(result => {

        this.getFileFromPath(result.filePaths[0]);


    })

});
let files = [];
getFileFromPath = filePath => {
    if (filePath !== undefined) {
        folderAddress.setAttribute('value', filePath);
        fs.readdir(filePath, (err, file) => {
            files = file.length > 1 ? [...file] : []

        })

    }
}