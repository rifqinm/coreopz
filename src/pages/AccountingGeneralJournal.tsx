import React, { useState } from 'react';
import { Plus, BookOpen, Edit, Trash2, Search, Filter, Calendar } from 'lucide-react';

interface JournalEntry {
  id: number;
  date: string;
  description: string;
  reference: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
}

const AccountingGeneralJournal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: 1,
      date: '2024-01-15',
      description: 'Penjualan Produk Elektronik',
      reference: 'INV-001',
      debitAccount: 'Kas',
      creditAccount: 'Penjualan',
      amount: 15000000
    },
    {
      id: 2,
      date: '2024-01-15',
      description: 'Pembelian Inventory',
      reference: 'PO-001',
      debitAccount: 'Inventory',
      creditAccount: 'Kas',
      amount: 8500000
    },
    {
      id: 3,
      date: '2024-01-14',
      description: 'Pembayaran Gaji Karyawan',
      reference: 'PAY-001',
      debitAccount: 'Beban Gaji',
      creditAccount: 'Kas',
      amount: 12000000
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);

  const [newEntry, setNewEntry] = useState({
    date: '',
    description: '',
    reference: '',
    debitAccount: '',
    creditAccount: '',
    amount: 0
  });

  const accounts = [
    'Kas', 'Bank', 'Piutang Dagang', 'Inventory', 'Peralatan', 'Akumulasi Penyusutan',
    'Hutang Dagang', 'Hutang Gaji', 'Modal', 'Penjualan', 'Beban Gaji', 'Beban Sewa',
    'Beban Listrik', 'Beban Telepon', 'Beban Penyusutan'
  ];

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddEntry = () => {
    if (newEntry.date && newEntry.description && newEntry.debitAccount && newEntry.creditAccount && newEntry.amount > 0) {
      const entry: JournalEntry = {
        id: entries.length + 1,
        ...newEntry
      };
      setEntries([...entries, entry]);
      setNewEntry({ date: '', description: '', reference: '', debitAccount: '', creditAccount: '', amount: 0 });
      setIsAddEntryOpen(false);
    }
  };

  const handleDeleteEntry = (id: number) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const totalDebit = filteredEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalCredit = filteredEntries.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Jurnal Umum</h1>
          <p className="text-gray-600 mt-1">Catat semua transaksi keuangan perusahaan</p>
        </div>
        <button
          onClick={() => setIsAddEntryOpen(true)}
          className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Entry</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-800">{entries.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Debit</p>
              <p className="text-2xl font-bold text-green-600">Rp {(totalDebit / 1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Credit</p>
              <p className="text-2xl font-bold text-red-600">Rp {(totalCredit / 1000000).toFixed(1)}M</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="all">All Accounts</option>
              <option value="kas">Kas</option>
              <option value="bank">Bank</option>
              <option value="piutang">Piutang</option>
            </select>
          </div>
        </div>
      </div>

      {/* Journal Entries Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Journal Entries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Debit Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(entry.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.debitAccount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.creditAccount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Rp {entry.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button className="text-green-600 hover:text-green-800 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Entry Modal */}
      {isAddEntryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Journal Entry</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
                <input
                  type="text"
                  value={newEntry.reference}
                  onChange={(e) => setNewEntry({...newEntry, reference: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., INV-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Transaction description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Debit Account</label>
                  <select
                    value={newEntry.debitAccount}
                    onChange={(e) => setNewEntry({...newEntry, debitAccount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Account</option>
                    {accounts.map(account => (
                      <option key={account} value={account}>{account}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credit Account</label>
                  <select
                    value={newEntry.creditAccount}
                    onChange={(e) => setNewEntry({...newEntry, creditAccount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Account</option>
                    {accounts.map(account => (
                      <option key={account} value={account}>{account}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  value={newEntry.amount}
                  onChange={(e) => setNewEntry({...newEntry, amount: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsAddEntryOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEntry}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                >
                  Add Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingGeneralJournal;