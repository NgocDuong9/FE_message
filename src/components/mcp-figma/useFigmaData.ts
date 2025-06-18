import { useState, useEffect } from 'react';
import { MCP_CONFIG } from './config';

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  styles?: any;
}

interface UseFigmaDataReturn {
  data: FigmaNode | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFigmaData = (nodeId: string): UseFigmaDataReturn => {
  const [data, setData] = useState<FigmaNode | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFigmaData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.figma.com/v1/files/${MCP_CONFIG.fileId}/nodes?ids=${nodeId}`,
        {
          headers: {
            'X-Figma-Token': MCP_CONFIG.accessToken || '',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Figma data');
      }

      const result = await response.json();
      setData(result.nodes[nodeId].document);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFigmaData();
  }, [nodeId]);

  return {
    data,
    loading,
    error,
    refetch: fetchFigmaData,
  };
};
