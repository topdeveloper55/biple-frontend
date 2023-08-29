import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { join } from 'action/room';
import { useStore } from 'hook/useStore';
import { JwtService, MatrixService } from 'services';
import navigation from 'services/navigation';
import {
  getServersSuccess,
  loadingServerAction,
  selectCommunity,
} from 'slices';
import { RootState } from 'store';
import GradientText from './GradientText';
import solImg from 'assets/images/sol.png';
import ethImg from 'assets/images/eth.png';
import { useToasts } from 'react-toast-notifications';
import { selectRoom } from 'action/navigation';
import Avatar from './Avatar';
import colorMXID from 'utils/colorMXID';

const ALIAS_OR_ID_REG = /^[#|!].+:.+\..+$/;

const JoinServer = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState('');
  const [servers, setServers] = useState([]);
  const [focus, setFocus] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const history = useHistory();
  const { addToast } = useToasts();
  const user = useSelector((state: RootState) => state.auth.user);
  // const [lastJoinId, setLastJoinId] = useState('')
  const mx = MatrixService.matrixClient;
  const mountStore = useStore();

  const dispatch = useDispatch();

  const openRoom = (roomId: string) => {
    const room = mx?.getRoom(roomId);
    if (!room) return;
    if (room.isSpaceRoom()) navigation._selectRoom();
  };

  const handleJoin = async () => {
    if (focus === undefined || focus === null) {
      return addToast('Please select community to join', {
        appearance: 'warning',
      });
    }
    setJoining(true);
    mountStore.setItem(true);
    const alias = focus?.roomId;
    const announcement = focus?.announcement;
    if (alias.trim() === '' || announcement.trim() === '') return;
    if (
      alias.match(ALIAS_OR_ID_REG) === null ||
      announcement.match(ALIAS_OR_ID_REG) === null
    ) {
      console.log('Invalid address');
      addToast('Invalid address!', { appearance: 'error' });
      setJoining(false);
      return;
    }
    let via;
    // if (alias.startsWith('#')) {
    //   try {
    //     const aliasData = await mx?.resolveRoomAlias(alias)
    //     via = aliasData?.servers.slice(0, 3) || []
    //     if (mountStore.getItem()) {
    //       console.timeLog(`joining ${alias}...`)
    //     }
    //   } catch (err) {
    //     if (!mountStore.getItem()) return
    //     console.log(`unable to find room/space with ${alias}. Either room/space is private or doesn't exist`)
    //   }
    // }
    try {
      await join(announcement, false, via);
      const roomId = await join(alias, false, via);
      if (!mountStore.getItem()) return;
      // setLastJoinId(roomId)
      JwtService.joinServer({
        communityId: focus._id,
      })
        .then((res: any) => {
          dispatch(loadingServerAction(true));
          JwtService.getServersByUser(user.id ? user.id : '')
            .then((res) => {
              addToast('Joined community successfully!', {
                appearance: 'success',
              });
              dispatch(getServersSuccess(res));
              dispatch(selectCommunity(focus));
              setJoining(false);
              selectRoom(alias);
              history.push('/chat');
            })
            .catch((e: any) => {
              console.log(e);
              addToast(e.message ? e.message : JSON.stringify(e), {
                appearance: 'error',
              });
              dispatch(loadingServerAction(false));
              setJoining(false);
            });
          openRoom(roomId);
          onClose();
        })
        .catch((e: any) => {
          addToast(e.message ? e.message : JSON.stringify(e), {
            appearance: 'error',
          });
          setJoining(false);
          onClose();
        });
    } catch {
      if (!mountStore.getItem()) return;
      addToast(
        `unable to find community with ${alias}. Either community is private or doesn't exist`,
        { appearance: 'error' }
      );
      // console.log(`unable to find room/space with ${alias}. Either room/space is private or doesn't exist`)
    }
  };
  const keyPress = (e: any) => {
    if (e.keyCode === 13) {
      // if(name === '') return
      // console.log('value', e.target.value)
      setLoading(true);
      JwtService.getServersBySearch(name)
        .then((res: any) => {
          const filtered = res.filter(
            (room: any) => !room.joined.includes(user.id)
          );
          setServers(filtered);
          console.log(filtered);
          setLoading(false);
        })
        .catch((e: any) => {
          console.log(e);
          addToast(e.message ? e.message : JSON.stringify(e), {
            appearance: 'error',
          });
          setLoading(false);
        });
    }
  };
  return (
    <div className="w-full flex flex-col min-h-[600px]">
      <div className="flex justify-center border-b border-[#697A8D66] py-[18px] text-[36px]">
        <GradientText size={36} value="Join a Community" />
      </div>
      <input
        className="px-[22px] py-[14px] text-sm rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic mt-8 text-primary dark:text-white"
        placeholder="Server name here..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={keyPress}
      />
      {name !== '' && (
        <div className="flex justify-end w-full mt-1">
          <GradientText size={12} value='"Enter" to Search' />
        </div>
      )}
      <div className="flex flex-col flex-grow max-h-[460px] p-4 gap-2 bg-[#F3F3F5] dark:bg-[#1F1F22] mt-4 rounded-lg overflow-y-auto text-[#a6aacf] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800">
        {servers.map((item: any) => (
          <div
            onClick={() => setFocus(item)}
            className={`cursor-pointer flex w-full items-center gap-4 px-3 py-2 rounded-lg ${
              focus === item
                ? 'bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white'
                : 'hover:bg-gradient-to-r from-[#4776E620] to-[#8E54E920] text-primary dark:text-white'
            }`}
            key={item._id}
          >
            <Avatar
              imageSrc={mx
                ?.getRoom(item.roomId)
                ?.getAvatarUrl(mx?.baseUrl, 60, 60, 'crop')}
              text={item.serverName}
              bgColor={item.roomId ? colorMXID(item.roomId) : 'tranparent'}
            />
            <p className="text-xl font-bold flex-grow">{item.serverName}</p>
            <img
              className="aspect-square max-w-[48px]"
              src={item.network === 'eth' ? ethImg : solImg}
              alt="chain"
            />
          </div>
        ))}
        {loading && (
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
      <button
        onClick={handleJoin}
        className={`bg-gradient-to-r self-center from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6dd] hover:to-[#8E54E9dd] text-sm font-bold rounded-full text-white px-[60px] py-[8px] mt-6 flex items-center gap-2 ${
          joining && 'pointer-events-none'
        }`}
      >
        Join
        {joining && (
          <div className="flex justify-center w-[16px] h-[16px]">
            <svg
              className="inline min-w-6 min-h-6 text-gray-200 animate-spin fill-white"
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
          </div>
        )}
      </button>
    </div>
  );
};

export default JoinServer;
