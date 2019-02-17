// Modules to control application life and create native browser window
const {
  app,
  Menu,
  Tray,
  BrowserWindow,
  Notification
} = require('electron');

const express = require('express')();
  wifi = require('node-wifi');
  

wifi.init({
  iface: null // network interface, choose a random wifi interface if set to null
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let appIcon = null;

function createWindow() {
  express.listen(6969, () => {
    console.log("Express is listening");
  });

  //Change app name
  app.setName("Dr.F0to");

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false
  });
  if (process.platform == "darwin")
    app.dock.hide();

  mainWindow.loadFile('./ml5/index.html');

  mainWindow.hide();

  appIcon = new Tray("./assets/elsys_logo.png");
  const contextMenu = Menu.buildFromTemplate([{
      label: 'Open Dr.F0to',
      type: 'normal',
      click() {
        openMainWindow();
      }
    },
    {
      label: 'Quit',
      type: 'normal',
      click() {
        quitApp();
      }
    }
  ]);

  appIcon.on('click', function () {
    appIcon.popUpContextMenu(contextMenu);
  });

  mainWindow.on('close', function (e) {
    e.preventDefault();
    mainWindow.hide();
    if (process.platform == "darwin")
      app.dock.hide();
  });
//   document.getElementById("exitButton").addEventListener("click", function (e) {
//     // var window = remote.getCurrentWindow();
//     // window.close();
//     console.log("EXIT")
// }); 
  // console.log(mainWindow.getCurrentWindow());

}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    // app.quit();
  }
});


const openMainWindow = function () {
  mainWindow.show();
  if (process.platform == "darwin")
    app.dock.show();
};

const quitApp = function () {
  mainWindow = null;
  app.exit();
  app.quit();
};


express.get("/networkConnections", (req, res) => {
  // List the current wifi connections
  wifi.getCurrentConnections(function (err, currentConnections) {
    if (err) {
      console.log(err);
    }
    res.send(currentConnections);
  });
});


// app.on('activate', function () {
//   // On macOS it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) {
//     createWindow();
//   }
// });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.