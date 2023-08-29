import { useWeb3React } from '@web3-react/core';
import { useState, useEffect } from 'react';
import Toggle from 'components/Toggle';
import WalletCard from 'components/WalletCard';
import { getNetwork, injectedConnector } from 'wallet';

const API_KEY = '48c78f9c-ac26-46c2-a3e3-8905940f5a7c';
const collectionAddress = '0x537B2279d8f625a1B74CF3C1f0e2122fB047A6B0';
const Wallet = () => {
  const { account, chainId, activate } = useWeb3React();
  const [search, setSearch] = useState('');
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const keyPress = (e: any) => {};
  const getNfts = () => {
    setLoading(true);
    fetch(
      `https://api.nftport.xyz/v0/accounts/${account}?chain=${getNetwork(
        chainId as number
      )}&include=metadata`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: API_KEY,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.nfts);
        setNfts(data.nfts);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };
  useEffect(() => {
    if (account) {
      getNfts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);
  useEffect(() => {
    const connect = () => {
      activate(injectedConnector);
    };
    return connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(
    showAll
      ? nfts
      : nfts.filter((nft: any) => nft.contract_address === collectionAddress)
  );
  return (
    <div className="flex-grow flex flex-col bg-white dark:bg-[#111111] shadow-sm gap-9 py-[26px]">
      <div className="flex items-center justify-between gap-4 px-20">
        <div>
          <Toggle
            value={showAll}
            onChange={(e: any) => setShowAll(e.target.checked)}
            label="Show All"
          />
        </div>
        <button
          onClick={getNfts}
          className="rounded-[10px] bg-gradient-to-r hover:from-[#4776E6dd] hover:to-[#8E54E9dd] from-[#4776E6] to-[#8E54E9] text-white text-sm font-[600] px-5 py-[14px]"
        >
          Refresh
        </button>
        <input
          className="px-[22px] py-3.5 text-sm rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white flex-grow max-w-[600px]"
          placeholder="Search NFTs by name or token ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={keyPress}
        />
        <p className="bg-gradient-to-r text-sm from-[#4776E619] to-[#8E54E919] rounded-[10px] px-4 py-3.5 text-primary">
          Welcome{' '}
          <span className="font-[600]">
            {account?.substring(0, 4)}...
            {account?.substring(account.length - 4)}
          </span>
        </p>
      </div>
      <div className="flex flex-grow px-20 items-start overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800">
        {!loading ? (
          <div className="grid 3xl:grid-cols-5 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-4 w-full">
            {(showAll
              ? nfts
              : nfts.filter(
                  (nft: any) => nft.contract_address === collectionAddress
                )
            ).map((nft: any, index: number) => (
              <WalletCard
                key={index}
                data={{
                  image: nft.cached_file_url
                    ? nft.cached_file_url
                    : nft.file_url,
                  name: nft.name,
                  tokenId: nft.token_id,
                  collection: {
                    name:
                      nft.contract_address === collectionAddress
                        ? 'Tronwars'
                        : 'N/A',
                    address: '0x537B2279d8f625a1B74CF3C1f0e2122fB047A6B0',
                    verified: true,
                  },
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex w-full justify-center mt-8">
            <div role="status">
              <svg
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
