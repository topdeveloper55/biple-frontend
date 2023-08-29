import { useHistory, useLocation } from 'react-router-dom';
import verified from 'assets/images/verified.png';
import verified_active from 'assets/images/verified_active.png';
import { useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import GradientText from './GradientText';
import CreateServer from './CreateServer';
import JoinServer from './JoinServer';
import { JwtService, MatrixService } from 'services';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { useDispatch } from 'react-redux';
import {
  getServersSuccess,
  loadingServerAction,
  selectCommunity,
  setRoomInfo,
} from 'slices';
import cons from 'services/cons';
import navigation from 'services/navigation';
import RoomTimeline from 'services/RoomTimeline';
import VerticalMenuIC from 'assets/ic/outlined/vertical-menu.svg';
import * as roomActions from 'action/room';
import { selectRoom } from 'action/navigation';
import Tooltip from './Tooltip';
import RawIcon from './RawIcon';
import { useToasts } from 'react-toast-notifications';
import Avatar from './Avatar';
import colorMXID from 'utils/colorMXID';
import { useForceUpdate } from 'hook/useForceUpdate';

function CollectionMenu() {
  const { pathname } = useLocation();
  const [index, setIndex] = useState('');
  const [create, setCreate] = useState('');
  const { accessToken, user } = useSelector((state: RootState) => state.auth);
  const currentRoom = useSelector(
    (state: RootState): any => state.community.current
  );
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [, forceUpdate] = useForceUpdate();
  const elRef = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const roomInfo = useSelector((state: RootState) => state.roomInfo);
  const userInfo = useSelector((state: RootState) => state.auth.user);
  const mx = MatrixService.matrixClient;
  const { roomList } = MatrixService;
  const [roomToLeave, setRoomToLeave] = useState<any>();
  const { addToast } = useToasts();

  useEffect(() => {
    if (currentRoom && userInfo) {
      if (currentRoom?.admin !== userInfo.id && pathname.includes('admin')) {
        history.push('/chat');
        selectRoom(currentRoom.roomId);
      }
    }
  }, [currentRoom, userInfo, pathname]); //eslint-disable-line
  useEffect(() => {
    setIndex(currentRoom?._id);
  }, [currentRoom]);
  useEffect(() => {
    const handleRoomSelected = (rId: string, pRoomId: string, eId: any) => {
      roomInfo.roomTimeline?.removeInternalListeners();
      if (mx?.getRoom(rId)) {
        dispatch(
          setRoomInfo({
            roomTimeline: new RoomTimeline(rId),
            eventId: eId ?? null,
          })
        );
      } else {
        // TODO: add ability to join room if roomId is invalid
        dispatch(
          setRoomInfo({
            roomTimeline: null,
            eventId: null,
          })
        );
      }
    };
    const handleUpdate = () => {
      if (typeof forceUpdate === 'function') forceUpdate();
    };
    console.log('room info initialized');
    navigation.on(cons.events.navigation.ROOM_SELECTED, handleRoomSelected);
    roomList?.on(cons.events.roomList.ROOMLIST_UPDATED, handleUpdate);
    return () => {
      navigation.removeListener(
        cons.events.navigation.ROOM_SELECTED,
        handleRoomSelected
      );
      roomList?.removeListener(
        cons.events.roomList.ROOMLIST_UPDATED,
        handleUpdate
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { data: menuData, loading } = useSelector(
    (state: RootState) => state.community
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const scrollContainer = elRef.current;
    if (scrollContainer) {
      const onWheel = (e: any) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        scrollContainer.scrollTo({
          left: scrollContainer.scrollLeft + e.deltaY,
        });
      };
      scrollContainer.addEventListener('wheel', onWheel);
      return () => scrollContainer.removeEventListener('wheel', onWheel);
    }
  }, [menuData]);
  useEffect(() => {
    if (accessToken === undefined || user.id === undefined) return;
    const getServers = async (user: any) => {
      dispatch(loadingServerAction(true));
      JwtService.getServersByUser(user.id)
        .then((res: any) => {
          dispatch(getServersSuccess(res));
        })
        .catch((e: any) => {
          console.log(e);
          dispatch(loadingServerAction(false));
        });
    };
    getServers(user);
  }, [accessToken, user, dispatch]);
  const handleLeave = (e: any) => {
    e.stopPropagation();
    if (roomToLeave) {
      console.log(roomToLeave.announcement, roomToLeave.roomId);
      roomActions.leave(roomToLeave.announcement).then(() => {
        roomActions
          .leave(roomToLeave.roomId)
          .then(() => {
            JwtService.leaveServer({ communityId: roomToLeave._id })
              .then((res: any) => {
                dispatch(loadingServerAction(true));
                JwtService.getServersByUser(user.id ? user.id : '')
                  .then((res: any) => {
                    dispatch(getServersSuccess(res));
                    addToast('You have left the community successfully!', {
                      appearance: 'success',
                    });
                    // selectRoom('')
                    if (res.length === 0) {
                      selectRoom('');
                      history.push('/home');
                    } else {
                      dispatch(selectCommunity(res[0]));
                      selectRoom(res[0].roomId);
                    }
                  })
                  .catch((e: any) => {
                    console.log(e);
                    addToast(e.message ? e.message : JSON.stringify(e), {
                      appearance: 'error',
                    });
                    dispatch(loadingServerAction(false));
                  });
              })
              .catch((e: any) => {
                console.log(e);
                addToast(e.message ? e.message : JSON.stringify(e), {
                  appearance: 'error',
                });
              });
          })
          .catch((e: any) => {
            addToast(e.message ? e.message : JSON.stringify(e), {
              appearance: 'error',
            });
          });
        setShow(false);
      });
    }
  };
  const handleRoomClick = (item: any) => {
    setIndex(item._id);
    dispatch(selectCommunity(item));
    if (item.roomId) {
      if (pathname === '/chat') selectRoom(item.roomId);
      if (pathname === '/announcement') selectRoom(item.announcement);
    }
    if (pathname === '/home') {
      history.push('/chat');
      selectRoom(item.roomId);
    }
  };
  if (
    pathname === '/connect' ||
    pathname.includes('/auth') ||
    pathname === '/private' ||
    pathname === '/user/settings'
  )
    return null;
  else
    return (
      <div className="flex gap-3.5 w-full overflow-x-hidden max-h-[98px] max-w-[calc(100vw-315px-14px)]">
        {menuData.length > 0 && (
          <div
            ref={elRef}
            className="flex -mr-5 gap-3.5 flex-grow overflow-x-auto font-bold text-[17px] min-h-[98px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 -translate-x-5 -skew-x-[20deg]"
          >
            {menuData.map((item: any, i: number) => (
              <div
                key={item._id}
                onClick={() => handleRoomClick(item)}
                className={`relative group cursor-pointer w-full max-w-[240px] min-w-[200px] flex-grow shadow-sm px-[20px] py-[20px]  justify-center flex items-center gap-[8px] first:pl-[40px] ${
                  index === item._id
                    ? 'bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white'
                    : 'bg-white dark:bg-[#111111] text-primary'
                }`}
              >
                {/* <img
                  className="skew-x-[20deg] rounded-full w-full max-w-[52px] aspect-square object-cover"
                  src={item.image}
                  alt=""
                /> */}
                <div className="skew-x-[20deg]">
                  <Avatar
                    imageSrc={mx
                      ?.getRoom(item.roomId)
                      ?.getAvatarUrl(mx?.baseUrl, 60, 60, 'crop')}
                    text={item.serverName}
                    bgColor={
                      item.roomId ? colorMXID(item.roomId) : 'tranparent'
                    }
                  />
                </div>
                <div className="flex items-center gap-[8px]">
                  <p className="skew-x-[20deg]">{item.serverName}</p>
                  {item.verified && (
                    <img
                      className="skew-x-[20deg]"
                      src={item._id === i ? verified_active : verified}
                      alt=""
                    />
                  )}
                </div>
                <div
                  className={`absolute skew-x-[20deg] right-3 top-1 ${
                    index !== item._id && 'hidden'
                  } group-hover:block`}
                >
                  <Tooltip
                    className=""
                    placement="bottom"
                    content={
                      <p className="text-[12px] text-white py-2 px-3 rounded-lg bg-gradient-to-r from-[#4776E6aa] to-[#8E54E9aa]">
                        Leave Community
                      </p>
                    }
                  >
                    <button
                      className={`rounded-full p-1 self-center bg-[#ffffffdd] dark:bg-[#111111bb] hover:bg-slate-300 dark:hover:bg-slate-800 ic-btn w-[30px] aspect-square flex items-center justify-center`}
                      onClick={() => {
                        setShow(true);
                        setRoomToLeave(item);
                      }}
                    >
                      <RawIcon size={18} src={VerticalMenuIC} isImage={false} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            ))}
            <div
              className={`w-full flex-grow justify-center flex items-center gap-[8px] bg-white dark:bg-[#111111] text-primary min-w-[18px]`}
            ></div>
          </div>
        )}
        <div className="flex gap-3.5 -ml-5 first:ml-0 first:-translate-x-5 first:-mr-5 -skew-x-[20deg] translate-x-5 min-h-[98px] justify-center first:w-full">
          <div className="flex-grow flex items-center gap-[8px] bg-white dark:bg-[#111111] px-[36px] py-[20px] text-primary min-w-[240px]">
            <div
              className="cursor-pointer skew-x-[20deg] flex items-center gap-3 whitespace-nowrap"
              onClick={() => {
                setCreate('');
                setOpen(true);
              }}
            >
              <svg
                className="max-w-[23px] max-h-[23px]"
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 3.12131H3C2.46957 3.12131 1.96086 3.33202 1.58579 3.70709C1.21071 4.08217 1 4.59087 1 5.12131V19.1213C1 19.6517 1.21071 20.1604 1.58579 20.5355C1.96086 20.9106 2.46957 21.1213 3 21.1213H17C17.5304 21.1213 18.0391 20.9106 18.4142 20.5355C18.7893 20.1604 19 19.6517 19 19.1213V12.1213M17.5 1.62132C17.8978 1.2235 18.4374 1 19 1C19.5626 1 20.1022 1.2235 20.5 1.62132C20.8978 2.01915 21.1213 2.55871 21.1213 3.12132C21.1213 3.68393 20.8978 4.2235 20.5 4.62132L11 14.1213L7 15.1213L8 11.1213L17.5 1.62132Z"
                  stroke="#565A7F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Add a community
            </div>
          </div>
          {menuData.length === 0 && (
            <div className="flex-grow w-full -ml-10 translate-x-10 bg-white dark:bg-[#111111] flex h-full">
              {loading && (
                <div className="animate-pulse flex w-full gap-3.5">
                  <div className="flex gap-2 items-center w-full max-w-[200px] bg-slate-300 dark:bg-slate-700 px-4 h-full">
                    <div className="rounded-full bg-slate-500 h-[52px] min-w-[52px] skew-x-[20deg]"></div>
                    <div className="min-h-[25px] w-full bg-slate-500 rounded skew-x-[20deg]"></div>
                  </div>
                  <div className="flex gap-2 items-center w-full max-w-[200px] bg-slate-300 dark:bg-slate-700 px-4 h-full">
                    <div className="rounded-full bg-slate-500 h-[52px] min-w-[52px] skew-x-[20deg]"></div>
                    <div className="min-h-[25px] w-full bg-slate-500 rounded skew-x-[20deg]"></div>
                  </div>
                  <div className="flex gap-2 items-center w-full max-w-[200px] bg-slate-300 dark:bg-slate-700 px-4 h-full">
                    <div className="rounded-full bg-slate-500 h-[52px] min-w-[52px] skew-x-[20deg]"></div>
                    <div className="min-h-[25px] w-full bg-slate-500 rounded skew-x-[20deg]"></div>
                  </div>
                  <div className="flex gap-2 items-center w-full max-w-[200px] bg-slate-300 dark:bg-slate-700 px-4 h-full">
                    <div className="rounded-full bg-slate-500 h-[52px] min-w-[52px] skew-x-[20deg]"></div>
                    <div className="min-h-[25px] w-full bg-slate-500 rounded skew-x-[20deg]"></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <Modal open={open} onClose={() => setOpen(false)}>
          {create === '' && (
            <div className="flex gap-8">
              <div
                onClick={() => setCreate('create')}
                className="flex items-center justify-center w-full gap-1 text-[24px] hover:bg-gradient-to-r from-[#4776E620] to-[#8E54E920] px-4 py-2 rounded-md cursor-pointer"
              >
                <GradientText value="Create A Community" size={24} />
                <svg
                  className="max-h-[24px]"
                  width="9"
                  height="14"
                  viewBox="0 0 9 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.785156 1.82483L5.26358 6.71436L0.785156 11.6039L2.26023 13.2144L8.21373 6.71436L2.26023 0.214355L0.785156 1.82483Z"
                    fill="url(#paint0_linear_241_544)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_241_544"
                      x1="4.46034"
                      y1="13.2144"
                      x2="4.46034"
                      y2="0.83696"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#4776E6" />
                      <stop offset="1" stopColor="#8E54E9" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="min-w-[1px] bg-[#697A8D66]"></div>
              <div
                onClick={() => setCreate('join')}
                className="flex items-center justify-center w-full gap-1 text-[24px] hover:bg-gradient-to-r from-[#4776E620] to-[#8E54E920] px-4 py-2 rounded-md cursor-pointer"
              >
                <GradientText value="Join A Community" size={24} />
                <svg
                  className="max-h-[24px]"
                  width="9"
                  height="14"
                  viewBox="0 0 9 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.785156 1.82483L5.26358 6.71436L0.785156 11.6039L2.26023 13.2144L8.21373 6.71436L2.26023 0.214355L0.785156 1.82483Z"
                    fill="url(#paint0_linear_241_544)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_241_544"
                      x1="4.46034"
                      y1="13.2144"
                      x2="4.46034"
                      y2="0.83696"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#4776E6" />
                      <stop offset="1" stopColor="#8E54E9" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          )}
          {create === 'create' && (
            <CreateServer onClose={() => setOpen(false)} />
          )}
          {create === 'join' && <JoinServer onClose={() => setOpen(false)} />}
        </Modal>
        {show && (
          <div
            onClick={() => setShow(false)}
            className="fixed w-full h-screen top-0 left-0 bg-[#F5F5F5B2] dark:bg-[#d3d3d315] z-[101] flex justify-center items-center cursor-default"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[680px] shadow-md w-full rounded-lg bg-white dark:bg-[#111111] px-[40px] py-[24px] max-h-full overflow-y-auto text-[#a6aacf] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800"
            >
              <div className="flex flex-col">
                <div className="flex justify-start border-b border-[#697A8D66] py-[8px] text-[36px]">
                  <GradientText size={24} value="Leave room" />
                </div>
                <p className="mt-4 text-primary dark:text-[white]">
                  Are you sure that you want to leave the room?
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleLeave}
                    className="bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6dd] hover:to-[#8E54E9dd] text-sm font-bold rounded-lg text-white px-[12px] py-[8px]"
                  >
                    Leave
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShow(false);
                    }}
                    className="bg-gradient-to-r from-[#4776E615] to-[#8E54E915] hover:bg-gradient-to-r hover:from-[#4776E644] hover:to-[#8E54E944] text-sm font-bold rounded-lg text-white px-[12px] py-[8px]"
                  >
                    <GradientText value="Cancel" size={14} />
                  </button>
                </div>
              </div>
              {/* <div
            className="cursor-pointer absolute top-10 right-10"
            onClick={(e) => {e.stopPropagation(); setShow(false)}}
          >
            <Cross />
          </div> */}
            </div>
          </div>
        )}
      </div>
    );
}

export default CollectionMenu;
