export {};

declare global {
  interface Window {
    electronAPI: {
      selectFolder: () => Promise<{ rootPath: string; yearFolders: string[] } | null>;
      getAllCustomers: (rootPath: string) => Promise<
        { year: string; customer: string; path: string }[]
      >;
      getCustomersByYear: (rootPath: string, year: string) => Promise<string[]>;
      openFolder: (folderPath: string) => Promise<void>;
    };
  }
}
