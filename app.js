const fs = require("fs");
const path = require("path")
const { dialog } = require("electron").remote;

var folderAddress = document.querySelector('.folder-address');
var btnBrowseFolder = document.querySelector(".btn_browse_folder");
var body = document.querySelector('body')


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

    if (folder.length <= 4) {
        dialog.showOpenDialog(options).then(result => {
            if (result.filePaths[0] != undefined) {
                folderAddress.setAttribute('value', result.filePaths[0])
                folder.push({ folderPath: result.filePaths[0], folderName: path.basename(result.filePaths[0]), files: this.getFileFromPath(result.filePaths[0]) })
                this.displayFolderName(folder)
            }

        }).catch(err => dialog.showErrorBox('ERROR', err))
    } else {
        dialog.showErrorBox("ERROR", "Maximum 5 folder")
    }

});


displayFolderName = folder => {


    if (folder) {

        let div = document.createElement('div');
        div.setAttribute('class', 'show-folders')

        folder.forEach(value => {
            let tag = document.createElement('span');
            let text = document.createTextNode(value.folderName);
            tag.setAttribute('class', value.folderName)
            tag.setAttribute('title', 'click to remove')
            tag.setAttribute('onclick', 'removeFolder(event)')
            tag.appendChild(text)
            div.appendChild(tag)
        })
        body.appendChild(div)
    }
}

removeFolder = event => {
    console.log(event.target.className);
}

getFileFromPath = filePath => {
    let files = [];


    fs.readdir(filePath, (err, file) => {
        files.push(file)

    })
    return files
}