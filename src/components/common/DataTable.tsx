import React from 'react';
import { Edit, Trash2, Eye, DivideIcon as LucideIcon } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface Action {
  icon: LucideIcon;
  onClick: (row: any) => void;
  color: string;
  label: string;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  actions?: Action[];
  emptyMessage?: string;
  emptyIcon?: LucideIcon;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  data,
  actions = [],
  emptyMessage = "No data found",
  emptyIcon: EmptyIcon
}) => {
  const defaultActions: Action[] = [
    { icon: Eye, onClick: () => {}, color: 'text-blue-600 hover:text-blue-800', label: 'View' },
    { icon: Edit, onClick: () => {}, color: 'text-green-600 hover:text-green-800', label: 'Edit' },
    { icon: Trash2, onClick: () => {}, color: 'text-red-600 hover:text-red-800', label: 'Delete' }
  ];

  const tableActions = actions.length > 0 ? actions : defaultActions;

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12">
        <div className="text-center">
          {EmptyIcon && <EmptyIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />}
          <p className="text-gray-500 text-lg">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {tableActions.length > 0 && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {tableActions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      {tableActions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={() => action.onClick(row)}
                          className={`${action.color} transition-colors`}
                          title={action.label}
                        >
                          <action.icon className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;