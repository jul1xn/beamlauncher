const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  getMessage: () => ipcRenderer.invoke('get-message')
})
