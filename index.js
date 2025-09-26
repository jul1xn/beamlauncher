const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'BeamLauncher',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js') // secure IPC bridge
    }
  })

  win.loadFile('index.html')

  win.setMenuBarVisibility(false)
  win.setMenu(null)
}

// Example "API endpoint" via IPC
ipcMain.handle('get-message', async () => {
  return { message: 'Hello from the main process!' }
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
