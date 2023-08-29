import React, { ReactElement } from 'react';
import Avatar from 'components/Avatar';
import colorMXID from 'utils/colorMXID';

interface RoomIntroProps {
  roomId: string,
  avatarSrc: string | null
  name: string,
  heading: ReactElement,
  desc: ReactElement,
  time: ReactElement | string | null,
};
const RoomIntro = ({
  roomId, avatarSrc, name, heading, desc, time,
}: RoomIntroProps) => {
  return (
    <div className='gap-2 flex'>
      <div className='min-w-[35px]'></div>
      <div className="w-full flex flex-col">
        <Avatar imageSrc={avatarSrc} text={name} bgColor={roomId ? colorMXID(roomId) : 'tranparent'} size="large" />
        <div className="mt-4">
          <p className='text-[40px] font-bold text-primary'>{heading}</p>
          <p className='text-sm text-secondary'>{desc}</p>
          {time !== null && <p className='mb-8 text-sm text-secondary'>{time}</p>}
        </div>
      </div>
    </div>
  );
}

export default RoomIntro;
