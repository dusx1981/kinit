import { useEffect } from 'react';

export const useTitle = (title: string) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title ? `${title} - Kinit React Admin` : 'Kinit React Admin';
    
    return () => {
      document.title = originalTitle;
    };
  }, [title]);
};

export default useTitle;
