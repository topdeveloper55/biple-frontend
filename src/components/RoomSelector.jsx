import React, {useEffect} from 'react'
import { MatrixService } from 'services'
import colorMXID from 'utils/colorMXID'

// import { twemojify } from 'util/twemojify';
// import colorMXID from 'util/colorMXID';
import Avatar from './Avatar'
import GradientText from './GradientText'

// import Text from 'atoms/text/Text';
// import NotificationBadge from 'atoms/badge/NotificationBadge';
// import { blurOnBubbling } from 'atoms/button/script';

function RoomSelectorWrapper({
  isSelected,
  isMuted,
  isUnread,
  onClick,
  content,
  options,
  onContextMenu,
}) {
  const classes = [
    'group room-selector p-2 relative rounded-lg flex gap-2 items-center w-full hover:bg-[#e3e3e5] dark:hover:bg-[#222233]',
  ]
  if (isMuted) classes.push('room-selector--muted')
  if (isUnread) classes.push('room-selector--unread')
  if (isSelected)
    classes.push(
      'bg-[#e3e3e5] dark:bg-[#222233] dark:hover:bg-[#222233] hover:bg-[#e3e3e5]'
    )

  return (
    <div className={classes.join(' ')}>
      <button
        className="room-selector__content flex gap-2 items-center flex-grow relative"
        type="button"
        onClick={onClick}
        // onMouseUp={(e) => blurOnBubbling(e, '.room-selector__content')}
        onContextMenu={onContextMenu}
      >
        {content}
      </button>
      <div
        className={`room-selector__options ${
          !isSelected && 'hidden'
        } group-hover:block`}
      >
        {options}
      </div>
    </div>
  )
}

function RoomSelector({
  name,
  parentName,
  roomId,
  imageSrc,
  iconSrc,
  isSelected,
  isMuted,
  isUnread,
  notificationCount,
  isAlert,
  options,
  onClick,
  onContextMenu,
}) {
  const mx = MatrixService.matrixClient
  const isOnline = mx?.getUser(roomId)?.presence === 'online'
  return (
    <RoomSelectorWrapper
      isSelected={isSelected}
      isMuted={isMuted}
      isUnread={isUnread}
      content={
        <>
          <Avatar
            text={name}
            bgColor={colorMXID(roomId)}
            imageSrc={imageSrc}
            // iconColor="var(--ic-surface-low)"
            // iconSrc={iconSrc}
            size="extra-small"
          />
          {isOnline && <div className={`border-2 border-white aspect-square w-3 bg-green-500 absolute rounded-full left-[24px] bottom-0`}></div>}
          <div
            className="max-w-[130px] whitespace-nowrap overflow-hidden overflow-ellipsis"
          >
            <GradientText value={name} size={16} />
            {/* {name} */}
          </div>
          {isUnread && (
            // <NotificationBadge
            //   alert={isAlert}
            //   content={notificationCount !== 0 ? notificationCount : null}
            // />
            <span className="flex h-6 w-6 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4776E6dd] opacity-75"></span>
              <span className="relative flex justify-center items-center rounded-full h-6 w-6 bg-gradient-to-r from-[#4776E6] to-[#8E54E9]">
                <p className="text-white text-[10px]">{notificationCount}</p>
              </span>
            </span>
          )}
        </>
      }
      options={options}
      onClick={onClick}
      onContextMenu={onContextMenu}
    />
  )
}

export default RoomSelector
