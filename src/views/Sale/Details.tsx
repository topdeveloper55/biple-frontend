import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useParams } from 'react-router-dom';
import Accordion from 'components/Accordion';
import GradientText from 'components/GradientText';
import HistoryCard from 'components/HistoryCard';
import { Cross, Unavailable } from 'components/Icon';
import { NFTData } from 'types';
import { getNetwork, injectedConnector } from 'wallet';

const API_KEY = process.env.REACT_APP_API_KEY;
const histories = [
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
];
const categoryList = ['Mint', 'Transfer', 'Sale', 'Offer', 'Listing'];
const Details = () => {
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const { address, id } = useParams<{ address: string; id: string }>();
  const { chainId, account, activate } = useWeb3React();
  const [data, setData] = useState<NFTData>();
  const [categories, setCategories] = useState<string[]>([]);
  const toggleSelect = (value: string) => {
    if (categories.includes(value))
      setCategories(categories.filter((item) => item !== value));
    else setCategories([...categories, value]);
  };
  const getDetail = () => {
    setLoadingData(true);
    fetch(
      `https://api.nftport.xyz/v0/nfts/${address}/${id}?chain=${getNetwork(
        chainId as number
      )}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: API_KEY || '',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data.nft);
        setLoadingData(false);
      })
      .catch((e) => {
        setLoadingData(false);
        console.log(e);
      });
  };
  useEffect(() => {
    if (account) getDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);
  useEffect(() => {
    const connect = async () => {
      await activate(injectedConnector);
    };
    connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex-grow w-full flex flex-col 2xl:flex-row items-start bg-white dark:bg-[#111111] shadow-sm gap-8 py-[26px] px-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800">
      <div className="flex flex-col min-w-[420px] 2xl:max-w-[420px] gap-4 w-full">
        <div className="aspect-square overflow-hidden w-full">
          {(loading || loadingData) && (
            <div className="w-full aspect-square image-loading rounded-2xl"></div>
          )}
          <LazyLoadImage
            className="object-cover w-full transition duration-300 ease-in-out rounded-xl aspect-square group-hover:scale-110"
            alt=""
            placeholder={
              <div className="w-full aspect-square image-loading"></div>
            }
            src={
              data &&
              (data.cached_file_url ? data.cached_file_url : data.file_url)
            } // use normal <img> attributes as props
            // delayTime={5000}
            afterLoad={() => setLoading(false)}
          />
        </div>
        <Accordion title="Properties" open={true}>
          <div className="grid 3xl:grid-cols-3 grid-cols-2 py-4 px-4 gap-2">
            {data !== undefined &&
              data.metadata !== undefined &&
              data.metadata.attributes.map((item, index) => (
                <div
                  className="flex flex-col items-center px-2 py-2 rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22]"
                  key={index}
                >
                  <div className="uppercase text-[10px] font-bold ">
                    <GradientText value={item.trait_type} size={10} />
                  </div>
                  <p className="text-primary dark:text-white font-semibold text-[15px]">
                    {item.value}
                  </p>
                </div>
              ))}
          </div>
        </Accordion>
        <Accordion title="Token Details" open={true}>
          <div className="flex flex-col py-4 px-4 gap-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-secondary">Token ID</p>
              <p className="text-sm font-bold text-primary dark:text-white">
                {data?.token_id}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-secondary">Blockchain</p>
              <p className="text-sm font-bold text-primary dark:text-white">
                {data?.chain}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-secondary">
                Token Standard
              </p>
              <p className="text-sm font-bold text-primary dark:text-white">
                {data?.metadata_url ? 'ERC721' : 'ERC1155'}
              </p>
            </div>
            <div className="bg-[#F3F3F5] dark:bg-[#1F1F22] w-full h-[1px]"></div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-secondary">Contract</p>
              <a
                href={`https://etherscan.io/address/${data?.contract_address}`}
                className="text-sm font-bold"
              >
                <GradientText
                  value={
                    data?.contract_address?.substring(0, 6) +
                    '...' +
                    data?.contract_address?.substring(
                      data.contract_address.length - 4,
                      data.contract_address.length
                    )
                  }
                  size={14}
                />
              </a>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-secondary">
                Creator Royalties
              </p>
              <p className="text-sm font-bold text-primary dark:text-white">
                7.5%
              </p>
            </div>
          </div>
        </Accordion>
      </div>
      <div className="flex flex-col gap-6 w-full min-w-[260px]">
        <div className="flex flex-col">
          <p className="flex items-center gap-1 text-secondary dark:text-white">
            Tronwars
            <svg
              className="max-w-3.5 max-h-3.5"
              width="10px"
              height="10px"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.26433 10H4.73567L3.49218 8.71929H1.65302L1.25838 8.34698V6.54505L0 5.26433V4.73567L1.25838 3.45495V1.64557L1.65302 1.27327H3.49218L4.73567 0H5.26433L6.54505 1.27327H8.35443L8.72673 1.63812V3.45495L10 4.73567V5.26433L8.70439 6.54505V8.34698L8.33209 8.71929H6.54505L5.26433 10ZM4.03574 6.84289H4.56441L7.37156 4.03574L6.84289 3.50707L4.3038 6.05361L3.27625 5.02606L2.74758 5.55473L4.03574 6.84289Z"
                fill="#4776E6"
              />
            </svg>
          </p>
          <p className="flex items-center gap-1 text-primary text-sm">
            Goblal Floor
            <svg
              className="max-w-[9px] max-h-3.5 mr-1 fill-[#565A7F] dark:fill-white"
              width="9"
              height="16"
              viewBox="0 0 9 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8.99704 8.15L4.5 11.05L0 8.15L4.5 0L8.99704 8.15ZM4.5 11.9812L0 9.08125L4.5 16L9 9.08125L4.5 11.9812Z" />
            </svg>
            0.028
          </p>
        </div>
        <p className="text-[44px] text-primary dark:text-white">
          {data?.metadata?.name}
        </p>
        <p className="text-sm text-secondary">{data?.metadata?.description}</p>
        <div className="flex gap-4 items-center">
          <img
            className="max-w-[52px] aspect-square rounded-full"
            src={data?.cached_file_url}
            alt=""
          />
          <div className="flex flex-col items-start gap-2">
            <p className="text-secondary dark:text-white text-xs">Owner</p>
            <a
              href={`https://etherscan.io/address/${account}`}
              target="_blank"
              rel="noreferrer"
            >
              <GradientText
                value={
                  account?.substring(0, 6) +
                  '...' +
                  account?.substring(account?.length - 4, account?.length)
                }
                size={12}
              />
            </a>
          </div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-1 border border-secondary"
            aria-label="Contact the owner"
            href="https://chat.blockscan.com/index?a=0x8B0A570F3F95B56A1CbBf48D87e3144C3AAa33A0"
            data-id="nft-owner-details-chat-button"
          >
            <svg
              className="w-6 h-6 fill-secondary"
              viewBox="0 0 32 32"
              focusable="false"
              aria-hidden="true"
            >
              <path d="M24 10H8V12H24V10Z" fill=""></path>
              <path d="M18 16H8V18H18V16Z" fill=""></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.74 30L21.16 24H26C28.2091 24 30 22.2091 30 20V8C30 5.79086 28.2091 4 26 4H6C3.79086 4 2 5.79086 2 8V20C2 22.2091 3.79086 24 6 24H14V30H17.74ZM16 28V22H6C4.89543 22 4 21.1046 4 20V8C4 6.89543 4.89543 6 6 6H26C27.1046 6 28 6.89543 28 8V20C28 21.1046 27.1046 22 26 22H20L16.5714 28H16Z"
                fill=""
              ></path>
            </svg>
          </a>
        </div>
        <div className="flex gap-4 mb-4 bg-[#F3F3F5] dark:bg-[#1F1F22] p-4 rounded-lg flex-wrap">
          <div className="flex flex-col flex-grow gap-2">
            <p className="text-primary dark:text-secondary">Current Price</p>
            <div className="flex items-end">
              <svg
                className="h-6 w-4 self-center mr-1 fill-[#565A7F] dark:fill-white"
                width="9"
                height="16"
                viewBox="0 0 9 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.99704 8.15L4.5 11.05L0 8.15L4.5 0L8.99704 8.15ZM4.5 11.9812L0 9.08125L4.5 16L9 9.08125L4.5 11.9812Z" />
              </svg>
              <p className="font-bold text-secondary dark:text-white text-[32px] leading-8">
                0.028
              </p>
              <p className="font-semibold text-primary dark:text-secondary text-sm">
                ($219.19)
              </p>
            </div>
            <p className="text-primary dark:text-secondary">Current floor</p>
            <div className="flex items-end">
              <svg
                className="h-6 w-4 self-center mr-1 fill-[#565A7F] dark:fill-white"
                width="9"
                height="16"
                viewBox="0 0 9 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.99704 8.15L4.5 11.05L0 8.15L4.5 0L8.99704 8.15ZM4.5 11.9812L0 9.08125L4.5 16L9 9.08125L4.5 11.9812Z" />
              </svg>
              <p className="font-bold text-secondary dark:text-white text-[32px] leading-8">
                0.028
              </p>
              <p className="font-semibold text-primary dark:text-secondary text-sm">
                ($219.19)
              </p>
            </div>
            <p className="text-primary dark:text-white">
              Time left <b>4d 22h</b>
            </p>
          </div>
          <div className="flex-grow flex flex-col gap-2">
            <button className="min-w-[160px] rounded-[10px] bg-gradient-to-r hover:from-[#4776E6dd] hover:to-[#8E54E9dd] from-[#4776E6] to-[#8E54E9] text-white text-sm font-[600] px-5 py-3.5">
              Buy Now
            </button>
            <button className="min-w-[160px] rounded-[10px] bg-gradient-to-r hover:from-[#4776E666] from-[#4776E634] to-[#8E54E934] hover:to-[#8E54E966] text-primary dark:text-white text-sm font-[600] px-5 py-3.5">
              Make Offer
            </button>
          </div>
        </div>
        <Accordion title="Activity" open={false}>
          <div className="flex flex-col py-4 px-4 gap-4">
            <div className="flex gap-3 flex-wrap">
              {categoryList.map((value, index) => (
                <button
                  key={index}
                  onClick={() => toggleSelect(value)}
                  className={`rounded-lg px-6 py-2 flex justify-start gap-[18px] items-center ${
                    categories.includes(value)
                      ? 'bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white'
                      : 'bg-gradient-to-r from-[#4776E620] to-[#8E54E920] text-primary dark:text-white hover:from-[#4776E640] hover:to-[#8E54E940]'
                  }`}
                >
                  {value}
                </button>
              ))}
              {categories.length > 0 && (
                <button
                  onClick={() => setCategories([])}
                  className="rounded-lg px-6 py-2 flex justify-start gap-1 items-center bg-gradient-to-r from-[#4776E620] to-[#8E54E920] text-primary dark:text-white hover:from-[#4776E640] hover:to-[#8E54E940]"
                >
                  <div className="max-w-3.5 flex flex-col">
                    <Cross />
                  </div>
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-col divide-y divide-[#697A8D33]">
              {histories.map((item, index) => (
                <HistoryCard data={item} key={index} />
              ))}
            </div>
          </div>
        </Accordion>
        <Accordion title="Offers" open={false}>
          <div className="flex flex-col py-4 px-4 gap-4 items-center">
            <Unavailable />
            <p className="text-secondary text-2xl font-semibold">
              No offers found
            </p>
          </div>
        </Accordion>
      </div>
    </div>
  );
};

export default Details;
