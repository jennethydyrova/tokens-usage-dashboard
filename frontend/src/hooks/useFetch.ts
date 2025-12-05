import { useEffect, useState } from "react";
import axios from "axios";

// This hook is okay for basic fetch but it runs whenever the component mounts
// or the url changes, which means it refetches data on every page reload,
// which is not ideal. In production app, I would probably use something like
// React Query, which handles caching, deduplication, etc.
export const useFetch = <T = any>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setIsPending(false);
      return;
    }

    let isCancelled = false;

    const fetchData = async () => {
      setIsPending(true);
      setError(null);

      try {
        const res = await axios.get<T>(url);
        if (!isCancelled) {
          setData(res.data);
          setIsPending(false);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err.message || "Something went wrong");
          setIsPending(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [url]);

  return { data, isPending, error };
};
