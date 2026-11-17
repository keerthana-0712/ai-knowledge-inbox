import { useState } from 'react';
import { QueryResult } from '../types';
import { api } from '../services/api';

export function useRAGQuery() {
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = async (question: string) => {
    if (!question.trim()) return;

    setIsQuerying(true);
    setError(null);
    try {
      const response = await api.queryRAG(question);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'An error occurred while querying the knowledge base.');
    } finally {
      setIsQuerying(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return {
    result,
    isQuerying,
    error,
    executeQuery,
    clearResult,
  };
}
