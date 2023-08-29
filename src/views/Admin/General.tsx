import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import Avatar from 'components/Avatar';
import GradientText from 'components/GradientText';
import { Checked, Unchecked } from 'components/Icon';
import { JwtService, MatrixService } from 'services';
import { RootState } from 'store';
import colorMXID from 'utils/colorMXID';
import { uploadFile } from 'utils/common';
import saveIcon from 'assets/images/save-icon.png';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';
import { selectRoom } from 'action/navigation';
import {
  getServersSuccess,
  loadingServerAction,
  selectCommunity,
} from 'slices';
import { useDispatch } from 'react-redux';

const General = () => {
  const [imgBack, setImgBack] = useState<Record<any, any>>({
    url: '',
    name: '',
  });
  const [uploading, setUploading] = useState<boolean>(false);
  const [saving, setSaving] = useState(false);

  const { addToast } = useToasts();
  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      multiple: false,
      accept: { 'image/*': [] },
      onDropAccepted: async (files) => {
        const image = files[0];
        const baseUrl = await uploadFile(image);
        if (baseUrl === '') {
          addToast("The image can't be uploaded!", { appearance: 'error' });
          return;
        }
        setImgBack({
          url: baseUrl,
          name: image.name,
        });
      },
    });
  const roomInfo = useSelector(
    (state: RootState): any => state.community.current
  );
  const userInfo = useSelector((state: RootState): any => state.auth.user);
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [avatarSrc, setAvatarSrc] = useState('');
  const [description, setDescription] = useState('');
  const [access, setAccess] = useState('public');
  const [twitter, setTwitter] = useState('');
  const [medium, setMedium] = useState('');
  const [website, setWebsite] = useState('');
  const mx = MatrixService.matrixClient;
  const history = useHistory();
  const dispatch = useDispatch();
  const detectChange = () => {
    if (roomInfo) {
      let changed = false;
      if (roomInfo.serverName !== name) changed = true;
      if (roomInfo.description !== description) changed = true;
      if (roomInfo.access !== access) changed = true;
      if (roomInfo.background !== imgBack.url) changed = true;
      if (roomInfo.twitter !== twitter) changed = true;
      if (roomInfo.medium !== medium) changed = true;
      if (roomInfo.website !== website) changed = true;
      // console.log()
      return changed;
    }
    return false;
  };
  useEffect(() => {
    const room = mx?.getRoom(roomInfo?.roomId);
    if (roomInfo) {
      setDescription(roomInfo.description);
    }
    if (room) {
      const _avatarSrc = room.getAvatarUrl(
        mx?.baseUrl as string,
        120,
        120,
        'crop'
      );
      setAccess(roomInfo.access);
      setAvatarSrc(_avatarSrc as string);
      setName(room.name);
      setRoomId(room.roomId);
      setImgBack({
        url: roomInfo.background,
        name: '',
      });
      setTwitter(roomInfo.twitter);
      setMedium(roomInfo.medium);
      setWebsite(roomInfo.website);
    }
  }, [roomInfo]); //eslint-disable-line
  const handleUpload = async (e: any) => {
    if (e) setUploading(true);
    const url = await uploadFile(e ? e.target.files.item(0) : null);
    // console.log(url)
    await mx?.sendStateEvent(
      roomId,
      'm.room.avatar',
      { url: url ? url : null },
      ''
    );
    setAvatarSrc(mx?.mxcUrlToHttp(url as string, 120, 120, 'crop') as string);
    setUploading(false);
  };
  const handleSave = async () => {
    setSaving(true);
    const ret = await JwtService.updateServer({
      id: roomInfo._id,
      name,
      description,
      access,
      background: imgBack.url,
      twitter,
      medium,
      website,
    }).catch((e) => {
      addToast(e, { appearance: 'error' });
      setSaving(false);
    });
    setSaving(false);
    if (ret) {
      dispatch(selectCommunity(ret));
      return addToast('Updated successfully', { appearance: 'success' });
    }
    addToast('Something went wrong!', { appearance: 'error' });
  };
  const handleDeleteServer = async () => {
    const ret = await JwtService.deleteServer(roomInfo._id).catch((e) => {
      addToast(e, { appearance: 'error' });
    });
    if (ret) {
      dispatch(selectCommunity(null));
      selectRoom('');
      history.push('/chat');
      addToast('Server is deleted successfully', { appearance: 'success' });
      dispatch(loadingServerAction(true));
      JwtService.getServersByUser(userInfo.id)
        .then((res: any) => {
          dispatch(getServersSuccess(res));
        })
        .catch((e: any) => {
          console.log(e);
          dispatch(loadingServerAction(false));
        });
    } else addToast('Something went wrong!', { appearance: 'error' });
  };
  const Divider = () => (
    <div className="min-h-[1px] w-full bg-[#C3C3C3] dark:bg-primary mt-4"></div>
  );

  return (
    <div className="flex-grow flex flex-col bg-white dark:bg-[#111111] shadow-sm gap-9 py-8 px-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800">
      <div className="flex flex-col flex-grow items-start gap-2">
        <p className="text-2xl text-primary font-bold mb-8 dark:text-white">
          General Settings
        </p>
        <div className="px-10 flex flex-col xl:flex-row gap-10 w-full">
          <div className="flex gap-8 w-full justify-center items-center">
            <div className="flex flex-col items-center gap-2">
              <Avatar
                imageSrc={avatarSrc}
                text={name}
                bgColor={roomId ? colorMXID(roomId) : 'tranparent'}
                size="large"
              />
              <button
                onClick={() => handleUpload(null)}
                className="text-secondary font-semibold px-4 py-2 rounded-lg hover:bg-[#F3F3F5]"
              >
                Remove
              </button>
            </div>
            <div className="flex flex-col items-start gap-3">
              <label className={`flex`}>
                <div className="cursor-pointer bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-sm font-bold rounded-full text-white px-5 py-2 mt-4 flex items-center gap-1 hover:from-[#4776E6E0] hover:to-[#8E54E9E0]">
                  Upload Image
                  {uploading && (
                    <div className="flex justify-center w-4 h-4">
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
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleUpload}
                  accept="image/*"
                />
              </label>
              <p className="text-sm dark:text-white text-primary">
                We recommend an image of at least 512&#10006;512px
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 w-full">
            <p className="text-sm font-bold text-secondary">
              Name of the Community
            </p>
            <input
              className="px-[22px] py-3.5 text-xs rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white w-full"
              placeholder="Community name here..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <Divider />
        <div className="px-10 flex flex-col xl:flex-row gap-10 w-full">
          <div className="flex flex-col xl:flex-row w-full mt-4 gap-6">
            <div className="flex flex-col w-full gap-2">
              <p className="text-sm font-bold text-secondary">
                Background Banner
              </p>
              <div className="w-full">
                {!imgBack.url ? (
                  <img
                    className="aspect-video object-cover rounded-lg"
                    src={mx?.mxcUrlToHttp(imgBack.url) as string}
                    alt=""
                  />
                ) : (
                  <div className="container w-full bg-[#F3F3F5] dark:bg-[#1F1F22] rounded-lg">
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div
                        className={`w-full min-h-[90px] justify-center cursor-pointer px-[22px] py-[18px] rounded-lg  flex flex-col items-center ${
                          isDragAccept
                            ? 'border-[#00e676]'
                            : isDragReject
                            ? 'border-[#ff1744]'
                            : ''
                        }`}
                      >
                        <GradientText
                          value={
                            'Drag and drop file here, or click to select file'
                          }
                          size={14}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm dark:text-white text-primary">
                This image will appear when a member wants to join your channel
                via an invitation link
              </p>
            </div>
          </div>
          <div className="flex flex-col xl:flex-row w-full mt-4 gap-6">
            <div className="flex flex-col w-full gap-2">
              <p className="text-sm font-bold text-secondary">Description</p>
              <textarea
                className="px-[22px] py-[18px] text-xs rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white min-h-[90px] w-full"
                placeholder="Description here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-sm dark:text-white text-primary">
                Present the community to the world
              </p>
            </div>
          </div>
        </div>
        <Divider />
        <div className="px-10 flex flex-col xl:flex-row w-full mt-4 gap-10">
          <div className="flex flex-col w-full gap-1">
            <p className="text-sm font-bold text-secondary">Official Links</p>
            <p className="text-sm dark:text-white text-primary mt-3">Twitter</p>
            <input
              className="px-[22px] py-3.5 text-xs rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white w-full mt-0.5"
              placeholder="Twitter link here..."
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
            />
            <p className="text-sm dark:text-white text-primary mt-3">Medium</p>
            <input
              className="px-[22px] py-3.5 text-xs rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white w-full mt-0.5"
              placeholder="Medium link here..."
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
            />
            <p className="text-sm dark:text-white text-primary mt-3">Website</p>
            <input
              className="px-[22px] py-3.5 text-xs rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white w-full mt-0.5"
              placeholder="Website link here..."
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col gap-4">
            <p className="text-sm font-bold text-secondary">Access</p>
            <p className="text-sm dark:text-white text-primary">
              Decide who can join your community
            </p>
            <div className="flex flex-col items-start gap-3 w-full">
              <div
                className="flex w-full items-center gap-2 text-sm font-semibold text-secondary cursor-pointer"
                onClick={() => setAccess('private')}
              >
                {access === 'private' ? <Checked /> : <Unchecked />}
                {access === 'private' ? (
                  <GradientText value="Private" size={14} />
                ) : (
                  <p>Private</p>
                )}
              </div>
              <p className="text-sm dark:text-white text-primary">
                (With invitation)
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 w-full">
              <div
                className="flex w-full items-center gap-2 text-sm font-semibold text-secondary cursor-pointer"
                onClick={() => setAccess('public')}
              >
                {access === 'public' ? <Checked /> : <Unchecked />}
                {access === 'public' ? (
                  <GradientText value="Public" size={14} />
                ) : (
                  <p>Public</p>
                )}
              </div>
              <p className="text-sm dark:text-white text-primary">
                (Everyone can find your channel)
              </p>
            </div>
          </div>
        </div>
        {/* <Divider />
        <div className="px-10 flex flex-col w-full mt-4">
          
        </div> */}
        {detectChange() && (
          <button
            onClick={handleSave}
            className="rounded-md self-center py-2 px-6 bg-gradient-to-r from-[#4776E6] to-[#8E54E9] flex items-center text-sm text-white font-semibold gap-1 mt-4"
          >
            <img
              className="aspect-square max-w-5 invert"
              src={saveIcon}
              alt="save"
            />
            <p>Save Changes</p>
            {saving && (
              <div className="flex justify-center w-4 h-4">
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
        )}
        <Divider />
        <div className="px-10 flex flex-col xl:flex-row w-full mt-4 gap-6">
          <div className="flex flex-col w-full gap-1 items-start">
            <p className="text-sm font-bold text-secondary">Invite Link</p>
            <div className="text-sm w-full flex flex-col xl:flex-row font-semibold text-primary bg-gradient-to-r from-[#4776E61A] to-[#8E54E91A] rounded-lg px-[18px] py-3 gap-2">
              <label className="py-2 px-3 bg-white dark:bg-[#111111] placeholder:italic text-primary dark:text-white rounded-md text-sm w-full cursor-text">
                {roomInfo?.inviteLink ?? ''}
              </label>
              <div className="flex gap-2 flex-col xl:flex-row">
                <button className="w-full min-w-[120px] text-white rounded-md font-bold px-4 py-2 bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6E0] hover:to-[#8E54E9E0]">
                  Copy link
                </button>
                <button className="w-full min-w-[120px] text-white rounded-md font-bold px-4 py-2 bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6E0] hover:to-[#8E54E9E0]">
                  Share link
                </button>
              </div>
            </div>
          </div>
        </div>
        <Divider />
        <div className="px-10 flex flex-col xl:flex-row xl:justify-end xl:items-center w-full mt-4 gap-6">
          <p className="text-sm font-bold text-secondary">
            Delete your channel
          </p>
          <button
            onClick={handleDeleteServer}
            className="text-white rounded-md font-bold px-8 py-2 bg-red-500 hover:bg-red-400"
          >
            Delete permanently
          </button>
        </div>
      </div>
    </div>
  );
};

export default General;
