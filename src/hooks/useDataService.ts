import { useState } from 'react';
import { DataService } from '../services/dataService';

export const useDataService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeWithServiceRole = async (operation: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const insertData = async (table: string, data: any) => {
    return executeWithServiceRole(() => DataService.insertWithServiceRole(table, data));
  };

  const insertMultipleData = async (table: string, dataArray: any[]) => {
    return executeWithServiceRole(() => DataService.insertMultipleWithServiceRole(table, dataArray));
  };

  const updateData = async (table: string, data: any, condition: any) => {
    return executeWithServiceRole(() => DataService.updateWithServiceRole(table, data, condition));
  };

  const deleteData = async (table: string, condition: any) => {
    return executeWithServiceRole(() => DataService.deleteWithServiceRole(table, condition));
  };

  const upsertData = async (table: string, data: any, onConflict?: string) => {
    return executeWithServiceRole(() => DataService.upsertWithServiceRole(table, data, onConflict));
  };

  return {
    loading,
    error,
    insertData,
    insertMultipleData,
    updateData,
    deleteData,
    upsertData,
    clearError: () => setError(null)
  };
};