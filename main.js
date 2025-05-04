const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const { shell } = require('electron');
const url = require('url');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Electron',
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),  // important!
    },
  });

  // mainWindow.webContents.openDevTools();

  const startUrl = url.format({
    pathname: path.join(__dirname, './app/build/index.html'),
    protocol: 'file',

  });

  mainWindow.loadURL(startUrl);
}

// Listen for folder selection
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  if (result.canceled) return null;

  const rootPath = result.filePaths[0];
  const yearFolders = fs
    .readdirSync(rootPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  return { rootPath, yearFolders };
});

ipcMain.handle('get-all-customers', async (event, rootPath) => {
    const fs = require('fs');
    const path = require('path');
  
    const years = fs
      .readdirSync(rootPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  
    const customerList = [];
  
    years.forEach((year) => {
      const yearPath = path.join(rootPath, year);
      const customers = fs
        .readdirSync(yearPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
  
      customers.forEach((customer) => {
        customerList.push({
          year,
          customer,
          path: path.join(yearPath, customer),
        });
      });
    });
  
    return customerList;
});

ipcMain.handle('get-customers-by-year', async (event, rootPath, year) => {
    const yearPath = path.join(rootPath, year);
    const customers = fs
      .readdirSync(yearPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  
    return customers;
  });  
  
ipcMain.handle('open-folder', async (event, folderPath) => {
  await shell.openPath(folderPath);
});

app.whenReady().then(createMainWindow);