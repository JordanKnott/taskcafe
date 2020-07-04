import { useRef } from 'react';
import { isEqual } from 'lodash';

const useDeepCompareMemoize = (value: any) => {
  const valueRef = useRef();

  if (!isEqual(value, valueRef.current)) {
    valueRef.current = value;
  }
  return valueRef.current;
};

export default useDeepCompareMemoize;
