import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const useLoading = () => {
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const query = searchParams.get('q');

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 999); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, [id, query]);

  return isLoading;
};

export default useLoading;