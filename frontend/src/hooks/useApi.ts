import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * A custom hook to handle API calls, managing loading, error, and data states.
 * 
 * Reusable piece of logic that handles the entire lifecycle of an API call in components.
 * It abstracts away the repetitive tasks of managing loading spinners, error messages, and the data itself.
 * Think this hook as a generic engine for handling API requests.
 * 
 * @param fetcher A function that returns a Promise with the data (from fetchData.ts).
 * @param deps A dependency array to trigger refetching when values change.
 * @returns An object with data, loading, and error states.
 */
export const useApi = <T,>(fetcher: () => Promise<T>, deps: React.DependencyList = []): ApiState<T> => {
  const { t } = useTranslation();
  const [state, setState] = useState<ApiState<T>>({ data: null, loading: true, error: null, });

  const memoizedFetcher = useCallback(fetcher, deps);

  useEffect(() => {
    // Flag to prevent state updates on an unmounted component
    let isMounted = true; 

    const fetchData = async () => {
      setState(prevState => ({ ...prevState, loading: true, error: null }));
      try {
        const data = await memoizedFetcher();
        if (isMounted) {
          setState({ data, loading: false, error: null });
        }
      } catch (err) {
        if (isMounted) {
          setState({ data: null, loading: false, error: t('errors.loadDataError') });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [memoizedFetcher, t]);

  return state;
};