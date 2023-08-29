/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';

import VerticalMenuIC from 'assets/ic/outlined/out.png';

import RoomSelector from './RoomSelector';
import { MatrixService } from 'services';
import cons from 'services/cons';
import { useForceUpdate } from 'hook/useForceUpdate';
import RoomOptions from './RoomOptions';
import IconButton from './IconButton';
import { openReusableContextMenu } from 'action/navigation';
import { abbreviateNumber, getEventCords } from 'utils/common';
import navigation from 'services/navigation';
import { joinRuleToIconSrc } from 'utils/matrixUtil';
import GradientText from './GradientText';
import * as roomActions from 'action/room'

function Selector({
  roomId, isDM, drawerPostie, onClick,
}) {
  const mx = MatrixService.matrixClient;
  const noti = MatrixService.notifications;
  const room = mx?.getRoom(roomId);

  let imageSrc = room?.getAvatarFallbackMember()?.getAvatarUrl(mx?.baseUrl, 24, 24, 'crop') || null;
  const userId = room?.getAvatarFallbackMember()?.userId
  if (imageSrc === null) imageSrc = room?.getAvatarUrl(mx?.baseUrl, 24, 24, 'crop') || null;

  const isMuted = noti.getNotiType(roomId) === cons.notifs.MUTE;

  const [, forceUpdate] = useForceUpdate();
  const [show, setShow] = useState(false)
  useEffect(() => {
    const unSub1 = drawerPostie.subscribe('selector-change', roomId, forceUpdate);
    const unSub2 = drawerPostie.subscribe('unread-change', roomId, forceUpdate);
    return () => {
      unSub1();
      unSub2();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openOptions = (e) => {
    e.preventDefault();
    openReusableContextMenu(
      'right',
      getEventCords(e, '.room-selector'),
      // room.isSpaceRoom()
      // ? (closeMenu) => <SpaceOptions roomId={roomId} afterOptionSelect={closeMenu} />
      (closeMenu) => <RoomOptions roomId={roomId} afterOptionSelect={closeMenu} />,
    );
  };
  const handleLeave = (e) => {
    e.stopPropagation()
    setShow(false)
    roomActions.leave(roomId)
  }
  return (
    <>
      <RoomSelector
        key={roomId}
        name={room.name}
        roomId={userId}
        imageSrc={isDM ? imageSrc : null}
        iconSrc={isDM ? null : joinRuleToIconSrc(room.getJoinRule(), room.isSpaceRoom())}
        isSelected={navigation.selectedRoomId === roomId}
        isMuted={isMuted}
        isUnread={!isMuted && noti.hasNoti(roomId)}
        notificationCount={abbreviateNumber(noti.getTotalNoti(roomId))}
        isAlert={noti.getHighlightNoti(roomId) !== 0}
        onClick={onClick}
        onContextMenu={openOptions}
        options={(
          <IconButton
            size="extra-small"
            tooltip="Leave room"
            tooltipPlacement="bottom"
            src={VerticalMenuIC}
            onClick={() => setShow(true)}
          />
        )}
      />
      {show && <div onClick={() => setShow(false)} className='fixed w-full h-screen top-0 left-0 bg-[#F5F5F5B2] dark:bg-[#d3d3d315] z-[101] flex justify-center items-center cursor-default'>
        <div onClick={(e) => e.stopPropagation()} className="relative max-w-[680px] shadow-md w-full rounded-lg bg-white dark:bg-[#111111] px-[40px] py-[24px] max-h-full overflow-y-auto text-[#a6aacf] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800">
          <div className='flex flex-col'>
            <div className="flex justify-start border-b border-[#697A8D66] py-[8px] text-[36px]">
              <GradientText size={24} value="Leave room" />
            </div>
            <p className='mt-4 text-primary dark:text-[white]'>Are you sure that you want to leave the room?</p>
            <div className='flex gap-4 mt-4'>
              <button onClick={handleLeave} className="bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6dd] hover:to-[#8E54E9dd] text-sm font-bold rounded-lg text-white px-[12px] py-[8px]">Leave</button>
              <button onClick={(e) => { e.stopPropagation(); setShow(false) }} className="bg-gradient-to-r from-[#4776E615] to-[#8E54E915] hover:bg-gradient-to-r hover:from-[#4776E644] hover:to-[#8E54E944] text-sm font-bold rounded-lg text-white px-[12px] py-[8px]"><GradientText value="Cancel" size={14} /></button>
            </div>
          </div>
          {/* <div
            className="cursor-pointer absolute top-10 right-10"
            onClick={(e) => {e.stopPropagation(); setShow(false)}}
          >
            <Cross />
          </div> */}
        </div>
      </div>}
    </>

  );
}

export default Selector;
