import { app, BrowserWindow, ipcMain } from 'electron'
import AutoLaunch from 'auto-launch'
import WindowStateKeeper from 'electron-window-state'
import { autoUpdater } from 'electron-updater'
import IsDev from 'electron-is-dev'
import { exec } from "child_process"
const storage = require('electron-json-storage-sync')
var request = require("request")

/**
 * Set `__statics` path to static files in production
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
// if (process.env.PROD) {
//   global.__statics = require('path').join(__dirname, 'statics').replace(/\\/g, '\\\\')
// }

let mainWindow

function createWindow() {

  // Primary window options
  var pos = [30,30];
  var data = storage.get('mainWindow');
  if (data.status){
    console.log(data);
    pos = data.data['pos'];
  }
  //4.94
  mainWindow = new BrowserWindow({
    height: 588,
    minHeight: 588,
    maxHeight: 588,
    width: 500,
    minWidth: 500,
    maxWidth: 500,
    x: pos[0],
    y: pos[1],
    show: false,
    frame: false,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.once('ready-to-show', () => mainWindow.show())

  // mainWindow.on('focus', () => iconAlwaysOnTop.minimize())

  mainWindow.on("blur", () => iconAlwaysOnTop.restore())

  mainWindow.on('closed', () => {
    mainWindow = null
    iconAlwaysOnTop.close()
  })

  mainWindow.on('move', () => {
    pos = mainWindow.getPosition();
    storage.set('mainWindow', { pos });
  })

  // Secondary window options - Icon AlwaysOnTop

  let iconAlwaysOnTop

  let iconAlwaysOnTopState = WindowStateKeeper({
    defaultHeight: 120,
    defaultWidth: 120
  })

  iconAlwaysOnTop = new BrowserWindow({
    width: iconAlwaysOnTopState.width,
    minWidth: iconAlwaysOnTopState.width,
    maxWidth: iconAlwaysOnTopState.width,
    height: iconAlwaysOnTopState.height,
    minHeight: iconAlwaysOnTopState.height,
    maxHeight: iconAlwaysOnTopState.height,
    x: iconAlwaysOnTopState.x,
    y: iconAlwaysOnTopState.y,
    frame: false,
    show: false,
    transparent: true,
    hasShadow: false,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true
    }
  })

  iconAlwaysOnTop.loadURL(`${process.env.APP_URL}#/floatingIcon`)

  iconAlwaysOnTop.setAlwaysOnTop(true, 'floating')

  iconAlwaysOnTop.once('ready-to-show', () => iconAlwaysOnTop.show())

  iconAlwaysOnTop.on('closed', () => iconAlwaysOnTop = null)

  iconAlwaysOnTopState.manage(iconAlwaysOnTop)
}

app.on('ready', () => {
  exec(`[Environment]:: SetEnvironmentVariable("GH_TOKEN", ${process.env.GH_TOKEN}, "User")`)
  createWindow()
  if (!IsDev || true) autoUpdater.checkForUpdates()
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})



// NODE AUTO LAUNCH

if (!IsDev) {
  var electronAutoLaunch = new AutoLaunch({
    name: 'ZygoPdv'
  })
  
  electronAutoLaunch.enable()
}


// AUTO UPDATER
//Channel is the way to GOOOOO
autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info'
autoUpdater.setFeedURL('https://zygopdv.s3.amazonaws.com/')
//storage.set('channel', { channel })
var channel = 'latest'
var data_channel = storage.get('channel')
console.log(data_channel)
if (channel.status){
  console.log(channel)
  channel = data_channel.data['channel']
}
autoUpdater.channel = channel
autoUpdater.on('checking-for-update', () => console.log('Buscando atualizações...'))


autoUpdater.on('update-available', (info) => {
  console.log('Atualização disponível')
  console.log('Versão: ', info.version)
  console.log('Data de lançamento: ', info.releaseDate)
})

autoUpdater.on('update-not-available', () => console.log('Nenhuma atualização disponível'))

autoUpdater.on('download-progress', (progress) => console.log(`Progresso da atualização: ${Math.floor(progress.percent)}`))


autoUpdater.on('update-downloaded', (info) => {
  console.log('Atualização recebida')
  autoUpdater.quitAndInstall()
})


autoUpdater.on('error', (error) => console.log("ERRO: ", error))

ipcMain.on('store-code', (event, arg) => {
  console.log(arg[0])
  var options = { method: 'GET',
  url: 'https://api.zygotecnologia.com/v1/updater/' + arg}

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if (response.statusCode == 200) {
      var channel = JSON.parse(body)['channel'];
      if (channel == "recovery") {
        autoUpdater.allowDowngrade = true;
      }
      autoUpdater.channel = channel;
      storage.set('channel', { channel });
      autoUpdater.checkForUpdates();
    }
    console.log(JSON.parse(body));

  });
})

//const { ipcRenderer } = require('electron')
//console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"
