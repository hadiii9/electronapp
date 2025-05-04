import { useState } from 'react';

interface Customer {
  year: string;
  customer: string;
  path: string;
}

function App() {
  const [yearFolders, setYearFolders] = useState<string[]>([]);
  const [rootPath, setRootPath] = useState<string>('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [yearCustomers, setYearCustomers] = useState<string[]>([]);
  const [yearSearch, setYearSearch] = useState<string>('');

  const handleSelectFolder = async () => {
    const result = await window.electronAPI.selectFolder();
    if (result) {
      setRootPath(result.rootPath);
      setYearFolders(result.yearFolders);

      const customerList = await window.electronAPI.getAllCustomers(result.rootPath);
      setCustomers(customerList);
      setSelectedYear('');
      setYearCustomers([]);
      setYearSearch('');
    }
  };

  const handleYearClick = async (year: string) => {
    setSelectedYear(year);
    const customersByYear = await window.electronAPI.getCustomersByYear(rootPath, year);
    setYearCustomers(customersByYear);
    setYearSearch('');
  };

  const handleOpenCustomerFolder = (folderPath: string) => {
    window.electronAPI.openFolder(folderPath);
  };

  const filteredCustomers = customers.filter((c) =>
    c.customer.toLowerCase().includes(search.toLowerCase())
  );

  const filteredYearCustomers = yearCustomers.filter((c) =>
    c.toLowerCase().includes(yearSearch.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '10px' }}>📁 Folder Search App</h1>
      <button
        onClick={handleSelectFolder}
        style={{ padding: '10px 15px', marginBottom: '20px', cursor: 'pointer' }}
      >
        Select Root Folder
      </button>

      {rootPath && (
        <>
          <h2 style={{ fontSize: '16px', marginBottom: '5px' }}>Root: {rootPath}</h2>

          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            {/* Left Column */}
            <div style={{ flex: 1 }}>
              <h3>📅 Years</h3>
              <div
                style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  border: '1px solid #ddd',
                  padding: '10px',
                  borderRadius: '5px',
                }}
              >
                {yearFolders.map((year) => (
                  <div
                    key={year}
                    onClick={() => handleYearClick(year)}
                    style={{
                      padding: '8px',
                      marginBottom: '5px',
                      cursor: 'pointer',
                      backgroundColor: year === selectedYear ? '#d0ebff' : '#f8f9fa',
                      borderRadius: '4px',
                      transition: 'background 0.2s',
                    }}
                  >
                    {year}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div style={{ flex: 2 }}>
              <h3>🔍 Global Customer Search</h3>
              <input
                type="text"
                placeholder="Search customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              />
              <div
                style={{
                  maxHeight: '150px',
                  overflowY: 'auto',
                  border: '1px solid #ddd',
                  padding: '10px',
                  borderRadius: '5px',
                  marginBottom: '20px',
                }}
              >
                {filteredCustomers.map((c, index) => (
                  <div
                    key={index}
                    onClick={() => handleOpenCustomerFolder(c.path)}
                    style={{
                      padding: '8px',
                      marginBottom: '5px',
                      cursor: 'pointer',
                      backgroundColor: '#f1f3f5',
                      borderRadius: '4px',
                      transition: 'background 0.2s',
                    }}
                  >
                    {c.customer} (Year: {c.year})
                  </div>
                ))}
              </div>

              {selectedYear && (
                <>
                  <h3>👥 Customers in {selectedYear}</h3>
                  <input
                    type="text"
                    placeholder="Search in this year..."
                    value={yearSearch}
                    onChange={(e) => setYearSearch(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                  />
                  <div
                    style={{
                      maxHeight: '300px',
                      overflowY: 'auto',
                      border: '1px solid #ddd',
                      padding: '10px',
                      borderRadius: '5px',
                    }}
                  >
                    {filteredYearCustomers.map((c, index) => (
                      <div
                        key={index}
                        onClick={() =>
                          handleOpenCustomerFolder(`${rootPath}\\${selectedYear}\\${c}`)
                        }
                        style={{
                          padding: '8px',
                          marginBottom: '5px',
                          cursor: 'pointer',
                          backgroundColor: '#e9ecef',
                          borderRadius: '4px',
                          transition: 'background 0.2s',
                        }}
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
