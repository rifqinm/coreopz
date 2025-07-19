import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, Loader, Download } from 'lucide-react';
import Toast from './Toast';
import * as XLSX from 'xlsx';

interface WarehouseUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouseId: string;
  warehouseName: string;
}

const WarehouseUploadModal: React.FC<WarehouseUploadModalProps> = ({
  isOpen,
  onClose,
  warehouseId,
  warehouseName
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'loading';
    message: string;
  }>({ show: false, type: 'loading', message: '' });

  const webhookUrl = 'https://doc.rifqinm.web.id/webhook/e9bade4a-cd61-4806-b9a3-bc0b57455640';

  const showToast = (type: 'success' | 'error' | 'loading', message: string) => {
    setToast({ show: true, type, message });
  };

  const hideToast = () => {
    setToast({ show: false, type: 'loading', message: '' });
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.xlsx',
      '.xls'
    ];
    
    const isValidType = allowedTypes.some(type => 
      file.type === type || file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')
    );

    if (!isValidType) {
      showToast('error', 'Please select a valid Excel file (.xlsx or .xls)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('error', 'File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    hideToast();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const downloadTemplate = () => {
    // Create template data for XLSX
    const templateData = [
      ['sku', 'product_name', 'stock_quantity', 'min_stock', 'max_stock', 'buy_price', 'sell_price'],
      ['SKU001', 'Sample Product 1', '100', '10', '500', '50000', '75000'],
      ['SKU002', 'Sample Product 2', '50', '5', '200', '25000', '40000']
    ];

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    
    // Generate XLSX file and download
    XLSX.writeFile(workbook, 'warehouse_products_template.xlsx');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast('error', 'Please select a file first');
      return;
    }

    setIsUploading(true);
    showToast('loading', 'Uploading products to warehouse...');

    try {
      const formData = new FormData();
      formData.append('data', selectedFile);
      formData.append('warehouseId', warehouseId);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        showToast('success', 'Products uploaded successfully to warehouse!');
        // Reset form after 2 seconds
        setTimeout(() => {
          setSelectedFile(null);
          hideToast();
          onClose();
        }, 2000);
      } else {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
    } catch (error: any) {
      showToast('error', error.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetModal = () => {
    setSelectedFile(null);
    setDragActive(false);
    hideToast();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Upload Products</h3>
              <p className="text-sm text-gray-600">{warehouseName}</p>
            </div>
            <button
              onClick={resetModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Download Template Button */}
          <div className="mb-4">
            <button
              onClick={downloadTemplate}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Template</span>
            </button>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-secondary bg-secondary/5'
                : selectedFile
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-3">
                <FileSpreadsheet className="w-12 h-12 text-green-500 mx-auto" />
                <div>
                  <p className="font-medium text-gray-800">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-gray-600 mb-2">
                    Drag and drop your Excel file here, or
                  </p>
                  <label className="inline-block bg-secondary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-secondary/90 transition-colors">
                    Browse Files
                    <input
                      type="file"
                      className="hidden"
                      accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      onChange={handleFileInputChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Supported formats: .xlsx, .xls (Max 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={resetModal}
              disabled={isUploading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex items-center space-x-2 bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Products</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={hideToast}
      />
    </>
  );
};

export default WarehouseUploadModal;