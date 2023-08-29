import GradientText from 'components/GradientText';
import NFTCard from 'components/NFTCard';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useEffect, useState } from 'react';
import { getNetwork, injectedConnector } from 'wallet';
import { useHistory } from 'react-router-dom';

import metamask from 'assets/images/metamask.png';
import phantom from 'assets/images/phantom.png';
import quiz from 'assets/images/quiz.png';
import plus from 'assets/images/plus.png';
import check from 'assets/images/check.png';
import back from 'assets/images/back.png';

import Img1 from 'assets/images/1.png';
import Img2 from 'assets/images/2.png';
import Img3 from 'assets/images/3.png';
import Img4 from 'assets/images/4.png';
import Img5 from 'assets/images/5.png';
import Img6 from 'assets/images/6.png';
import Img7 from 'assets/images/7.png';
import Img8 from 'assets/images/8.png';
import Img9 from 'assets/images/9.png';

const images = [Img1, Img2, Img3, Img4, Img5, Img6, Img7, Img8, Img9];

const API_KEY = process.env.REACT_APP_API_KEY;

const ConnectWallet = () => {
  const { chainId, account, activate } = useWeb3React<Web3Provider>();
  const [nfts, setNfts] = useState([]);
  const history = useHistory();
  const onMetamaskConnect = () => {
    activate(injectedConnector);
  };
  const onPhantomConnect = () => {
    console.log('connecting phantom wallet');
  };
  const getNfts = () => {
    fetch(
      `https://api.nftport.xyz/v0/accounts/${account}?chain=${getNetwork(
        chainId as number
      )}&include=metadata`,
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
        setNfts(data.nfts);
      });
  };
  useEffect(() => {
    if (account) {
      getNfts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);
  return (
    <div className="flex-grow flex justify-center">
      {account === undefined ? (
        <div className="flex gap-2.5 w-full">
          <div className="flex flex-grow shadow-sm bg-white dark:bg-[#111111] py-[52px] justify-center relative">
            <div className="flex flex-col items-center">
              <button
                onClick={() => history.goBack()}
                className="flex gap-2.5 items-center top-[60px] left-20 absolute"
              >
                <img src={back} alt="" />
                <p className="text-primary text-[15px] font-semibold">Back</p>
              </button>
              <p className="text-primary text-[26px] font-bold">
                Connect your wallet
              </p>
              <div className="flex flex-row gap-[174px] mt-16">
                <div className="flex flex-col items-center gap-3">
                  <img src={metamask} alt="metamask" />
                  <p className="text-primary text-sm font-bold">
                    Metamask wallet
                  </p>
                  <button
                    onClick={onMetamaskConnect}
                    className="bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-sm font-bold rounded-full text-white px-10 py-2"
                  >
                    Connect
                  </button>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <img src={phantom} alt="phantom" />
                  <p className="text-primary text-sm font-bold">
                    Phantom wallet
                  </p>
                  <button
                    onClick={onPhantomConnect}
                    className="bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-sm font-bold rounded-full text-white px-10 py-2"
                  >
                    Connect
                  </button>
                </div>
              </div>
              <div className="mt-16 flex items-center gap-2">
                <img src={check} alt="reminder" />
                <GradientText value="Remind me later" size={15} />
              </div>
              <p className="text-secondary mt-8">
                Read-only access is given to verify the token holding of the
                wallet that is available on the blockchain
              </p>
              <p className="text-secondary">
                This does not give Biples access to your funds or the power to
                act on you behalf.
              </p>
              <div className="bg-[#697A8D66] h-[1px] w-full mt-8"></div>
              <img className="mt-20" src={quiz} alt="quiz" />
              <p className="font-semibold text-primary text-[13px]">
                How to create a wallet?
              </p>
            </div>
          </div>
          <div className="flex flex-col min-w-[355px] pt-[60px] px-[35px] bg-white dark:bg-[#111111] gap-5 shadow-sm">
            <p className="px-5 text-primary font-semibold text-sm">
              Want to flex?
            </p>
            <div className="grid grid-cols-3 gap-1">
              {images.map((url, index) => (
                <img
                  className="aspect-square bg-[#F3F3F5] dark:bg-[#1F1F22] rounded-[10px]"
                  src={url}
                  alt=""
                  key={index}
                />
              ))}
            </div>
            <div className="border-t border-t-[#697A8D66] pt-[30px] flex items-start gap-3.5 max-w-[285px]">
              <img src={check} alt="" />
              <GradientText
                value="The world will see your beautiful collection if you allow it!"
                size={15}
                align="left"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-5 px-[54px] flex-grow bg-white dark:bg-[#111111]">
          <div className="flex items-end w-full">
            <p className="w-full font-semibold text-[15px] text-primary">
              Selet an NFT
            </p>
            <button className="py-2 min-w-[220px] bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-sm font-bold text-white">
              Create a community
            </button>
            <p className="w-full text-right font-semibold text-[15px] text-primary">
              From your wallet
            </p>
          </div>
          <div className="bg-[#697A8D66] h-[1px] w-full mt-3"></div>
          <div className="grid 3xl:grid-cols-5 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-4 mt-4 self-center w-full">
            {nfts.map((nft: any, index: number) => (
              <NFTCard
                key={index}
                data={{
                  image: nft.cached_file_url
                    ? nft.cached_file_url
                    : nft.file_url,
                  name: nft.name,
                  tokenId: nft.token_id,
                }}
              />
            ))}
            <div className="w-full bg-[#F3F3F5] dark:bg-[#1F1F22] flex flex-col aspect-square justify-center items-center gap-9 rounded-lg">
              <img src={plus} alt="rounded plus" />
              <div className="max-w-[144px] flex">
                <GradientText
                  size={14}
                  value={`See all NFTs from your wallet`}
                />
              </div>
            </div>
          </div>
          <button className="mt-8 cursor-pointer">
            <GradientText size={14} value="Join a community manually" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
