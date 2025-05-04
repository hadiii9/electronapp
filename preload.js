const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getAllCustomers: (rootPath) => ipcRenderer.invoke('get-all-customers', rootPath),
  getCustomersByYear: (rootPath, year) => ipcRenderer.invoke('get-customers-by-year', rootPath, year),
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
});
