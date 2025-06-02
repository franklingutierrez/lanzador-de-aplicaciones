const { app, BrowserWindow, shell, dialog, ipcMain } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
     icon: path.join(__dirname, 'mochila.ico'), // <-- aquí tu icono .ico para Windows
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC para abrir el diálogo de archivos
ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Ejecutables', extensions: ['exe', 'lnk'] }
    ]
  });
  if (canceled || filePaths.length === 0) return null;
  return filePaths[0];
});

ipcMain.handle('app:launch', async (event, appPath) => {
  if (appPath) {
    return await shell.openPath(appPath);
  }
  return 'Ruta no válida';
});