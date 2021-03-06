const fs = require("fs");
const path = require("path")
const { dialog } = require("electron").remote;
const moment = require('moment')

var folderAddress = document.querySelector('.folder-address');
var btnBrowseFolder = document.querySelector(".btn_browse_folder");
var setTime = document.getElementById('set-time');
var selectTime = document.getElementById('select-time')

var btnStart = document.querySelector('.btn-start')
var body = document.querySelector('body')
var folder = []


let pathSlash = ''
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


if (navigator.appVersion.indexOf('Win') != -1) {
    pathSlash = '\\'
}
if (navigator.appVersion.indexOf('Linux') != -1) {
    pathSlash = '/'
}

btnBrowseFolder.addEventListener('click', () => {

    if (folder.length <= 4) {
        dialog.showOpenDialog(options).then(result => {
            if (result.filePaths[0] != undefined) {
                if (folder.length > 0) {

                    if (folder.some((val, i, arr) => {
                            return val.folderPath == result.filePaths[0]
                        })) {
                        dialog.showErrorBox('ERROR', 'FOLDER HAS BEEN CHOOSEN')
                    } else {
                        folderAddress.setAttribute('value', result.filePaths[0])
                        this.setFolder(result.filePaths[0])
                        this.displayFolderName(folder)
                    }
                } else {
                    folderAddress.setAttribute('value', result.filePaths[0])
                    this.setFolder(result.filePaths[0])
                    this.displayFolderName(folder)
                }


            }

        }).catch(err => console.log(err))
    } else {
        dialog.showErrorBox("ERROR", "Maximum 5 folder")
    }

});

setFolder = filePath => {
    folder.push({ folderPath: filePath, folderName: path.basename(filePath) })
    getFileFromPath(filePath)
}

displayFolderName = folder => {


    if (folder) {

        let div = document.createElement('div');
        div.setAttribute('class', 'show-folders')

        folder.forEach(value => {
            let tag = document.createElement('span');
            let text = document.createTextNode(value.folderName.length < 16 ? value.folderName : value.folderName.slice(0, 16) + '...');
            tag.setAttribute('class', value.folderName)
            tag.setAttribute('title', 'click to remove')
            tag.setAttribute('onclick', 'removeFolder(event)')
            tag.appendChild(text)
            div.appendChild(tag)
        })

        body.appendChild(div)
    }
}

let allFile = []

removeFolder = event => {

    folder = folder.filter((val, index, arr) => {

        return val.folderName != event.target.className;
    })
    this.displayFolderName(folder)
    allFile = []
    if (folder.length > 0) {
        folder.forEach(val => {
            getFileFromPath(val.folderPath)
        })
    }

}

getFileFromPath = folderPath => {

    fs.readdir(folderPath, (err, files) => {
        let a;

        files.forEach(file => {
            fs.stat(`${folderPath}${pathSlash}${file}`, (err, stats) => {
                allFile.push(`${folderPath}${pathSlash}${file}`);
                // if (moment(stats.birthtimeMs).fromNow().includes('days')) {
                //     allFile.push(`${folderPath}${pathSlash}${file}`);
                // }
            })
        })
    });

}


let time = (time, timeType) => {
    switch (timeType) {
        case 'minute':
            return time * 60;
            break;
        case 'hour':
            return time * 3600;
            break;
        case 'day':
            return 24 * 3600;
            break;
        case 'month':
            return 30 * 24 * 3600
            break;
    }
}
deleteFile = allFile => {
    if (allFile.length > 0) {
        allFile.forEach(file => {
            fs.exists(file, exists => {
                if (exists) {
                    fs.unlink(file, err => {
                        if (err) {
                            console.log(err);
                        }
                    })
                }
            })
        })

    }

}

let deleteFileWithTime
btnStart.addEventListener('click', () => {

    if (folder.length > 0) {

        if (setTime.value > 0) {

            if (btnStart.value == 'start') {
                btnStart.innerHTML = 'stop'
                btnStart.setAttribute('value', 'stop')
                this.disabledElement()

                deleteFileWithTime = setInterval(() => {
                    folder.forEach(val => {

                        getFileFromPath(val.folderPath)
                    })

                    deleteFile(allFile);
                    allFile = [];


                }, (time(setTime.value, selectTime.value) * 1000))
            } else {
                clearInterval(deleteFileWithTime);
                btnStart.innerHTML = 'start'
                btnStart.setAttribute('value', 'start')
                this.activeElement();
            }

        } else {
            dialog.showErrorBox('ERROR', 'TIME ERROR')
        }



    } else {
        dialog.showErrorBox('ERROR', 'NO FOLDERS WAS CHOOSEN')
    }
})


disabledElement = () => {
    document.getElementById('folder-address').disabled = 'true'
    document.getElementById('btn_browse_folder').disabled = 'true'
    document.getElementById('set-time').disabled = 'true'
    document.getElementById('select-time').disabled = 'true'
}

activeElement = () => {
    document.getElementById('folder-address').removeAttribute('disabled')
    document.getElementById('btn_browse_folder').removeAttribute('disabled')
    document.getElementById('set-time').removeAttribute('disabled')
    document.getElementById('select-time').removeAttribute('disabled')
}