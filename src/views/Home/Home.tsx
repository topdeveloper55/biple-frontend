import Brand from 'assets/images/home-brand.png';
import JRNY from 'assets/images/jrny-back.png';
import Mekaverse from 'assets/images/mekaverse-back.png';
import MotionDesign from 'assets/images/motion-design-back.png';
import BitcoinChat from 'assets/images/bitcoin-chat-back.png';
import CommunityCard from 'components/CommunityCard';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { useHistory } from 'react-router-dom';
import { selectRoom } from 'action/navigation';
const data = [
  {
    id: 0,
    name: 'JRNY CLUB',
    description:
      'JRNY CLUB is a membership that grants you early access to private community chat, exclusive NFT videos, early access to partner NFT projects and more..',
    members: 140000,
    image: JRNY,
  },
  {
    id: 1,
    name: 'Mekaverse',
    description:
      'The MekaVerse is a collection of 8,888 generative Mekas inspired by the Japanese Anime universe.',
    members: 161000,
    image: Mekaverse,
  },
  {
    id: 2,
    name: 'Motion design',
    description:
      'A place where you can discuss motion design, meet artists and more.',
    members: 11000,
    image: MotionDesign,
  },
  {
    id: 3,
    name: 'Bitcoin chat',
    description:
      "Bitcoin is an open source censorship-resistant peer-to-peer immutable network.Don't trust; verify. Not your keys; not your coins.",
    members: 300000,
    image: BitcoinChat,
  },
];
const Home = () => {
  const currentRoom = useSelector(
    (state: RootState): any => state.community.current
  );
  const accessToken = useSelector(
    (state: RootState): any => state.auth.accessToken
  );
  const history = useHistory();
  useEffect(() => {
    if (!accessToken) history.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);
  useEffect(() => {
    if (currentRoom) {
      history.push('/chat');
      selectRoom(currentRoom.roomId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom]);
  return (
    <div className="text-primary dark:text-white flex-grow flex flex-col bg-white dark:bg-[#111111] shadow-sm gap-4 py-[22px] items-center">
      <div className="flex flex-col w-full px-[22px] gap-4">
        <button className="w-full rounded-lg flex justify-center items-center gap-4 bg-[#F3F3F5] hover:bg-[#e5e5e5] dark:bg-[#1F1F22] hover:dark:bg-[#2f2f32] py-2">
          <svg
            className="max-w-4 max-h-4"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 15L11.6166 11.6166M13.4445 7.22226C13.4445 10.6587 10.6587 13.4445 7.22226 13.4445C3.7858 13.4445 1 10.6587 1 7.22226C1 3.7858 3.7858 1 7.22226 1C10.6587 1 13.4445 3.7858 13.4445 7.22226Z"
              stroke="#565A7F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Explore...
        </button>
        <img
          className="aspect-[5.23] w-full object-bottom object-cover rounded-lg max-h-[222px]"
          src={Brand}
          alt=""
        />
      </div>
      <div className="px-[22px] flex flex-col w-full gap-3.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-80">
        <div className="flex justify-between w-full items-end">
          <p className="font-bold text-[26px]">Featured Comunity</p>
          <button className="text-[15px] font-semibold text-secondary dark:text-white">
            See all
          </button>
        </div>
        <div className="w-full grid 2xl:grid-cols-2 grid-cols-1 gap-8 justify-center">
          <CommunityCard data={data[0]} />
          <CommunityCard data={data[1]} />
        </div>
        <div className="flex justify-between w-full items-end">
          <p className="font-bold text-[26px]">Currated for you</p>
          <button className="text-[15px] font-semibold text-secondary dark:text-white">
            See all
          </button>
        </div>
        <div className="w-full grid 2xl:grid-cols-2 grid-cols-1 gap-8 justify-center">
          <CommunityCard data={data[2]} />
          <CommunityCard data={data[3]} />
        </div>
      </div>
    </div>
  );
};

export default Home;
