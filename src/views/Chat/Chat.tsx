import { useRef, useState, useEffect } from 'react';
import GradientText from 'components/GradientText';
import GeneralMessage from 'components/GeneralMessage';
import { MatrixService } from 'services';
// import RoomTimeline from 'services/RoomTimeline';
import cons from 'services/cons';
import navigation from 'services/navigation';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
// import { setRoomInfo } from 'slices';
// import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import logo_dark from 'assets/images/logos/logo_dark.png';
import logo_light from 'assets/images/logos/logo_light.png';
import Avatar from 'components/Avatar';
import colorMXID from 'utils/colorMXID';
import DragDrop from 'components/DragDrops';
import { ReactComponent as FileIcon } from 'assets/ic/outlined/file.svg';
import { ReactComponent as CrossIcon } from 'assets/ic/outlined/cross.svg';
import { getEventCords } from 'utils/common';
import { openEmojiBoard } from 'action/navigation';
import EmojiBoardOpener from 'components/EmojiBoard/EmojiBoardOpener';

const Chat = () => {
  const [dragCounter, setDragCounter] = useState<number>(0);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [attachment, setAttachment] = useState();
  const { roomsInput } = MatrixService;
  const roomInfo = useSelector((state: RootState) => state.roomInfo);
  const { roomTimeline, eventId } = roomInfo;
  const { pathname } = useLocation();

  useEffect(() => {
    roomsInput?.on(cons.events.roomsInput.ATTACHMENT_SET, setAttachment);
    return () => {
      roomsInput?.removeListener(
        cons.events.roomsInput.ATTACHMENT_SET,
        setAttachment
      );
    };
  }, [roomsInput]);

  const onTextInput = (e: any) => {
    let textarea = document.getElementById('textarea') as HTMLElement;
    textarea.style.height = '';
    textarea.style.height = textarea?.scrollHeight + 'px';
  };
  const onKeyDown = (e: any) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      sendMessage();
    }
  };
  const mx = MatrixService.matrixClient;
  const membership = mx
    ?.getRoom(roomTimeline?.roomId)
    ?.getMember(mx.credentials.userId as string);
  const sendMessage = async () => {
    const { roomId } = roomTimeline;
    const msgBody = textAreaRef.current?.value.trim();
    if (msgBody === '' && attachment === null) return;
    const opt = { msgType: 'm.text', autoMarkdown: true };
    if (roomsInput?.isSending(roomId)) return;
    roomsInput?.setMessage(roomId, msgBody);
    await roomsInput?.sendInput(roomId, opt);
    if (textAreaRef.current) textAreaRef.current.value = '';
    setAttachment(undefined);
  };
  const roomName = roomTimeline?.room.name;
  const avatarUrl = roomTimeline?.room
    .getAvatarFallbackMember()
    ?.getAvatarUrl(mx?.baseUrl, 80, 80, 'crop');

  function dragContainsFiles(e: any) {
    if (!e.dataTransfer.types) return false;

    for (let i = 0; i < e.dataTransfer.types.length; i += 1) {
      if (e.dataTransfer.types[i] === 'Files') return true;
    }
    return false;
  }

  function modalOpen() {
    return navigation.isRawModalVisible && dragCounter <= 0;
  }

  function handleDragOver(e: any) {
    if (!dragContainsFiles(e)) return;

    e.preventDefault();

    if (!navigation.selectedRoomId || modalOpen()) {
      e.dataTransfer.dropEffect = 'none';
    }
  }

  function handleDragEnter(e: any) {
    e.preventDefault();

    if (navigation.selectedRoomId && !modalOpen() && dragContainsFiles(e)) {
      setDragCounter(dragCounter + 1);
    }
  }

  function handleDragLeave(e: any) {
    e.preventDefault();

    if (navigation.selectedRoomId && !modalOpen() && dragContainsFiles(e)) {
      setDragCounter(dragCounter - 1);
    }
  }

  function handleDrop(e: any) {
    e.preventDefault();

    setDragCounter(0);

    if (modalOpen()) return;

    const roomId = navigation.selectedRoomId;
    if (!roomId) return;

    const { files } = e.dataTransfer;
    if (!files?.length) return;
    const file = files[0];
    console.log(files[0]);
    MatrixService.roomsInput?.setAttachment(roomId, file);
    MatrixService.roomsInput?.emit(cons.events.roomsInput.ATTACHMENT_SET, file);
  }

  const handlePaste = (e: any) => {
    const roomId = navigation.selectedRoomId;
    if (!roomId) return;
    if (e.clipboardData === false) {
      return;
    }

    if (e.clipboardData.items === undefined) {
      return;
    }
    for (let i = 0; i < e.clipboardData.items.length; i += 1) {
      const item = e.clipboardData.items[i];
      if (item.type.indexOf('image') !== -1) {
        const image = item.getAsFile();
        // if (attachment === undefined) {
        setAttachment(image);
        if (image !== null) {
          roomsInput?.setAttachment(roomId, image);
          return;
        }
        // } else {
        // return;
        // }
      }
    }
  };

  const handleCancelAttachment = () => {
    const roomId = navigation.selectedRoomId;
    setAttachment(undefined);
    MatrixService.roomsInput?.cancelAttachment(roomId);
  };

  function attachFile() {
    console.log(attachment);
    console.log(typeof attachment);
    return (
      <div className="relative flex gap-2 items-center">
        <div
          className="absolute top-2.5 -left-[34px] w-6 h-6 border-[1px] border-solid border-black dark:border-white rounded-full cursor-pointer"
          onClick={handleCancelAttachment}
        >
          <CrossIcon className="fill-black dark:fill-white" />
        </div>
        {attachment?.['type'] !== undefined &&
        (attachment?.['type'] as string).includes('image') ? (
          <img
            src={URL.createObjectURL(attachment)}
            className="w-[42px] h-[42px]"
            alt={attachment?.['name']}
          />
        ) : (
          <div className="p-2 rounded-md border-[1px] border-solid border-[#000] dark:border-[#fff]">
            <FileIcon className="w-6 h-6 fill-black dark:fill-white" />
          </div>
        )}
        <div className="room-attachment__info">
          <p className="text-sm text-black dark:text-white">
            {attachment?.['name']}
          </p>
          <p className="text-xs text-gray-400">
            <span>size: {attachment?.['size']} byte</span>
          </p>
        </div>
      </div>
    );
  }

  function addEmoji(emoji: any) {
    (textAreaRef as any).current.value += emoji.unicode;
    (textAreaRef as any).current.focus();
  }

  return (
    <div
      className={`flex flex-col gap-3.5 flex-grow ${
        pathname !== '/private' && 'max-h-[calc(100vh-112px)]'
      }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {pathname === '/private' && (
        <div className="flex max-h-[98px] min-h-[98px] bg-white dark:bg-[#111111] shadow-sm items-center px-12 gap-6">
          <p className="text-primary text-sm font-semibold">Direct Messages</p>
          {roomTimeline !== null ? (
            <div className="flex items-center flex-grow gap-2">
              <Avatar
                text={roomName}
                bgColor={colorMXID(roomTimeline.roomId)}
                imageSrc={avatarUrl}
                // iconColor="var(--ic-surface-low)"
                // iconSrc={iconSrc}
                size="extra-small"
              />
              <GradientText value={roomName} size={15} />
            </div>
          ) : (
            <div className="flex-grow"></div>
          )}
          <div className="flex items-center gap-4">
            <button>
              <svg
                className="max-w-6"
                width="24"
                height="16"
                viewBox="0 0 24 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23 3L16 8L23 13V3Z"
                  stroke="url(#paint0_linear_564_503)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 1H3C1.89543 1 1 1.89543 1 3V13C1 14.1046 1.89543 15 3 15H14C15.1046 15 16 14.1046 16 13V3C16 1.89543 15.1046 1 14 1Z"
                  stroke="url(#paint1_linear_564_503)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_564_503"
                    x1="12"
                    y1="1"
                    x2="12"
                    y2="15"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4A76E7" />
                    <stop offset="1" stopColor="#8F55EA" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_564_503"
                    x1="12"
                    y1="1"
                    x2="12"
                    y2="15"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4A76E7" />
                    <stop offset="1" stopColor="#8F55EA" />
                  </linearGradient>
                </defs>
              </svg>
            </button>
            <button>
              <svg
                className="max-w-[23px]"
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.9381 5C14.9149 5.19057 15.8125 5.66826 16.5162 6.37194C17.2199 7.07561 17.6976 7.97326 17.8881 8.95M13.9381 1C15.9674 1.22544 17.8597 2.13417 19.3044 3.57701C20.749 5.01984 21.6601 6.91101 21.8881 8.94M20.8881 16.92V19.92C20.8892 20.1985 20.8322 20.4742 20.7206 20.7293C20.6091 20.9845 20.4454 21.2136 20.2402 21.4019C20.035 21.5901 19.7927 21.7335 19.5289 21.8227C19.265 21.9119 18.9855 21.9451 18.7081 21.92C15.631 21.5856 12.6751 20.5341 10.0781 18.85C7.66194 17.3147 5.61345 15.2662 4.07812 12.85C2.38809 10.2412 1.33636 7.27099 1.00812 4.18C0.983127 3.90347 1.01599 3.62476 1.10462 3.36162C1.19324 3.09849 1.33569 2.85669 1.52288 2.65162C1.71008 2.44655 1.93792 2.28271 2.19191 2.17052C2.44589 2.05833 2.72046 2.00026 2.99812 2H5.99812C6.48342 1.99522 6.95391 2.16708 7.32188 2.48353C7.68985 2.79999 7.93019 3.23945 7.99812 3.72C8.12474 4.68007 8.35957 5.62273 8.69812 6.53C8.83266 6.88792 8.86178 7.27691 8.78202 7.65088C8.70227 8.02485 8.51698 8.36811 8.24812 8.64L6.97812 9.91C8.40167 12.4135 10.4746 14.4864 12.9781 15.91L14.2481 14.64C14.52 14.3711 14.8633 14.1858 15.2372 14.1061C15.6112 14.0263 16.0002 14.0555 16.3581 14.19C17.2654 14.5286 18.2081 14.7634 19.1681 14.89C19.6539 14.9585 20.0975 15.2032 20.4146 15.5775C20.7318 15.9518 20.9003 16.4296 20.8881 16.92Z"
                  stroke="url(#paint0_linear_564_506)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_564_506"
                    x1="11.4441"
                    y1="1"
                    x2="11.4441"
                    y2="21.9281"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4A76E7" />
                    <stop offset="1" stopColor="#8F55EA" />
                  </linearGradient>
                </defs>
              </svg>
            </button>
            <button>
              <svg
                className="max-w-5"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 19H17C18.1046 19 19 18.1046 19 17V3C19 1.89543 18.1046 1 17 1H3C1.89543 1 1 1.89543 1 3V17C1 18.1046 1.89543 19 3 19ZM3 19L14 8L19 13M8 6.5C8 7.32843 7.32843 8 6.5 8C5.67157 8 5 7.32843 5 6.5C5 5.67157 5.67157 5 6.5 5C7.32843 5 8 5.67157 8 6.5Z"
                  stroke="url(#paint0_linear_564_511)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_564_511"
                    x1="10"
                    y1="1"
                    x2="10"
                    y2="19"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4A76E7" />
                    <stop offset="1" stopColor="#8F55EA" />
                  </linearGradient>
                </defs>
              </svg>
            </button>
            <button>
              <svg
                className="max-w-[18px]"
                width="18"
                height="22"
                viewBox="0 0 18 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V19C1 19.5304 1.21071 20.0391 1.58579 20.4142C1.96086 20.7893 2.46957 21 3 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V7M11 1L17 7M11 1V7H17M13 12H5M13 16H5M7 8H5"
                  stroke="url(#paint0_linear_564_518)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_564_518"
                    x1="9"
                    y1="1"
                    x2="9"
                    y2="21"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4A76E7" />
                    <stop offset="1" stopColor="#8F55EA" />
                  </linearGradient>
                </defs>
              </svg>
            </button>
            <button>
              <svg
                className="max-w-5"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.0004 19L14.6504 14.65M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z"
                  stroke="url(#paint0_linear_564_522)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_564_522"
                    x1="10.0002"
                    y1="1"
                    x2="10.0002"
                    y2="19"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4A76E7" />
                    <stop offset="1" stopColor="#8F55EA" />
                  </linearGradient>
                </defs>
              </svg>
            </button>
          </div>
        </div>
      )}
      <div
        className={`${
          pathname === '/private' ? 'max-h-[calc(100vh-112px)]' : 'max-h-full'
        } flex-grow flex flex-col bg-white dark:bg-[#111111] shadow-sm gap-9 py-[26px]`}
      >
        {pathname !== '/private' && (
          <div className="flex w-full items-center gap-4 px-9">
            {/* <p className="text-primary text-sm font-semibold">#General</p> */}
            <p className="text-secondary text-[15px] font-semibold flex-grow">
              Come kick back, relax and talk NFTs!
            </p>
            <button className="py-1 px-2 hover:bg-[#e3e3e5] dark:hover:bg-[#222233] rounded-md">
              <p className="text-[15px] font-semibold text-[#565A7F59] dark:text-white">
                FR
              </p>
            </button>
            <button className="py-1 px-2 bg-gradient-to-r from-[#4776E619] to-[#8E54E919] dark:bg-[#1F1F22] hover:bg-[#e3e3e5] dark:hover:bg-[#222233] rounded-md">
              <div className="text-[15px] font-semibold text-[#565A7F59] dark:text-white">
                <GradientText size={15} value="EN" />
              </div>
            </button>
            <button className="py-1 px-2 hover:bg-[#e3e3e5] dark:hover:bg-[#222233] rounded-md">
              <p className="text-[15px] font-semibold text-[#565A7F59] dark:text-white">
                RU
              </p>
            </button>
            <button className="py-1 px-2 hover:bg-[#e3e3e5] dark:hover:bg-[#222233] rounded-md">
              <p className="text-[15px] font-semibold text-[#565A7F59] dark:text-white">
                ES
              </p>
            </button>
          </div>
        )}

        {roomTimeline ? (
          <GeneralMessage roomTimeline={roomTimeline} eventId={eventId} />
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow">
            <img
              className="max-w-[200px] p-4 hidden dark:block"
              src={logo_dark}
              alt=""
            />
            <img
              className="max-w-[200px] p-4 shadow-xl dark:hidden rounded-[30px]"
              src={logo_light}
              alt=""
            />
            <p className="text-[44px] font-bold text-primary dark:text-white mt-8">
              Welcome to Biples
            </p>
            <p className="text-xl font-semibold text-secondary dark:text-white mt-4">
              Yet another Biples Client
            </p>
          </div>
        )}
        {/* ))} */}
        {/* <RoomIntro roomId={timeline?.roomId} avatarSrc={avatarSrc} name={room?.name} heading={heading} desc={desc} time={null} /> */}
        <div className="w-full flex px-12">
          <div className="w-full h-[1px] bg-[#697A8D66]"></div>
        </div>
        <div className="w-full flex px-12">
          {pathname === '/announcement' && membership?.powerLevel === 0 ? (
            <div className="rounded-xl bg-[#F3F3F5] dark:bg-[#1F1F22] px-[42px] py-[30px] w-full text-primary dark:text-white">
              You do not have permission to post to this room
            </div>
          ) : pathname === '/private' && roomTimeline === null ? (
            <div className="rounded-xl bg-[#F3F3F5] dark:bg-[#1F1F22] px-[42px] py-[30px] w-full text-primary dark:text-white">
              You did not select a person to chat
            </div>
          ) : (
            <div className="grid gap-3 w-full">
              {attachment !== undefined && attachFile()}
              <label
                className="rounded-xl relative bg-[#F3F3F5] dark:bg-[#1F1F22] px-[42px] py-[30px] w-full flex items-start gap-2"
                htmlFor="textarea"
              >
                <textarea
                  id="textarea"
                  className="min-h-4 h-6 max-h-60 bg-transparent focus:outline-0 w-full resize-none text-[15px] text-secondary dark:text-white"
                  placeholder="Write a message..."
                  onChange={onTextInput}
                  onKeyDown={onKeyDown}
                  onPaste={handlePaste}
                  ref={textAreaRef}
                />
                <svg
                  className="max-h-[22px] max-w-[22px] cursor-pointer"
                  onClick={(e: any) => {
                    const cords = getEventCords(e);
                    cords.x += document.dir === 'rtl' ? -80 : 80;
                    cords.y -= 250;
                    console.log('open')
                    openEmojiBoard(cords, addEmoji);
                  }}
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
                    stroke="#697A8D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 13C7 13 8.5 15 11 15C13.5 15 15 13 15 13"
                    stroke="#697A8D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 8H8.01"
                    stroke="#697A8D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 8H14.01"
                    stroke="#697A8D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  className="max-h-[22px] max-w-[22px]"
                  width="16"
                  height="24"
                  viewBox="0 0 16 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 1C7.20435 1 6.44129 1.31607 5.87868 1.87868C5.31607 2.44129 5 3.20435 5 4V12C5 12.7956 5.31607 13.5587 5.87868 14.1213C6.44129 14.6839 7.20435 15 8 15C8.79565 15 9.55871 14.6839 10.1213 14.1213C10.6839 13.5587 11 12.7956 11 12V4C11 3.20435 10.6839 2.44129 10.1213 1.87868C9.55871 1.31607 8.79565 1 8 1V1Z"
                    stroke="#697A8D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 10V12C15 13.8565 14.2625 15.637 12.9497 16.9497C11.637 18.2625 9.85652 19 8 19C6.14348 19 4.36301 18.2625 3.05025 16.9497C1.7375 15.637 1 13.8565 1 12V10"
                    stroke="#697A8D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 19V23"
                    stroke="#697A8D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 23H12"
                    stroke="#697A8D"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </label>
            </div>
          )}
        </div>
      </div>
      <EmojiBoardOpener />
      <DragDrop isOpen={dragCounter !== 0} />

    </div>
  );
};

export default Chat;
