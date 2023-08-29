import { useEffect, useState } from 'react'
import GradientText from './GradientText'
import { Checked, Unchecked } from './Icon'
import Camera from 'assets/images/camera-grey.png'
import { JwtService, MatrixService } from 'services'
import { getServersSuccess, loadingServerAction } from 'slices'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { useDropzone } from 'react-dropzone'
import * as roomActions from 'action/room'
import * as referralCodes from 'referral-codes'
// import { getIdServer } from 'utils/matrixUtil'
// import { selectRoom } from 'action/navigation'
import cons from 'services/cons'
import navigation from 'services/navigation'
import solImg from 'assets/images/sol.png'
import ethImg from 'assets/images/eth.png'
import { uploadFile } from 'utils/common'
import { useToasts } from 'react-toast-notifications'

const CreateServer = ({ onClose }: { onClose: () => void }) => {
  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      multiple: false,
      accept: { 'image/*': [] },
      onDropAccepted: async (files) => {
        const image = files[0]
        // const baseUrl = await toBase64(image)
        const baseUrl = await uploadFile(image)
        if(baseUrl === '') {
          addToast("The image can't be uploaded!", { appearance: 'error' })
          return
        }
        setImgBack({
          url: baseUrl,
          name: image.name,
        })
      },
    })
  const [serverName, setServerName] = useState('')
  const [description, setDescription] = useState('')
  const [twitter, setTwitter] = useState('')
  const [medium, setMedium] = useState('')
  const [website, setWebsite] = useState('')
  const [inviteLink, setInviteLink] = useState('')
  const [network, setNetwork] = useState('')
  const [imgUrl, setImgUrl] = useState<any>(null)
  const [imgBack, setImgBack] = useState<any>(null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const user = useSelector((state: RootState) => state.auth.user)
  const mx = MatrixService.matrixClient
  const { addToast } = useToasts()
  // const userHs = getIdServer(mx?.getUserId())
  useEffect(() => {
    const [referral] = referralCodes.generate({length: 8})
    setInviteLink(referral)
  }, [])

  useEffect(() => {
    const { roomList } = MatrixService
    const onCreated = (roomId: string) => {
      if (!mx?.getRoom(roomId)?.isSpaceRoom()) {
        navigation._selectRoom(roomId);
        // selectRoom(roomId);
      }
    }
    roomList?.on(cons.events.roomList.ROOM_CREATED, onCreated)
    return () => {
      roomList?.removeListener(cons.events.roomList.ROOM_CREATED, onCreated)
    }
  })
  const createRoom = async (name: string, topic: string) => {
    const roomAlias = undefined
    const powerLevel = 101
    const joinRule = 'public'
    const ret = await roomActions.createRoom({
      name,
      topic,
      joinRule,
      alias: roomAlias,
      inEncrypted: false,
      powerLevel,
      isSpace: false,
      parentId: null
    })
    return ret
  }
  // createRoom()
  const handleCreate = async () => {
    if (
      serverName === '' ||
      twitter === '' ||
      network === '' ||
      imgUrl === null ||
      description === '' ||
      imgBack === null
    ){
      addToast("Fill the required fields", { appearance: 'error' })
      return console.log('fill the required field')
    }
    setLoading(true)
    let createdRoom
    let createdAnnouncement
    try {
      createdAnnouncement = await createRoom(`${serverName} Announcement`, description)
      createdRoom = await createRoom(serverName, description)
      await mx?.sendStateEvent(
        createdRoom?.room_id,
        'm.room.avatar',
        { url: imgUrl.url ? imgUrl.url : null },
        ''
      )
    } catch (e: any) {
      if (e.message === 'M_UNKNOWN: Invalid characters in room alias') {
        console.log('ERROR: Invalid characters in address');
      } else if (e.message === 'M_ROOM_IN_USE: Room alias already taken') {
        console.log('ERROR: This address is already in use');
      } else console.log(e.message);
    }
    if (createdRoom) JwtService.createServer({
      serverName,
      twitter,
      medium,
      website,
      inviteLink,
      network,
      image: imgUrl,
      background: imgBack,
      description,
      roomId: createdRoom?.room_id,
      announcement: createdAnnouncement?.room_id
    })
      .then((res) => {
        dispatch(loadingServerAction(true))
        JwtService.getServersByUser(user.id ? user.id : '')
          .then((res) => {
            dispatch(getServersSuccess(res))
            setLoading(false)
          })
          .catch((e: any) => {
            console.log(e)
            dispatch(loadingServerAction(false))
            setLoading(false)
          })
        onClose()
      })
      .catch((e: any) => {
        console.log(e)
        setLoading(false)
      })
  }
  const handleUpload = async (e: any) => {
    if(e.target.files.length === 0) return
    const url = await uploadFile(e.target.files.item(0))
    if(url === '') {
      addToast("The image couldn't be uploaded", { appearance: 'error' })
      return
    }
    if (e.target.value.length > 0) {
      const image = e.target.files[0]
      setImgUrl({
        url: url,
        name: image.name,
      })
    } else {
      setImgUrl(null)
    }
  }
  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-center border-b border-[#697A8D66] py-[18px] text-[36px]">
        <GradientText size={36} value="Join us on the other side" />
      </div>
      <p className="text-sm font-semibold mt-4">
        Server Name<b className="text-red-500">*</b>
      </p>
      <div className="relative flex flex-col w-full">
        <label
          className={`absolute flex items-center rounded-full w-[36px] h-[36px] top-[10px] left-3 ${imgUrl === null ? 'p-1 border border-secondary cursor-pointer' : ''
            }`}
        >
          <img
            className="rounded-full object-cover w-full h-full"
            src={imgUrl === null ? Camera : mx?.mxcUrlToHttp(imgUrl.url as string, 80, 80, 'crop') as string}
            alt=""
          />
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
            accept="image/*"
          />
        </label>
        <input
          className="px-[22px] pl-[60px] py-[18px] text-[12px] rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white"
          placeholder="Server name here..."
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
        />
      </div>
      <p className="text-sm font-semibold mt-4">
        Description<b className="text-red-500">*</b>
      </p>
      <textarea
        className="px-[22px] py-[18px] text-[12px] rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white min-h-[90px]"
        placeholder="Description here..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <p className="text-sm font-semibold mt-4">
        Background Image<b className="text-red-500">*</b>
      </p>
      <div className="container w-full bg-[#F3F3F5] dark:bg-[#1F1F22] rounded-lg">
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <div
            className={`w-full text-center cursor-pointer px-[22px] py-[18px] border-2 border-dashed rounded-lg  flex flex-col items-center ${isDragAccept
              ? 'border-[#00e676]'
              : isDragReject
                ? 'border-[#ff1744]'
                : ''
              }`}
          >
            Drag and drop file here, or click to select file
            <p className="w-full text-center">
              {imgBack === null ? '' : imgBack.name}
            </p>
          </div>
        </div>
      </div>
      <p className="text-sm mt-4 font-bold">Official Links</p>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="w-full flex flex-col">
          <p className="text-sm font-semibold">
            Twitter<b className="text-red-500">*</b>
          </p>
          <input
            className="px-[22px] py-[14px] text-[12px] rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white"
            placeholder="Twitter link here..."
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
          <p className="text-sm font-semibold mt-4">Medium</p>
          <input
            className="px-[22px] py-[14px] text-[12px] rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white"
            placeholder="Medium link here..."
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col">
          <p className="text-sm font-semibold">Website</p>
          <input
            className="px-[22px] py-[14px] text-[12px] rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white"
            placeholder="Website link here..."
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <p className="text-sm font-semibold mt-4">
            Personalized invitation link
          </p>
          <input
            className="px-[22px] py-[14px] text-[12px] rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white"
            placeholder="Invitation link here..."
            value={`https://biples.netlify.app/r/${inviteLink}`}
            readOnly
          // onChange={(e) => setName(e.target.value)}
          />
          <div className="flex justify-center w-full">
            <GradientText
              size={12}
              value="Invite your friends with your invitation link"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-around items-center mt-4">
        <div
          className="flex items-center gap-2 text-sm font-semibold text-secondary cursor-pointer"
          onClick={() => setNetwork('eth')}
        >
          {network === 'eth' ? <Checked /> : <Unchecked />}
          <img className='aspect-square max-w-[38px]' src={ethImg} alt='' />
        </div>
        <div
          className="flex items-center gap-2 text-sm font-semibold text-secondary cursor-pointer"
          onClick={() => setNetwork('sol')}
        >
          {network === 'sol' ? <Checked /> : <Unchecked />}
          <img className='aspect-square max-w-[38px]' src={solImg} alt='' />
        </div>
      </div>
      <button
        onClick={handleCreate}
        className={`bg-gradient-to-r self-center from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6dd] hover:to-[#8E54E9dd] text-sm font-bold rounded-full text-white px-[60px] py-[8px] mt-6 flex items-center gap-2 ${loading && 'pointer-events-none'}`}
      >
        Create
        {loading && (
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
  )
}

export default CreateServer
