import React, { useState } from 'react';
import { CreditCard, DollarSign, Clock, CheckCircle, XCircle, Plus, Calendar, Filter } from 'lucide-react';

interface Withdrawal {
  id: number;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  processedDate?: string;
}

interface WithdrawalManagementProps {
  storeId?: string | null;
}

const WithdrawalManagement: React.FC<WithdrawalManagementProps> = ({ storeId }) => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([
    {
      id: 1,
      amount: 5000000,
      bankName: 'Bank BCA',
      accountNumber: '1234567890',
      accountHolder: 'John Doe',
      requestDate: '2024-01-15',
      status: 'completed',
      processedDate: '2024-01-16'
    },
    {
      id: 2,
      amount: 3000000,
      bankName: 'Bank Mandiri',
      accountNumber: '0987654321',
      accountHolder: 'Jane Smith',
      requestDate: '2024-01-14',
      status: 'pending'
    },
    {
      id: 3,
      amount: 2500000,
      bankName: 'Bank BNI',
      accountNumber: '1122334455',
      accountHolder: 'Mike Johnson',
      requestDate: '2024-01-13',
      status: 'approved'
    },
    {
      id: 4,
      amount: 1500000,
      bankName: 'Bank BRI',
      accountNumber: '5544332211',
      accountHolder: 'Sarah Wilson',
      requestDate: '2024-01-12',
      status: 'rejected'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [newWithdrawal, setNewWithdrawal] = useState({
    amount: 0,
    bankName: '',
    accountNumber: '',
    accountHolder: ''
  });

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesStatus = filterStatus === 'all' || withdrawal.status === filterStatus;
    return matchesStatus;
  });

  const totalWithdrawals = withdrawals.length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;
  const completedWithdrawals = withdrawals.filter(w => w.status === 'completed').length;
  const totalAmount = withdrawals.filter(w => w.status === 'completed').reduce((sum, w) => sum + w.amount, 0);

  const stats = [
    { 
      label: 'Total Withdrawals', 
      value: totalWithdrawals, 
      icon: CreditCard, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Pending Requests', 
      value: pendingWithdrawals, 
      icon: Clock, 
      color: 'bg-yellow-500' 
    },
    { 
      label: 'Completed', 
      value: completedWithdrawals, 
      icon: CheckCircle, 
      color: 'bg-green-500' 
    },
    { 
      label: 'Total Amount', 
      value: `Rp ${(totalAmount / 1000000).toFixed(1)}M`, 
      icon: DollarSign, 
      color: 'bg-purple-500' 
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const handleStatusChange = (id: number, newStatus: 'approved' | 'rejected' | 'completed') => {
    setWithdrawals(withdrawals.map(withdrawal => 
      withdrawal.id === id 
        ? { 
            ...withdrawal, 
            status: newStatus,
            processedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : withdrawal.processedDate
          }
        : withdrawal
    ));
  };

  const handleRequestWithdrawal = () => {
    if (newWithdrawal.amount > 0 && newWithdrawal.bankName && newWithdrawal.accountNumber && newWithdrawal.accountHolder) {
      const withdrawal: Withdrawal = {
        id: withdrawals.length + 1,
        ...newWithdrawal,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      setWithdrawals([...withdrawals, withdrawal]);
      setNewWithdrawal({ amount: 0, bankName: '', accountNumber: '', accountHolder: '' });
      setIsRequestModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Withdrawal Management</h1>
        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Request Withdrawal</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Balance Card */}
      <div className="bg-primary rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Available Balance</h3>
            <p className="text-3xl font-bold">Rp 25,750,000</p>
            <p className="text-sm opacity-90 mt-1">Ready for withdrawal</p>
          </div>
          <div className="text-right">
            <CreditCard className="w-16 h-16 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Withdrawal History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">#{withdrawal.id.toString().padStart(4, '0')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">Rp {withdrawal.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">{withdrawal.bankName}</div>
                      <div className="text-gray-500">{withdrawal.accountNumber}</div>
                      <div className="text-gray-500">{withdrawal.accountHolder}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(withdrawal.requestDate).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(withdrawal.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(withdrawal.status)}`}>
                        {withdrawal.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {withdrawal.status === 'pending' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleStatusChange(withdrawal.id, 'approved')}
                          className="text-green-600 hover:text-green-800 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(withdrawal.id, 'rejected')}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {withdrawal.status === 'approved' && (
                      <button
                        onClick={() => handleStatusChange(withdrawal.id, 'completed')}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Withdrawal Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Request New Withdrawal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={newWithdrawal.amount}
                  onChange={(e) => setNewWithdrawal({...newWithdrawal, amount: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter withdrawal amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <select
                  value={newWithdrawal.bankName}
                  onChange={(e) => setNewWithdrawal({...newWithdrawal, bankName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Bank</option>
                  <option value="Bank BCA">Bank BCA</option>
                  <option value="Bank Mandiri">Bank Mandiri</option>
                  <option value="Bank BNI">Bank BNI</option>
                  <option value="Bank BRI">Bank BRI</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={newWithdrawal.accountNumber}
                  onChange={(e) => setNewWithdrawal({...newWithdrawal, accountNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter account number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={newWithdrawal.accountHolder}
                  onChange={(e) => setNewWithdrawal({...newWithdrawal, accountHolder: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter account holder name"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestWithdrawal}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                >
                  Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredWithdrawals.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No withdrawal requests found</p>
        </div>
      )}
    </div>
  );
};

export default WithdrawalManagement;