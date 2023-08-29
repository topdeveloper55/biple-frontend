/* eslint-disable import/prefer-default-export */
import { useEffect, useRef } from 'react';

export const useStore = (...args: any) => {
  const itemRef = useRef<any>(null);

  const getItem = () => itemRef.current;

  const setItem = (event: any) => {
    itemRef.current = event;
    return itemRef.current;
  };

  useEffect(() => {
    itemRef.current = null;
    return () => {
      itemRef.current = null;
    };
  }, args); //eslint-disable-line

  return { getItem, setItem };
};
