import React from 'react';

const useStateWithLocalStorage = (localStorageKey: string): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [value, setValue] = React.useState<string>(localStorage.getItem(localStorageKey) || '');

  React.useEffect(() => {
    localStorage.setItem(localStorageKey, value);
  }, [value]);

  return [value, setValue];
};

export default useStateWithLocalStorage;
