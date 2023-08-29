import { Link, useLocation } from 'react-router-dom'
import twitter from 'assets/images/twitter.png'
import medium from 'assets/images/medium.png'
import opensea from 'assets/images/opensea.png'
import website from 'assets/images/website.png'

import Home from 'assets/images/home-menu/home.png'
import Nfts from 'assets/images/home-menu/nfts.png'
import Gaming from 'assets/images/home-menu/gaming.png'
import Cryptocurrency from 'assets/images/home-menu/cryptocurrency.png'
import _3d from 'assets/images/home-menu/3d.png'

import ellipsis from 'assets/images/ellipsis.png'
import GradientText from './GradientText'
import { useEffect, useState } from 'react'
import { rightMenuData } from 'constant'
import Dropdown from './Dropdown'
import { useSelector } from 'react-redux'
import navigation from 'services/navigation'
import { MatrixService } from 'services'
import Modal from './Modal'
// import { selectRoom } from 'action/navigation'
import { hasDMWith } from 'utils/matrixUtil'
import cons from 'services/cons'
import * as roomActions from 'action/room'
import InviteList from './InviteList'
import { useTotalInvites } from 'hook/useTotalInvites'
import { roomIdByActivity } from 'utils/sort'
import Postie from 'utils/postie'
import RoomsCategory from './RoomsCategory'
import { selectRoom } from 'action/navigation'
import { useToasts } from 'react-toast-notifications'
import colorMXID from 'utils/colorMXID'
import Avatar from './Avatar'
import { useForceUpdate } from 'hook/useForceUpdate'
import { getFormattedNumber } from 'utils/common'

const countries = [
  {
    value: 'us',
    label: 'United States',
  },
  {
    value: 'uk',
    label: 'United Kingdom',
  },
]

const homeMenu = [
  {
    id: 0,
    label: 'Home',
    image: Home,
    path: '/home',
  },
  {
    id: 1,
    label: 'NFTs',
    image: Nfts,
    path: '/nfts',
  },
  {
    id: 2,
    label: 'Gaming',
    image: Gaming,
    path: '/gaming',
  },
  {
    id: 3,
    label: 'Cryptocurrency',
    image: Cryptocurrency,
    path: '/cryptocurrency',
  },
  {
    id: 4,
    label: '3D Design',
    image: _3d,
    path: '/3d-design',
  },
]

const drawerPostie = new Postie();
function Rightnav() {
  const { pathname } = useLocation()
  const [country, setCountry] = useState({ value: '', label: 'Country select' })
  const [minimize, setMinimize] = useState(false)
  const [search, setSearch] = useState("")
  const [searchUsername, setSearchUsername] = useState('')
  const [open, setOpen] = useState(false)
  const [openInviteList, setOpenInviteList] = useState(false)
  const [loading, setLoading] = useState(false)
  const [joining, setJoining] = useState(false)
  const [users, updateUsers] = useState([])
  const [searchQuery, updateSearchQuery] = useState({});
  const [focus, setFocus] = useState()
  const [procUsers, updateProcUsers] = useState(new Set())
  const [procUserError, updateUserProcError] = useState(new Map())
  const [createdDM, updateCreatedDM] = useState(new Map())
  const [roomIdToUserId, updateRoomIdToUserId] = useState(new Map())
  const [showDMs, setShowDMs] = useState(true)
  const [online, setOnline] = useState(0)
  const currentRoom = useSelector((state) => state.community.current)
  const user = useSelector(state => state.auth.user)
  const mx = MatrixService.matrixClient
  const [totalInvites] = useTotalInvites()
  const { roomList, notifications } = MatrixService
  const [directIds, setDirectIds] = useState([])
  const [, forceUpdate] = useForceUpdate()
  const size = roomList?.directs.size
  const { addToast } = useToasts()
  const toggleDMs = () => {
    setShowDMs(show => !show)
  }
  const getMenu = () => {
    const visibleTabs = currentRoom?.visibleTabs ?? []
    const hideTeam = !visibleTabs.includes('team')
    const hideMarket = !visibleTabs.includes('marketplace')
    const hideAdmin = currentRoom?.admin !== user.id
    let menus = rightMenuData
    if (hideTeam) menus = menus.filter(menu => menu.label !== 'Team')
    if (hideMarket) menus = menus.filter(menu => menu.label !== 'Marketplace')
    if(hideAdmin) menus = menus.filter(menu => menu.label !== 'Admin panel')
    return menus
  }
  useEffect(() => {
    const handleUpdate = () => {
      forceUpdate();
    };
    roomList?.on(cons.events.roomList.ROOMLIST_UPDATED, handleUpdate);
    return () => {
      roomList?.removeListener(cons.events.roomList.ROOMLIST_UPDATED, handleUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (roomList?.directs)
      setDirectIds([...roomList?.directs].sort(roomIdByActivity))
    else setDirectIds([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size])
  useEffect(() => {
    const handleTimeline = (event, room, toStartOfTimeline, removed, data) => {
      if (!roomList?.directs.has(room.roomId)) return;
      if (!data.liveEvent) return
      if (directIds[0] === room.roomId) return
      const newDirectIds = [room.roomId]
      directIds.forEach((id) => {
        if (id === room.roomId) return
        newDirectIds.push(id)
      })
      setDirectIds(newDirectIds)
    }
    mx?.on('Room.timeline', handleTimeline)
    return () => {
      mx?.removeListener('Room.timeline', handleTimeline)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [directIds])
  // console.log(mx?.getRoom(currentRoom?.roomId)?.currentState)
  useEffect(() => {
    getOnline()
    let interval = setInterval(() => getOnline(), [5000])
    return () => {
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom])
  const getOnline = () => {
    // console.log("getting online count finction")
    if (currentRoom) {
      // console.log("hello", mx.getRoom(currentRoom.roomId).currentState.members)
      let onlineCount = 0
      const members = mx.getRoom(currentRoom.roomId).currentState.members
      Object.keys(members).map((memberId) => {
        const member = members[memberId]
        if (member.user) onlineCount += member.user?.presence === "online" ? 1 : 0
        return onlineCount
      })
      setOnline(onlineCount)
    }
  }
  useEffect(() => {
    const selectorChanged = (selectedRoomId, prevSelectedRoomId) => {
      if (!drawerPostie.hasTopic('selector-change')) return
      const addresses = []
      if (drawerPostie.hasSubscriber('selector-change', selectedRoomId)) addresses.push(selectedRoomId)
      if (drawerPostie.hasSubscriber('selector-change', prevSelectedRoomId)) addresses.push(prevSelectedRoomId)
      if (addresses.length === 0) return
      drawerPostie.post('selector-change', addresses, selectedRoomId)
    }

    const notiChanged = (roomId, total, prevTotal) => {
      if (total === prevTotal) return
      const isDM = roomList?.directs.has(roomId);
      if (isDM) {
        const timeline = mx?.getRoom(roomId).timeline
        const mEvent = timeline[timeline.length - 1]
        const senderName = mEvent.sender?.name
        const avatarUrl = mEvent.sender?.getAvatarUrl(mx.baseUrl, 36, 36, 'crop')
        const content = mEvent.getContent()
        addToast(JSON.stringify({ senderName, avatarUrl, content: content.body, id: roomId }), { appearance: 'info' })
      }
      // console.log(senderName, avatarUrl, content)
      if (drawerPostie.hasTopicAndSubscriber('unread-change', roomId)) {
        drawerPostie.post('unread-change', roomId)
      }
    }

    navigation?.on(cons.events.navigation.ROOM_SELECTED, selectorChanged)
    notifications?.on(cons.events.notifications.NOTI_CHANGED, notiChanged)
    notifications?.on(cons.events.notifications.MUTE_TOGGLED, notiChanged)
    return () => {
      navigation?.removeListener(cons.events.navigation.ROOM_SELECTED, selectorChanged)
      notifications?.removeListener(cons.events.notifications.NOTI_CHANGED, notiChanged)
      notifications?.removeListener(cons.events.notifications.MUTE_TOGGLED, notiChanged)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getMapCopy = (myMap) => {
    const newMap = new Map()
    myMap.forEach((data, key) => {
      newMap.set(key, data)
    })
    return newMap
  }

  const addUserToProc = (userId) => {
    procUsers.add(userId)
    updateProcUsers(new Set(Array.from(procUsers)))
  }

  const deleteUserFromProc = (userId) => {
    procUsers.delete(userId)
    updateProcUsers(new Set(Array.from(procUsers)))
  }

  const onDMCreated = (newRoomId) => {
    const myDMPartnerId = roomIdToUserId.get(newRoomId)
    if (typeof myDMPartnerId === 'undefined') return

    createdDM.set(myDMPartnerId, newRoomId)
    roomIdToUserId.delete(newRoomId)

    deleteUserFromProc(myDMPartnerId)
    updateCreatedDM(getMapCopy(createdDM))
    updateRoomIdToUserId(getMapCopy(roomIdToUserId))
  }

  useEffect(() => {
    MatrixService.roomList?.on(cons.events.roomList.ROOM_CREATED, onDMCreated)
    return () => {
      MatrixService.roomList?.removeListener(cons.events.roomList.ROOM_CREATED, onDMCreated)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, procUsers, createdDM, roomIdToUserId])

  const searchUser = async (username) => {
    const inputUsername = username.trim()
    if (loading || inputUsername === '' || inputUsername === searchQuery.username) return
    const isInputUserId = inputUsername[0] === '@' && inputUsername.indexOf(':') > 1
    setLoading(true)
    updateSearchQuery({ username: inputUsername })
    if (isInputUserId) {
      try {
        const result = await mx?.getProfileInfo(inputUsername)
        updateUsers([{
          user_id: inputUsername,
          display_name: result?.displayname,
          avatar_url: result?.avatar_url
        }])
      } catch (e) {
        updateSearchQuery({ error: `${inputUsername} not found!` })
      }
    } else {
      try {
        const result = await mx?.searchUserDirectory({
          term: inputUsername,
          limit: 20,
        })
        if (result?.results.length === 0) {
          updateSearchQuery({ error: `No matches found for "${inputUsername}"!` })
          setLoading(false)
        }
        updateUsers(result?.results)
      } catch (e) {
        updateSearchQuery({ error: 'something went wrong!' })
      }
    }
    setLoading(false)
  }
  const handleClickMenu = (item) => {
    if (currentRoom === null) return;
    if (item.path === '/announcement') navigation._selectRoom(currentRoom.announcement)
  }

  const createDM = async (userId) => {
    if (mx?.getUserId() === userId) return
    const dmRoomId = hasDMWith(userId)
    if (dmRoomId) {
      navigation._selectRoom(dmRoomId)
      setOpen(false)
      return
    }

    try {
      addUserToProc(userId)
      procUserError.delete(userId)
      updateUserProcError(getMapCopy(procUserError))

      const result = await roomActions.createDM(userId, false)
      roomIdToUserId.set(result.room_id, userId)
      updateRoomIdToUserId(getMapCopy(roomIdToUserId))
    } catch (e) {
      deleteUserFromProc(userId)
      if (typeof e.message === 'string') procUserError.set(userId, e.message)
      else procUserError.set(userId, 'Something went wrong!')
      updateUserProcError(getMapCopy(procUserError))
    }
    setJoining(false)
    setOpen(false)
  }

  const handleStartDM = () => {
    const userId = focus?.user_id
    if (typeof userId === 'undefined') return
    createDM(userId)
  }
  const openInviteUser = () => {
    setOpen(true)
  }
  const keyPress = (e) => {
    // if (e.keyCode === 13) {
    if (search === '') return
    searchUser(e.target.value)
    // }
  }
  if (pathname === '/connect' || pathname.includes('/auth') || pathname === '/user/settings') return null
  else
    return (
      <>
        {!minimize ? (
          pathname === '/home' || pathname === '/nfts' || pathname === '/gaming' || pathname === '/cryptocurrency' || pathname === '/3d-design' ? (
            <div className="relative flex h-full flex-col min-w-[315px] bg-white dark:bg-[#111111] py-[26px] shadow-sm text-secondary gap-6">
              <div className="w-full flex px-[38px]">
                <p className="text-[15px] w-full text-secondary font-semibold border-b border-[#697A8D66] pb-3">
                  Explore
                </p>
              </div>
              <div className="px-[38px] w-full flex flex-col gap-2">
                {homeMenu.map((item) => (
                  <Link
                    to={item.path}
                    key={item.id}
                    className={`flex items-center gap-3 py-[8px] px-[14px] rounded-lg ${item.path === pathname
                      ? 'bg-gradient-to-r from-[#4776E61A] to-[#8E54E91A]'
                      : ''
                      }`}
                  >
                    <img src={item.image} alt="" />
                    <GradientText value={item.label} size={14} />
                  </Link>
                ))}
              </div>
              <div
                onClick={() => setMinimize(true)}
                className="cursor-pointer aspect-square w-[35px] flex justify-center items-center bg-white dark:bg-[#111111] rounded-full absolute -left-3 top-[calc(50vh-100px)]"
              >
                <svg
                  className="max-w-[9px] max-h-[14px]"
                  width="9"
                  height="14"
                  viewBox="0 0 9 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.785644 1.82483L5.26407 6.71436L0.785644 11.6039L2.26072 13.2144L8.21422 6.71436L2.26072 0.214355L0.785644 1.82483Z"
                    fill="url(#paint0_linear_241_455)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_241_455"
                      x1="4.46083"
                      y1="13.2144"
                      x2="4.46083"
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
          ) : pathname === '/private' ? (<div className="relative flex h-full flex-col min-w-[315px] max-w-[315px] bg-white dark:bg-[#111111] py-[26px] shadow-sm text-secondary gap-6">
            <div className="w-full flex px-[38px] gap-4 items-center">
              <input
                className="px-[12px] py-[8px] text-sm rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white flex-grow"
                placeholder="Search users by name"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
              // onKeyDown={keyPress}
              />
              <button onClick={openInviteUser}>
                <svg
                  className="max-w-[23px] max-h-[23px] min-w-[23px]"
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
              </button>
            </div>
            <div className='w-full flex flex-col gap-4 px-[38px]'>
              {/* <button className='hover:bg-[#e3e3e5] dark:hover:bg-[#222233] flex items-center gap-2 py-3 px-6 justify-start rounded-lg bg-gradient-to-r from-[#4776E620] to-[#8E54E920] text-secondary text-sm font-semibold'>
                <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.3895 0L6.5 4.47842L1.61048 0L0 1.47507L6.5 7.42857L13 1.47507L11.3895 0Z" fill="#565A7F" />
                </svg>
                Group Messages (3)
              </button> */}
              {directIds.length > 0 && <button onClick={toggleDMs} className='hover:bg-[#e3e3e5] dark:hover:bg-[#222233] flex items-center gap-2 py-3 px-6 justify-start rounded-lg bg-gradient-to-r from-[#4776E620] to-[#8E54E920] text-secondary text-sm font-semibold'>
                <svg className={`transition-all ${showDMs ? '' : 'rotate-180'}`} width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.3895 0L6.5 4.47842L1.61048 0L0 1.47507L6.5 7.42857L13 1.47507L11.3895 0Z" fill="#565A7F" />
                </svg>
                Direct Messages ({directIds.length})
              </button>}
              {directIds.length > 0 && showDMs && <RoomsCategory name="People" roomIds={directIds.filter(id => mx?.getRoom(id).name.includes(searchUsername))} drawerPostie={drawerPostie} />}
              {totalInvites > 0 && <button onClick={() => setOpenInviteList(true)} className='hover:bg-[#e3e3e5] dark:hover:bg-[#222233] flex items-center gap-2 py-3 px-6 justify-start rounded-lg bg-gradient-to-r from-[#4776E620] to-[#8E54E920] text-secondary text-sm font-semibold'>
                <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                </svg>
                Invites ({totalInvites})
              </button>}
            </div>

            <div
              onClick={() => setMinimize(true)}
              className="cursor-pointer aspect-square w-[35px] flex justify-center items-center bg-white dark:bg-[#111111] rounded-full absolute -left-3 top-[calc(50vh-100px)]"
            >
              <svg
                className="max-w-[9px] max-h-[14px]"
                width="9"
                height="14"
                viewBox="0 0 9 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.785644 1.82483L5.26407 6.71436L0.785644 11.6039L2.26072 13.2144L8.21422 6.71436L2.26072 0.214355L0.785644 1.82483Z"
                  fill="url(#paint0_linear_241_455)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_241_455"
                    x1="4.46083"
                    y1="13.2144"
                    x2="4.46083"
                    y2="0.83696"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4776E6" />
                    <stop offset="1" stopColor="#8E54E9" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>) : (
            <div className="relative flex h-full flex-col min-w-[315px] bg-white dark:bg-[#111111] py-[26px] shadow-sm text-secondary">
              {/* Social links */}
              <div className="flex justify-between px-[32px] text-secondary font-[600] text-[12px] pb-[22px] border-b border-b-[#697A8D66]">
                <div className="flex flex-col items-center gap-[8px]">
                  <div className="bg-[#F3F3F5] dark:bg-[#1F1F22] flex p-2 rounded-full">
                    <img
                      className="w-[24px] h-[24px] object-contain"
                      src={twitter}
                      alt=""
                    />
                  </div>
                  <p>Twitter</p>
                </div>
                <div className="flex flex-col items-center gap-[8px]">
                  <div className="bg-[#F3F3F5] dark:bg-[#1F1F22] flex p-2 rounded-full">
                    <img
                      className="w-[24px] h-[24px] object-contain"
                      src={medium}
                      alt=""
                    />
                  </div>
                  <p>Medium</p>
                </div>
                <div className="flex flex-col items-center gap-[8px]">
                  <div className="bg-[#F3F3F5] dark:bg-[#1F1F22] flex p-2 rounded-full">
                    <img
                      className="w-[24px] h-[24px] object-contain"
                      src={opensea}
                      alt=""
                    />
                  </div>
                  <p>Opensea</p>
                </div>
                <div className="flex flex-col items-center gap-[8px]">
                  <div className="bg-[#F3F3F5] dark:bg-[#1F1F22] flex p-2 rounded-full">
                    <img
                      className="w-[24px] h-[24px] object-contain"
                      src={website}
                      alt=""
                    />
                  </div>
                  <p>Website</p>
                </div>
              </div>
              {/* Rightbar Menu */}
              <div className="flex flex-col py-3 gap-[12px] px-[32px] border-b border-b-[#697A8D66] overflow-y-auto flex-grow text-[#a6aacf] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800">
                <div className="flex justify-around">
                  <div className="flex flex-col items-center gap-[4px]">
                    <div className="w-12 justify-center bg-gradient-to-r aspect-square flex items-center from-[#4776E6] to-[#8E54E9] text-white text-[15px] font-[600] p-2 rounded-full">
                      {getFormattedNumber(currentRoom?.joined.length)}
                    </div>
                    <p className="text-[10px] font-bold">Total Members</p>
                  </div>
                  <div className="flex flex-col items-center gap-[4px]">
                    <div className="w-12 justify-center bg-gradient-to-r aspect-square flex items-center from-[#4776E6] to-[#8E54E9] text-white text-[15px] font-[600] p-2 rounded-full">
                      {getFormattedNumber(online)}
                    </div>
                    <p className="text-[10px] font-bold">Online Members</p>
                  </div>
                </div>
                {getMenu().map((item) => (
                  <Link
                    to={item.path}
                    onClick={() => handleClickMenu(item)}
                    key={item.label}
                    className={`rounded-xl w-full px-[24px] py-[8px] flex justify-start gap-[18px] items-center hover:from-[#4776E644] hover:to-[#8E54E944] ${pathname.includes(item.path)
                      ? 'bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white'
                      : 'bg-gradient-to-r from-[#4776E620] to-[#8E54E920]'
                      }`}
                  >
                    <div className="flex justify-center min-w-[20px]">
                      <img
                        className={
                          pathname.includes(item.path)
                            ? 'brightness-0 invert max-w-[20px]'
                            : 'max-w-[20px]'
                        }
                        src={item.image}
                        alt=""
                      />
                    </div>
                    {pathname.includes(item.path) ? (
                      <p className="text-sm font-[600]">{item.label}</p>
                    ) : (
                      <div className='text-[14px]'><GradientText size={14} value={item.label} /></div>
                    )}
                  </Link>
                ))}
                <button className="rounded-xl w-full px-[24px] py-[8px] flex justify-start gap-[18px] items-center bg-gradient-to-r from-[#4776E620] to-[#8E54E920]">
                  <div className="flex justify-center min-w-[20px]">
                    <img src={ellipsis} alt="" />
                  </div>
                  <GradientText size={14} value={'More'} />
                </button>
              </div>
              <div className='px-[32px] mt-4'>
                <Link className={`bg-gradient-to-r ${pathname !== '/chat'
                  ? 'dark:bg-[#1F1F22] hover:bg-[#e3e3e5] dark:hover:bg-[#222233] from-[#4776E619] to-[#8E54E919]'
                  : 'from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6E0] hover:to-[#8E54E9E0]'
                  } rounded-xl py-[8px] px-[12px] flex gap-4 items-center justify-center w-full relative text-md`} to="/chat" onClick={() => selectRoom(currentRoom.roomId)}>
                  {pathname === '/chat' ? (
                    <p className="text-[14px] text-white font-[600]">
                      General chat
                    </p>
                  ) : (
                    <GradientText size={14} value="General chat" />
                  )}
                </Link></div>
              {/* Country select */}
              <div className="w-full flex flex-col px-[32px] mt-2">
                <Dropdown
                  id="country"
                  current={country}
                  onChange={setCountry}
                  options={countries}
                  type="transparent"
                />
              </div>
              <div
                onClick={() => setMinimize(true)}
                className="cursor-pointer aspect-square w-[35px] flex justify-center items-center bg-white dark:bg-[#111111] rounded-full absolute -left-3 top-[calc(50vh-100px)]"
              >
                <svg
                  className="max-w-[9px] max-h-[14px]"
                  width="9"
                  height="14"
                  viewBox="0 0 9 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.785644 1.82483L5.26407 6.71436L0.785644 11.6039L2.26072 13.2144L8.21422 6.71436L2.26072 0.214355L0.785644 1.82483Z"
                    fill="url(#paint0_linear_241_455)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_241_455"
                      x1="4.46083"
                      y1="13.2144"
                      x2="4.46083"
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
          )
        ) : (
          <div className="relative flex h-full flex-col justify-start max-w-[42px] bg-white dark:bg-[#111111] px-[6px] shadow-sm text-secondary">
            <p className="uppercase text-secondary text-[9px] -rotate-90 whitespace-nowrap ml-2.5 mt-[calc(50vh-65px)]">
              Open the menu
            </p>

            <div
              onClick={() => setMinimize(false)}
              className="cursor-pointer aspect-square w-[35px] flex justify-center items-center bg-white dark:bg-[#111111] rounded-full absolute -left-3 top-[calc(50vh-100px)]"
            >
              <svg
                className="max-w-[9px] max-h-[14px]"
                width="9"
                height="14"
                viewBox="0 0 9 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.21387 11.6039L3.73544 6.71436L8.21387 1.82483L6.73879 0.214355L0.785295 6.71436L6.73879 13.2144L8.21387 11.6039Z"
                  fill="url(#paint0_linear_213_371)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_213_371"
                    x1="4.53868"
                    y1="0.214355"
                    x2="4.53868"
                    y2="12.5918"
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
        <Modal open={open} onClose={() => setOpen(false)}>
          <div className="w-full flex flex-col min-h-[600px]">
            <div className="flex justify-center border-b border-[#697A8D66] py-[18px] text-[36px]">
              <GradientText size={36} value="Direct message" />
            </div>
            <input
              className="px-[22px] py-[14px] text-sm rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic mt-8 text-primary dark:text-white"
              placeholder="User name or id here..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={keyPress}
            />
            {search !== '' && (
              <div className="flex justify-end w-full mt-1">
                <GradientText size={12} value='"Enter" to Search' />
              </div>
            )}
            <div className="flex flex-col flex-grow max-h-[460px] p-4 gap-2 bg-[#F3F3F5] dark:bg-[#1F1F22] mt-4 rounded-lg overflow-y-auto text-[#a6aacf] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800">
              {users?.map((item) => (
                <div
                  onClick={() => setFocus(item)}
                  className={`cursor-pointer flex w-full items-center gap-4 px-3 py-2 rounded-lg ${focus === item
                    ? 'bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white'
                    : 'hover:bg-gradient-to-r from-[#4776E620] to-[#8E54E920] text-primary dark:text-white'
                    }`}
                  key={item.user_id}
                >
                  {/* <img
                    className="w-full max-w-[52px] object-cover aspect-square rounded-full"
                    src={item.avatar_url}
                    alt=""
                  /> */}
                  <Avatar
                    text={item.display_name}
                    bgColor={colorMXID(item.user_id)}
                    imageSrc={mx?.getUser(item.user_id)?.avatarUrl ? mx?.mxcUrlToHttp(mx?.getUser(item.user_id)?.avatarUrl, 80, 80, 'crop') : null}
                  // iconColor="var(--ic-surface-low)"
                  // iconSrc={iconSrc}
                  // size="extra-small"
                  />
                  <p className="text-xl font-bold flex-grow">{item.display_name}</p>
                  {/* <div className="bg-[#fffe] dark:bg-[#111e] p-2 rounded-lg">
                    <GradientText
                      value={item.network === 'eth' ? 'ETHEREUM' : 'SOLANA'}
                      size={14}
                    />
                  </div> */}
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
              onClick={handleStartDM}
              className={`bg-gradient-to-r self-center from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6dd] hover:to-[#8E54E9dd] text-sm font-bold rounded-full text-white px-[60px] py-[8px] mt-6 flex items-center gap-2 ${joining && 'pointer-events-none'}`}
            >
              Message
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
        </Modal>
        <InviteList open={openInviteList} onClose={() => setOpenInviteList(false)} />
      </>
    )
}

export default Rightnav
