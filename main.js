const { app, BrowserWindow } = require('electron')
const path = require('path')





let mainWindow

function createWindow() {

    mainWindow = new BrowserWindow({
        minWidth: 400,
        minHeight: 400,
        maxWidth: 800,
        maxHeight: 600,
        width: 800,
        height: 600,


        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }

    })

    mainWindow.loadFile('index.html')


    mainWindow.on('closed', function() {
        mainWindow = null
    })
}


app.on('ready', createWindow)


app.on('window-all-closed', function() {

    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {

    if (mainWindow === null) createWindow()
})