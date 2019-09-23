const fs = require("fs");
const path = require("path")
const { dialog } = require("electron").remote;

var folderAddress = document.querySelector('.folder-address');
var btnBrowseFolder = document.querySelector(".btn_browse_folder");
var body = document.querySelector('body')
let node = document.createElement('span')
let text = document.createTextNode('Test')
node.appendChild(text)


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

let folder = []

btnBrowseFolder.addEventListener('click', () => {
    dialog.showOpenDialog(options).then(result => {

        folderAddress.setAttribute('value', result.filePaths[0])
        folder.push({ folderPath: result.filePaths[0], folderName: result.filePaths[0].match(/(\w+)/g)[result.filePaths[0].match(/(\w+)/g).length - 1], files: this.getFileFromPath(result.filePaths[0]) })
        console.log(folder);
    })

});



getFileFromPath = filePath => {
    let files = [];


    fs.readdir(filePath, (err, file) => {
        files.push(file)

    })
    return files
}