import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { JwtService, MatrixService } from 'services';
import {
  getPowerLabel,
  getUsername,
  getUsernameOfRoomMember,
} from 'utils/matrixUtil';
import { memberByAtoZ, memberByPowerLevel } from 'utils/sort';
import GradientText from './GradientText';
import dateFormat from 'dateformat';
import { diffMinutes, isInSameDay } from 'utils/common';
import { useStore } from 'hook/useStore';
import { useForceUpdate } from 'hook/useForceUpdate';
import cons from 'services/cons';
import { markAsRead } from 'action/notifications';
import TimelineScroll from './TimelineScroll';
import EventLimit from './EventLimit';
import navigation from 'services/navigation';
// import RoomIntro from 'views/chat/room-intro'
import RoomTimeline from 'services/RoomTimeline';
import { twemojify } from 'utils/twemojify';
import Avatar from './Avatar';
import colorMXID from 'utils/colorMXID';

import JoinArraowIC from 'assets/ic/outlined/join-arrow.svg';
import LeaveArraowIC from 'assets//ic/outlined/leave-arrow.svg';
import InviteArraowIC from 'assets//ic/outlined/invite-arrow.svg';
import InviteCancelArraowIC from 'assets//ic/outlined/invite-cancel-arrow.svg';
import UserIC from 'assets//ic/outlined/user.svg';
import RawIcon from './RawIcon';
import ProfileNFTCard from './ProfileNFTCard';
import { fetchNfts } from 'utils/nft';
import { Medium, Twitter } from './Icon';

const PAG_LIMIT = 30;
const MAX_MSG_DIFF_MINUTES = 5;
const PLACEHOLDER_COUNT = 2;
const PLACEHOLDERS_HEIGHT = 96 * PLACEHOLDER_COUNT;
const SCROLL_TRIGGER_POS = PLACEHOLDERS_HEIGHT * 4;

export const normalizeMembers = (members: any) => {
  const mx = MatrixService.matrixClient;
  return members.map((member: any) => ({
    userId: member.userId,
    name: getUsernameOfRoomMember(member),
    username: member.userId.slice(1, member.userId.indexOf(':')),
    avatarSrc: member.getAvatarUrl(mx?.baseUrl, 120, 120, 'crop'),
    // avatarSrc: member.user.avatarUrl,
    peopleRole: getPowerLabel(member.powerLevel),
    powerLevel: member.powerLevel,
  }));
};
export const getTimeString = (timestamp: number) => {
  const date = new Date(timestamp);
  const formattedFullTime = dateFormat(date, 'dd mmmm yyyy, hh:MM TT');
  let formattedDate = formattedFullTime;

  const compareDate = new Date();
  const isToday = isInSameDay(date, compareDate);
  compareDate.setDate(compareDate.getDate() - 1);
  const isYesterday = isInSameDay(date, compareDate);

  formattedDate = dateFormat(
    date,
    isToday || isYesterday ? 'hh:MM TT' : 'dd/mm/yyyy'
  );
  if (isYesterday) {
    formattedDate = `Yesterday, ${formattedDate}`;
  }
  return (
    <time dateTime={date.toISOString()} title={formattedFullTime}>
      {formattedDate}
    </time>
  );
};

function getTimelineJSXMessages() {
  return {
    join(user: any) {
      return (
        <>
          <b>{twemojify(user)}</b>
          {' joined the room'}
        </>
      );
    },
    leave(user: any, reason: any) {
      const reasonMsg = typeof reason === 'string' ? `: ${reason}` : '';
      return (
        <>
          <b>{twemojify(user)}</b>
          {' left the room'}
          {twemojify(reasonMsg)}
        </>
      );
    },
    invite(inviter: any, user: any) {
      return (
        <>
          <b>{twemojify(inviter)}</b>
          {' invited '}
          <b>{twemojify(user)}</b>
        </>
      );
    },
    cancelInvite(inviter: any, user: any) {
      return (
        <>
          <b>{twemojify(inviter)}</b>
          {' canceled '}
          <b>{twemojify(user)}</b>
          {"'s invite"}
        </>
      );
    },
    rejectInvite(user: any) {
      return (
        <>
          <b>{twemojify(user)}</b>
          {' rejected the invitation'}
        </>
      );
    },
    kick(actor: any, user: any, reason: any) {
      const reasonMsg = typeof reason === 'string' ? `: ${reason}` : '';
      return (
        <>
          <b>{twemojify(actor)}</b>
          {' kicked '}
          <b>{twemojify(user)}</b>
          {twemojify(reasonMsg)}
        </>
      );
    },
    ban(actor: any, user: any, reason: any) {
      const reasonMsg = typeof reason === 'string' ? `: ${reason}` : '';
      return (
        <>
          <b>{twemojify(actor)}</b>
          {' banned '}
          <b>{twemojify(user)}</b>
          {twemojify(reasonMsg)}
        </>
      );
    },
    unban(actor: any, user: any) {
      return (
        <>
          <b>{twemojify(actor)}</b>
          {' unbanned '}
          <b>{twemojify(user)}</b>
        </>
      );
    },
    avatarSets(user: any) {
      return (
        <>
          <b>{twemojify(user)}</b>
          {' set a avatar'}
        </>
      );
    },
    avatarChanged(user: any) {
      return (
        <>
          <b>{twemojify(user)}</b>
          {' changed their avatar'}
        </>
      );
    },
    avatarRemoved(user: any) {
      return (
        <>
          <b>{twemojify(user)}</b>
          {' removed their avatar'}
        </>
      );
    },
    nameSets(user: any, newName: any) {
      return (
        <>
          <b>{twemojify(user)}</b>
          {' set display name to '}
          <b>{twemojify(newName)}</b>
        </>
      );
    },
    nameChanged(user: any, newName: any) {
      return (
        <>
          <b>{twemojify(user)}</b>
          {' changed their display name to '}
          <b>{twemojify(newName)}</b>
        </>
      );
    },
    nameRemoved(user: any, lastName: any) {
      return (
        <>
          <b>{twemojify(user)}</b>
          {' removed their display name '}
          <b>{twemojify(lastName)}</b>
        </>
      );
    },
  };
}

function parseTimelineChange(mEvent: any) {
  const tJSXMsgs = getTimelineJSXMessages();
  const makeReturnObj = (variant: any, content: any) => ({
    variant,
    content,
  });
  const content = mEvent.getContent();
  const prevContent = mEvent.getPrevContent();
  const sender = mEvent.getSender();
  const senderName = getUsername(sender);
  const userName = getUsername(mEvent.getStateKey());

  switch (content.membership) {
    case 'invite':
      return makeReturnObj('invite', tJSXMsgs.invite(senderName, userName));
    case 'ban':
      return makeReturnObj(
        'leave',
        tJSXMsgs.ban(senderName, userName, content.reason)
      );
    case 'join':
      if (prevContent.membership === 'join') {
        if (content.displayname !== prevContent.displayname) {
          if (typeof content.displayname === 'undefined')
            return makeReturnObj(
              'avatar',
              tJSXMsgs.nameRemoved(sender, prevContent.displayname)
            );
          if (typeof prevContent.displayname === 'undefined')
            return makeReturnObj(
              'avatar',
              tJSXMsgs.nameSets(sender, content.displayname)
            );
          return makeReturnObj(
            'avatar',
            tJSXMsgs.nameChanged(prevContent.displayname, content.displayname)
          );
        }
        if (content.avatar_url !== prevContent.avatar_url) {
          if (typeof content.avatar_url === 'undefined')
            return makeReturnObj(
              'avatar',
              tJSXMsgs.avatarRemoved(content.displayname)
            );
          if (typeof prevContent.avatar_url === 'undefined')
            return makeReturnObj(
              'avatar',
              tJSXMsgs.avatarSets(content.displayname)
            );
          return makeReturnObj(
            'avatar',
            tJSXMsgs.avatarChanged(content.displayname)
          );
        }
        return null;
      }
      return makeReturnObj('join', tJSXMsgs.join(senderName));
    case 'leave':
      if (sender === mEvent.getStateKey()) {
        switch (prevContent.membership) {
          case 'invite':
            return makeReturnObj(
              'invite-cancel',
              tJSXMsgs.rejectInvite(senderName)
            );
          default:
            return makeReturnObj(
              'leave',
              tJSXMsgs.leave(senderName, content.reason)
            );
        }
      }
      switch (prevContent.membership) {
        case 'invite':
          return makeReturnObj(
            'invite-cancel',
            tJSXMsgs.cancelInvite(senderName, userName)
          );
        case 'ban':
          return makeReturnObj('other', tJSXMsgs.unban(senderName, userName));
        // sender is not target and made the target leave,
        // if not from invite/ban then this is a kick
        default:
          return makeReturnObj(
            'leave',
            tJSXMsgs.kick(senderName, userName, content.reason)
          );
      }
    default:
      return null;
  }
}
function PlaceholderMessage() {
  return (
    <div className="flex items-start w-4/5 gap-2 animate-pulse">
      <div className="bg-slate-500 w-[35px] rounded-full aspect-square" />
      <div className="flex flex-col flex-grow gap-2">
        <div className="bg-slate-500 rounded-md h-[20px] w-1/2" />
        <div className="flex w-full gap-2">
          <div className="bg-slate-500 rounded-md h-[20px] flex-grow" />
          <div className="bg-slate-500 rounded-md h-[20px] w-4/5" />
          <div className="bg-slate-500 rounded-md h-[20px] flex-grow" />
        </div>
        <div className="bg-slate-500 rounded-md h-[20px] w-1/3" />
      </div>
    </div>
  );
}

const RenderEvent = ({
  roomTimeline,
  mEvent,
  prevMEvent,
  isFocus,
  isEdit,
  setEdit,
  cancelEdit,
}: any) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [showNft, setShowNft] = useState(false);
  const [pos, setPos] = useState({
    X: 0,
    Y: 0,
  });
  const ref = useRef<HTMLDivElement>(null);
  // useEffect(() => {

  //   if (open && mEvent) {
  //     console.log(pos)
  //   }
  // }, [open, mEvent]);
  const getNfts = async (address: any) => {
    const data = await fetchNfts(
      address,
      // !address
      //   ? address
      //   : '0x51B780377c33B285f15afE39C532F292252bEA44',
      6
    );
    console.log(data);
    return data ?? [];
    // setNfts(data ?? []);
  };
  const renderNfts = (nfts: any) => {
    if (nfts === undefined) return null;
    const count = nfts.length;
    return nfts.map((nft: any, index: number) => {
      const videoUrl = nft.cached_animation_url
        ? nft.cached_animation_url
        : nft.animation_url;
      const imageUrl = nft.cached_file_url ? nft.cached_file_url : nft.file_url;
      if (index > 8) return null;
      if (count > 9 && index === 8)
        return (
          <div
            key={index}
            className="cursor-pointer transition duration-300 ease-in-out hover:scale-105 aspect-square bg-[#F3F3F5] dark:bg-[#1f1F22] rounded-[10px] flex justify-center items-center"
          >
            <GradientText value={'See More'} size={13} />
          </div>
        );
      return (
        <ProfileNFTCard key={index} imageUrl={imageUrl} videoUrl={videoUrl} />
      );
    });
  };
  const isBodyOnly =
    prevMEvent !== null &&
    prevMEvent?.getSender() === mEvent?.getSender() &&
    prevMEvent?.getType() !== 'm.room.member' &&
    prevMEvent?.getType() !== 'm.room.create' &&
    diffMinutes(mEvent?.getDate(), prevMEvent?.getDate()) <=
      MAX_MSG_DIFF_MINUTES;
  const timestamp = mEvent?.getTs();
  const renderSocialMedia = () => {
    return (
      <div className="flex gap-2 items-center">
        <Twitter />
        <Medium />
      </div>
    );
  };
  if (mEvent.getType() === 'm.room.member') {
    const timelineChange = parseTimelineChange(mEvent);
    if (timelineChange === null) return <div key={mEvent.getId()} />;
    let iconSrc;
    switch (timelineChange.variant) {
      case 'join':
        iconSrc = JoinArraowIC;
        break;
      case 'leave':
        iconSrc = LeaveArraowIC;
        break;
      case 'invite':
        iconSrc = InviteArraowIC;
        break;
      case 'invite-cancel':
        iconSrc = InviteCancelArraowIC;
        break;
      case 'avatar':
        iconSrc = UserIC;
        break;
      default:
        iconSrc = JoinArraowIC;
        break;
    }
    return (
      // <TimelineChange
      //   key={mEvent.getId()}
      //   variant={timelineChange.variant}
      //   content={timelineChange.content}
      //   timestamp={timestamp}
      // />
      <div key={mEvent.getId()} className="flex gap-2">
        <div className="h-[35px] w-[35px] flex items-center justify-center">
          <RawIcon src={iconSrc} size={35} />
        </div>
        <p className="text-secondary">
          {timelineChange.variant}, {timelineChange.content},{' '}
          {getTimeString(timestamp)}
        </p>
      </div>
    );
  }

  const room = roomTimeline?.room;
  const memberOfMembership = normalizeMembers(
    room?.getMembersWithMembership('join')
  )
    .sort(memberByAtoZ)
    .sort(memberByPowerLevel);

  const user = memberOfMembership.find(
    (member: any) => member.userId === (mEvent.event.sender as string)
  );
  // const date = dateFormat(mEvent.localTimestamp, 'dd/mm/yyyy, hh:MM TT')
  const date = getTimeString(mEvent.localTimestamp);
  const content = mEvent.event.content;
  // console.log(content)
  const mx = MatrixService.matrixClient;
  const showProfile = async () => {
    setLoading(true);
    try {
      const userName = mEvent.sender.name;
      const userData: any = await JwtService.getUserInfo(userName);
      setShowNft(userData.showNft);
      const data = await getNfts(userName);
      setNfts(data);
      const rect = ref.current?.getBoundingClientRect();
      const height = window.innerHeight;
      let dialogHeight = 190;
      if (data.length > 0 && userData.showNft) {
        dialogHeight = 450;
      }
      // console.log((rect?.top ?? 0) + dialogHeight, height)
      const overflow = (rect?.top ?? 0) + dialogHeight > height;
      setPos({
        X: (rect?.left ?? 0) + (rect?.width ?? 0),
        Y: !overflow ? rect?.top ?? 0 : 0,
      });
      setLoading(false);
      setOpen(true);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };
  // console.log('lalalal', user)
  return (
    // <Message
    //   key={mEvent.getId()}
    //   mEvent={mEvent}
    //   isBodyOnly={isBodyOnly}
    //   roomTimeline={roomTimeline}
    //   focus={isFocus}
    //   fullTime={false}
    //   isEdit={isEdit}
    //   setEdit={setEdit}
    //   cancelEdit={cancelEdit}
    // />
    <div className="flex flex-col w-full" key={mEvent.getId()}>
      <div className="flex items-start w-full gap-2">
        {!isBodyOnly ? (
          <button onClick={showProfile}>
            <Avatar
              text={user?.username as string}
              bgColor={colorMXID(user?.userId)}
              imageSrc={user?.avatarSrc}
              // iconColor="var(--ic-surface-low)"
              // iconSrc={iconSrc}
              size="extra-small"
            />
          </button>
        ) : (
          <div className="min-w-[35px]" />
        )}
        <div className="flex flex-col items-start flex-grow">
          {!isBodyOnly && (
            <div className="min-h-[35px] flex items-center gap-2 text-primary dark:text-white font-semibold">
              {open && (
                <div
                  onClick={() => setOpen(false)}
                  className="fixed w-full h-full left-0 top-0 z-[10]"
                ></div>
              )}
              <div
                ref={ref}
                onClick={showProfile}
                className="flex relative cursor-pointer"
              >
                <GradientText value={user?.username as string} size={15} />
                {loading && (
                  <div className="shadow-lg rounded-lg bg-[#f5f5f5] dark:bg-[#1F1F22] p-2 z-[20] border border-[#d5d5d5] dark:border-primary absolute -right-11">
                    <div className="flex justify-center w-4 h-4">
                      <svg
                        className="inline min-w-8 min-h-8 text-gray-200 animate-spin fill-primary dark:fill-secondary"
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
                  </div>
                )}
                {open && (
                  <div
                    className="fixed max-w-[355px] flex flex-col shadow-lg rounded-lg bg-[#f5f5f5] dark:bg-[#1F1F22] p-6 z-[20] border border-[#d5d5d5] dark:border-primary cursor-auto"
                    style={
                      pos.Y === 0
                        ? { left: pos.X + 10, bottom: 10 }
                        : { left: pos.X + 10, top: pos.Y }
                    }
                  >
                    <div className="flex items-end gap-4">
                      <Avatar
                        text={user?.username as string}
                        bgColor={colorMXID(user?.userId)}
                        imageSrc={user?.avatarSrc}
                        // iconColor="var(--ic-surface-low)"
                        // iconSrc={iconSrc}
                        size="medium"
                      />
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[20px]">
                          <GradientText
                            value={user?.username as string}
                            size={20}
                          />
                          -
                          <span className="text-xs font-bold">
                            {user?.peopleRole}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-xs whitespace-nowrap bg-gradient-to-r text-white px-2 py-1  min-w-[100px] rounded-md font-semibold from-[#4776E6] to-[#6825d4]">
                            Add Friend
                          </button>
                          <button className="px-2 py-1 rounded-md border border-[#594bdd] min-w-[100px]">
                            <GradientText value="Block" size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                    {nfts.length > 0 && showNft && (
                      <div className="flex flex-col w-full items-start">
                        <div className="w-full h-[1px] bg-secondary mt-4 mb-2"></div>
                        <p className="text-sm font-semibold my-1">NFTs</p>
                        <div className="grid grid-cols-3 gap-[4px]">
                          {renderNfts(nfts)}
                        </div>
                      </div>
                    )}
                    <div className="w-full h-[1px] bg-secondary mt-4 mb-2"></div>
                    <div className="flex w-full items-center my-1">
                      <p className="text-sm font-semibold flex-grow">
                        Social Networks
                      </p>
                      <div className="flex items-center">
                        {renderSocialMedia()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[15px]">-</span>
              <span className="text-[11px]">{user?.peopleRole}</span>
              <i className="text-[11px]">{date}</i>
            </div>
          )}
          {content?.msgtype === 'm.text' ? (
            <pre className="w-full text-sm font-semibold whitespace-pre-line text-secondary dark:text-white">
              {content?.body}
            </pre>
          ) : (
            <div className='w-full flex justify-start'>
              <img className='max-w-[320px] max-h-[320px]' src={mx?.mxcUrlToHttp(content?.url) as string} alt="" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
function loadingMsgPlaceholders(key: any, count = 2) {
  const pl: any = [];
  const genPlaceholders = () => {
    for (let i = 0; i < count; i += 1) {
      pl.push(<PlaceholderMessage key={`placeholder-${i}${key}`} />);
    }
    return pl;
  };

  return (
    <React.Fragment key={`placeholder-container${key}`}>
      {genPlaceholders()}
    </React.Fragment>
  );
}
// function RoomIntroContainer({ event, timeline }: any) {
//   const [, nameForceUpdate] = useForceUpdate();
//   const mx = MatrixService.matrixClient;
//   const { roomList } = MatrixService;
//   const { room } = timeline;
//   const roomTopic = room.currentState.getStateEvents('m.room.topic')[0]?.getContent().topic;
//   const isDM = roomList?.directs.has(timeline.roomId);
//   let avatarSrc = room.getAvatarUrl(mx?.baseUrl, 80, 80, 'crop');
//   avatarSrc = isDM ? room.getAvatarFallbackMember()?.getAvatarUrl(mx?.baseUrl, 80, 80, 'crop') : avatarSrc;

//   const heading = isDM ? room.name : `Welcome to ${room.name}`;
//   const topic = twemojify(roomTopic || '', undefined, true);
//   // const nameJsx = twemojify(room.name);
//   const nameJsx = room.name
//   const desc = isDM
//     ? (
//       <>
//         This is the beginning of your direct message history with @
//         <b>{nameJsx}</b>
//         {'. '}
//         {topic}
//       </>
//     )
//     : (
//       <>
//         {'This is the beginning of the '}
//         <b>{nameJsx}</b>
//         {' room. '}
//         {topic}
//       </>
//     );

//   useEffect(() => {
//     const handleUpdate = () => {
//       if (typeof nameForceUpdate === 'function') nameForceUpdate();
//     }

//     roomList?.on(cons.events.roomList.ROOM_PROFILE_UPDATED, handleUpdate);
//     return () => {
//       roomList?.removeListener(cons.events.roomList.ROOM_PROFILE_UPDATED, handleUpdate);
//     };
//   }, []);

//   return (
//     <RoomIntro
//       roomId={timeline.roomId}
//       avatarSrc={avatarSrc}
//       name={room.name}
//       heading={heading}
//       desc={desc}
//       time={event ? `Created at ${dateFormat(event.getDate(), 'dd mmmm yyyy, hh:MM TT')}` : null}
//     />
//   );
// }
function useTimeline(
  roomTimeline: any,
  eventId: any,
  readUptoEvtStore: any,
  eventLimitRef: any
) {
  const [timelineInfo, setTimelineInfo] = useState<any>(null);

  const setEventTimeline = async (eId: any) => {
    if (typeof eId === 'string') {
      const isLoaded = await roomTimeline.loadEventTimeline(eId);
      if (isLoaded) return;
      // if eventTimeline failed to load,
      // we will load live timeline as fallback.
    }
    roomTimeline.loadLiveTimeline();
  };

  useEffect(() => {
    const limit = eventLimitRef.current;
    const initTimeline = (eId: any) => {
      // NOTICE: eId can be id of readUpto, reply or specific event.
      // readUpTo: when user click jump to unread message button.
      // reply: when user click reply from timeline.
      // specific event when user open a link of event. behave same as ^^^^
      const readUpToId = roomTimeline.getReadUpToEventId();
      let focusEventIndex = -1;
      const isSpecificEvent = eId && eId !== readUpToId;

      if (isSpecificEvent) {
        focusEventIndex = roomTimeline.getEventIndex(eId);
      }
      if (
        !readUptoEvtStore.getItem() &&
        roomTimeline.hasEventInTimeline(readUpToId)
      ) {
        // either opening live timeline or jump to unread.
        readUptoEvtStore.setItem(
          roomTimeline.findEventByIdInTimelineSet(readUpToId)
        );
      }
      if (readUptoEvtStore.getItem() && !isSpecificEvent) {
        focusEventIndex = roomTimeline.getUnreadEventIndex(
          readUptoEvtStore.getItem().getId()
        );
      }

      if (focusEventIndex > -1) {
        limit?.setFrom(focusEventIndex - Math.round(limit?.maxEvents / 2));
      } else {
        limit?.setFrom(roomTimeline.timeline.length - limit?.maxEvents);
      }
      setTimelineInfo({ focusEventId: isSpecificEvent ? eId : null });
    };

    roomTimeline.on(cons.events.roomTimeline.READY, initTimeline);
    setEventTimeline(eventId);
    return () => {
      roomTimeline.removeListener(cons.events.roomTimeline.READY, initTimeline);
      limit?.setFrom(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomTimeline, eventId]);

  return timelineInfo;
}

function usePaginate(
  roomTimeline: any,
  readUptoEvtStore: any,
  forceUpdateLimit: any,
  timelineScrollRef: any,
  eventLimitRef: any
) {
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    const handlePaginatedFromServer = (backwards: any, loaded: any) => {
      const limit = eventLimitRef.current;
      if (loaded === 0) return;
      if (!readUptoEvtStore.getItem()) {
        const readUpToId = roomTimeline.getReadUpToEventId();
        readUptoEvtStore.setItem(
          roomTimeline.findEventByIdInTimelineSet(readUpToId)
        );
      }
      limit?.paginate(backwards, PAG_LIMIT, roomTimeline.timeline.length);
      setTimeout(() =>
        setInfo({
          backwards,
          loaded,
        })
      );
    };
    roomTimeline.on(
      cons.events.roomTimeline.PAGINATED,
      handlePaginatedFromServer
    );
    return () => {
      roomTimeline.removeListener(
        cons.events.roomTimeline.PAGINATED,
        handlePaginatedFromServer
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomTimeline]);

  const autoPaginate = useCallback(async () => {
    const timelineScroll = timelineScrollRef.current;
    const limit = eventLimitRef.current;
    if (roomTimeline.isOngoingPagination) return;
    const tLength = roomTimeline.timeline.length;

    if (timelineScroll?.bottom < SCROLL_TRIGGER_POS) {
      if (limit?.length < tLength) {
        // paginate from memory
        limit?.paginate(false, PAG_LIMIT, tLength);
        forceUpdateLimit();
      } else if (roomTimeline.canPaginateForward()) {
        // paginate from server.
        await roomTimeline.paginateTimeline(false, PAG_LIMIT);
        return;
      }
    }
    if (timelineScroll?.top < SCROLL_TRIGGER_POS) {
      if (limit?.from > 0) {
        // paginate from memory
        limit?.paginate(true, PAG_LIMIT, tLength);
        forceUpdateLimit();
      } else if (roomTimeline.canPaginateBackward()) {
        // paginate from server.
        await roomTimeline.paginateTimeline(true, PAG_LIMIT);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomTimeline]);

  return [info, autoPaginate];
}

function useHandleScroll(
  roomTimeline: any,
  autoPaginate: any,
  readUptoEvtStore: any,
  forceUpdateLimit: any,
  timelineScrollRef: any,
  eventLimitRef: any
) {
  const handleScroll = useCallback(() => {
    const timelineScroll = timelineScrollRef.current;
    const limit = eventLimitRef.current;
    requestAnimationFrame(() => {
      // emit event to toggle scrollToBottom button visibility
      const isAtBottom =
        timelineScroll.bottom < 16 &&
        !roomTimeline.canPaginateForward() &&
        limit?.length >= roomTimeline.timeline.length;
      roomTimeline.emit(cons.events.roomTimeline.AT_BOTTOM, isAtBottom);
      if (isAtBottom && readUptoEvtStore.getItem()) {
        requestAnimationFrame(() => markAsRead(roomTimeline.roomId));
      }
    });
    autoPaginate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomTimeline]);

  const handleScrollToLive = useCallback(() => {
    const timelineScroll = timelineScrollRef.current;
    const limit = eventLimitRef.current;
    if (readUptoEvtStore.getItem()) {
      requestAnimationFrame(() => markAsRead(roomTimeline.roomId));
    }
    if (roomTimeline.isServingLiveTimeline()) {
      limit?.setFrom(roomTimeline.timeline.length - limit?.maxEvents);
      timelineScroll.scrollToBottom();
      forceUpdateLimit();
      return;
    }
    roomTimeline.loadLiveTimeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomTimeline]);

  return [handleScroll, handleScrollToLive];
}

function useEventArrive(
  roomTimeline: any,
  readUptoEvtStore: any,
  timelineScrollRef: any,
  eventLimitRef: any
) {
  const myUserId = MatrixService.matrixClient?.getUserId();
  const [newEvent, setEvent] = useState(null);

  useEffect(() => {
    const timelineScroll = timelineScrollRef.current;
    const limit = eventLimitRef.current;
    const trySendReadReceipt = (event: any) => {
      if (myUserId === event.getSender()) {
        requestAnimationFrame(() => markAsRead(roomTimeline.roomId));
        return;
      }
      const readUpToEvent = readUptoEvtStore.getItem();
      const readUpToId = roomTimeline.getReadUpToEventId();
      const isUnread = readUpToEvent
        ? readUpToEvent?.getId() === readUpToId
        : true;

      if (isUnread === false) {
        if (
          document.visibilityState === 'visible' &&
          timelineScroll.bottom < 16
        ) {
          requestAnimationFrame(() => markAsRead(roomTimeline.roomId));
        } else {
          readUptoEvtStore.setItem(
            roomTimeline.findEventByIdInTimelineSet(readUpToId)
          );
        }
        return;
      }

      const { timeline } = roomTimeline;
      const unreadMsgIsLast =
        timeline[timeline.length - 2].getId() === readUpToId;
      if (unreadMsgIsLast) {
        requestAnimationFrame(() => markAsRead(roomTimeline.roomId));
      }
    };

    const handleEvent = (event: any) => {
      const tLength = roomTimeline.timeline.length;
      const isViewingLive =
        roomTimeline.isServingLiveTimeline() && limit?.length >= tLength - 1;
      const isAttached = timelineScroll.bottom < SCROLL_TRIGGER_POS;

      if (isViewingLive && isAttached) {
        limit?.setFrom(tLength - limit?.maxEvents);
        trySendReadReceipt(event);
        setEvent(event);
        return;
      }
      const isRelates =
        event.getType() === 'm.reaction' ||
        event.getRelation()?.rel_type === 'm.replace';
      if (isRelates) {
        setEvent(event);
        return;
      }

      if (isViewingLive) {
        // This stateUpdate will help to put the
        // loading msg placeholder at bottom
        setEvent(event);
      }
    };

    const handleEventRedact = (event: any) => setEvent(event);

    roomTimeline.on(cons.events.roomTimeline.EVENT, handleEvent);
    roomTimeline.on(cons.events.roomTimeline.EVENT_REDACTED, handleEventRedact);
    return () => {
      roomTimeline.removeListener(cons.events.roomTimeline.EVENT, handleEvent);
      roomTimeline.removeListener(
        cons.events.roomTimeline.EVENT_REDACTED,
        handleEventRedact
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomTimeline]);

  return newEvent;
}

let jumpToItemIndex = -1;

const GeneralMessage = ({ data, roomTimeline, eventId }: any) => {
  // const [throttle] = useState(new Throttle());
  // const [events, setEvents] = useState<any>([])
  // const { roomId } = roomTimeline
  const timelineSVRef = useRef<any>(null);
  const timelineScrollRef = useRef<any>(null);
  const eventLimitRef = useRef<any>(null);
  const [editEventId, setEditEventId] = useState(null);
  const cancelEdit = () => setEditEventId(null);
  const readUptoEvtStore = useStore(roomTimeline);
  const [onLimitUpdate, forceUpdateLimit] = useForceUpdate();

  const timelineInfo = useTimeline(
    roomTimeline,
    eventId,
    readUptoEvtStore,
    eventLimitRef
  );
  const [paginateInfo, autoPaginate] = usePaginate(
    roomTimeline,
    readUptoEvtStore,
    forceUpdateLimit,
    timelineScrollRef,
    eventLimitRef
  );
  // const [handleScroll, handleScrollToLive] = useHandleScroll(roomTimeline, autoPaginate, readUptoEvtStore, forceUpdateLimit, timelineScrollRef, eventLimitRef)
  const [, handleScrollToLive] = useHandleScroll(
    roomTimeline,
    autoPaginate,
    readUptoEvtStore,
    forceUpdateLimit,
    timelineScrollRef,
    eventLimitRef
  );
  const newEvent = useEventArrive(
    roomTimeline,
    readUptoEvtStore,
    timelineScrollRef,
    eventLimitRef
  );

  const { timeline } = roomTimeline;

  useLayoutEffect(() => {
    if (!roomTimeline.initialized) {
      timelineScrollRef.current = new TimelineScroll(timelineSVRef.current);
      eventLimitRef.current = new EventLimit();
    }
  });

  // when active timeline changes
  useEffect(() => {
    if (!roomTimeline.initialized) return undefined;
    const timelineScroll = timelineScrollRef.current;
    if (timeline.length > 0) {
      if (jumpToItemIndex === -1) {
        timelineScroll?.scrollToBottom();
      } else {
        timelineScroll?.scrollToIndex(jumpToItemIndex, 80);
      }
      if (timelineScroll?.bottom < 16 && !roomTimeline.canPaginateForward()) {
        const readUpToId = roomTimeline.getReadUpToEventId();
        if (
          readUptoEvtStore.getItem()?.getId() === readUpToId ||
          readUpToId === null
        ) {
          requestAnimationFrame(() => markAsRead(roomTimeline.roomId));
        }
      }
      jumpToItemIndex = -1;
    }
    autoPaginate();

    roomTimeline.on(
      cons.events.roomTimeline.SCROLL_TO_LIVE,
      handleScrollToLive
    );
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (timelineSVRef.current === null) return;
      roomTimeline.removeListener(
        cons.events.roomTimeline.SCROLL_TO_LIVE,
        handleScrollToLive
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timelineInfo]);

  // when paginating from server
  useEffect(() => {
    if (!roomTimeline.initialized) return;
    const timelineScroll = timelineScrollRef.current;
    timelineScroll?.tryRestoringScroll();
    autoPaginate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginateInfo]);

  // when paginating locally
  useEffect(() => {
    if (!roomTimeline.initialized) return;
    const timelineScroll = timelineScrollRef.current;
    timelineScroll?.tryRestoringScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLimitUpdate]);

  useEffect(() => {
    const timelineScroll = timelineScrollRef.current;
    if (!roomTimeline.initialized) return;
    if (
      timelineScroll?.bottom < 16 &&
      !roomTimeline.canPaginateForward() &&
      document.visibilityState === 'visible'
    ) {
      timelineScroll?.scrollToBottom();
    } else {
      timelineScroll?.tryRestoringScroll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newEvent]);

  const listenKeyboard = useCallback(
    (event) => {
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      if (event.key !== 'ArrowUp') return;
      if (navigation.isRawModalVisible) return;

      if (document.activeElement?.id !== 'textarea') return;
      if ((document.activeElement as HTMLInputElement)?.value !== '') return;

      const {
        timeline: tl,
        activeTimeline,
        liveTimeline,
        matrixClient: mx,
      } = roomTimeline;
      const limit = eventLimitRef.current;
      if (activeTimeline !== liveTimeline) return;
      if (tl.length > limit?.length) return;

      const mTypes = ['m.text'];
      for (let i = tl.length - 1; i >= 0; i -= 1) {
        const mE = tl[i];
        if (
          mE.getSender() === mx.getUserId() &&
          mE.getType() === 'm.room.message' &&
          mTypes.includes(mE.getContent()?.msgtype)
        ) {
          setEditEventId(mE.getId());
          return;
        }
      }
    },
    [roomTimeline]
  );

  useEffect(() => {
    document.body.addEventListener('keydown', listenKeyboard);
    return () => {
      document.body.removeEventListener('keydown', listenKeyboard);
    };
  }, [listenKeyboard]);

  // const handleTimelineScroll = (event: any) => {
  //   const timelineScroll = timelineScrollRef.current;
  //   if (!event.target) return;

  //   throttle._(() => {
  //     const backwards = timelineScroll?.calcScroll();
  //     if (typeof backwards !== 'boolean') return;
  //     // handleScroll(backwards);
  //     handleScroll()
  //   }, 200)();
  // };

  const renderTimeline = () => {
    const tl = [];
    const limit = eventLimitRef.current;
    let itemCountIndex = 0;
    jumpToItemIndex = -1;
    const readUptoEvent = readUptoEvtStore.getItem();
    let unreadDivider = false;
    if (
      (roomTimeline as RoomTimeline).canPaginateBackward() ||
      limit?.from > 0
    ) {
      tl.push(loadingMsgPlaceholders(1, PLACEHOLDER_COUNT));
      itemCountIndex += PLACEHOLDER_COUNT;
    }
    for (let i = limit?.from; i < limit?.length; i++) {
      if (i >= timeline.length) break;
      const mEvent = timeline[i];
      const prevMEvent = timeline[i - 1] ?? null;
      if (i === 0 && !(roomTimeline as RoomTimeline).canPaginateBackward()) {
        if (mEvent.getType() === 'm.room.create') {
          // tl.push(
          //   // <RoomIntroContainer key={mEvent.getId()} event={mEvent} timeline={roomTimeline} />
          //   <></>
          // )
          // itemCountIndex += 1;
          continue;
        } else {
          // tl.push(
          // // <RoomIntroContainer key='room-intro' event={null} timeline={roomTimeline} />
          // <></>
          // )
          // itemCountIndex += 1;
        }
      }

      if (mEvent.getType() === 'm.room.member') continue;
      let isNewEvent = false;
      if (!unreadDivider) {
        unreadDivider =
          readUptoEvent &&
          prevMEvent?.getTs() <= readUptoEvent?.getTs() &&
          readUptoEvent?.getTs() < mEvent?.getTs();
        if (unreadDivider) {
          isNewEvent = true;
          tl.push(
            <div
              key={`new-${mEvent.getId()}`}
              className="flex flex-col items-center bg-red-500 h-[1px] my-[18px]"
            >
              <p className="-mt-[15px] bg-red-500 dark:text-[#111111] text-white rounded-lg p-1 min-w-[150px] text-center text-sm flex items-center justify-center font-bold">
                New messages
              </p>
            </div>
          );
          itemCountIndex += 1;
          if (jumpToItemIndex === -1) jumpToItemIndex = itemCountIndex;
        }
      }

      const dayDivider =
        prevMEvent && !isInSameDay(mEvent.getDate(), prevMEvent.getDate());
      if (dayDivider) {
        tl.push(
          <div
            key={`divider-${mEvent.getId()}`}
            className="flex flex-col items-center bg-primary h-[1px] my-[18px]"
          >
            <p className="-mt-[18px] bg-white dark:bg-[#111111] text-primary border rounded-lg p-1 min-w-[180px] text-center text-sm flex items-center justify-center border-primary font-bold">
              {dateFormat(mEvent.getDate(), 'mmmm dd, yyyy')}
            </p>
          </div>
        );
        itemCountIndex += 1;
      }

      const focusId = timelineInfo.focusEventId;
      const isFocus = focusId === mEvent.getId();
      if (isFocus) jumpToItemIndex = itemCountIndex;
      tl.push(
        <RenderEvent
          key={mEvent.getId()}
          roomTimeline={roomTimeline}
          mEvent={mEvent}
          prevMEvent={isNewEvent ? null : prevMEvent}
          isFocus={isFocus}
          isEdit={editEventId === mEvent.getId()}
          setEdit={setEditEventId}
          cancelEdit={cancelEdit}
        />
      );
      itemCountIndex += 1;
    }
    if (roomTimeline.canPaginateForward() || limit?.length < timeline.length) {
      tl.push(loadingMsgPlaceholders(2, PLACEHOLDER_COUNT));
    }

    return tl;
  };
  return (
    <div
      className="flex flex-col-reverse flex-grow px-[48px] gap-[16px] w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800"
      ref={timelineSVRef}
    >
      <div className="flex flex-col flex-grow gap-[16px] w-full mt-4">
        {/* {timeline !== undefined && roomId !== undefined && getEvents(timeline, roomId)} */}
        {roomTimeline.initialized
          ? renderTimeline()
          : loadingMsgPlaceholders('loading', 3)}
      </div>
    </div>
  );
};

export default GeneralMessage;
