const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
  launchApp: (appPath) => ipcRenderer.invoke('app:launch', appPath)
});
