/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';
import { fetchNfts } from 'utils/nft';

export const useNfts = (account = '', count = 0) => {
  const [nfts, setNfts] = useState([]);

  const getNfts = async () => {
    const data = await fetchNfts(account, count).catch(e => setNfts([]))
    setNfts(data);
  };
  useEffect(() => {
    if (account) getNfts();
  }, [account]); //eslint-disable-line

  return [nfts, fetchNfts];
};
