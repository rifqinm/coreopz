import React from 'react';
import { FileText, Settings, Calendar, Clock } from 'lucide-react';

const IntegrationSheets: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sheets Integration</h1>
          <p className="text-gray-600 mt-1">Connect and sync data with spreadsheet applications</p>
        </div>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-blue-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Coming Soon</h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            We're working hard to bring you seamless integration with Google Sheets, Excel Online, and Airtable. 
            This feature will allow you to sync your data automatically with your favorite spreadsheet applications.
          </p>
          
          <div className="bg-white rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Planned Features:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Google Sheets Integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Excel Online Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Airtable Connectivity</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Real-time Synchronization</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Automated Data Export</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Expected release: Q2 2024</span>
          </div>
        </div>
      </div>

      {/* Notification Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Get Notified</h3>
            <p className="text-gray-600 text-sm">
              Want to be the first to know when Sheets Integration is available? We'll notify you via email.
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-3">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all">
            Notify Me
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSheets;