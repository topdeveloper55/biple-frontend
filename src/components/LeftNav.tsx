import { useState, useRef, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Link, useLocation } from 'react-router-dom';
import logo_dark from 'assets/images/logos/logo_text_dark.png';
import logo_light from 'assets/images/logos/logo_text_light.png';
import GradientText from './GradientText';
import { adminMenuData, menuData } from 'constant/index';
import mode from 'assets/images/mode.png';
import dark from 'assets/images/dark.png';
import light from 'assets/images/light.png';
import SettingsIcon from 'assets/images/settings.png';

import Dropdown from './Dropdown';
import { Checked, MailIcon, Unchecked } from './Icon';
import { useTotalInvites } from 'hook/useTotalInvites';
import { selectRoom } from 'action/navigation';
import Avatar from './Avatar';
import { JwtService, MatrixService } from 'services';
import colorMXID from 'utils/colorMXID';
import { useToasts } from 'react-toast-notifications';
import { selectCommunity, updateSuccess } from 'slices';
import { useDispatch } from 'react-redux';
import { injectedConnector } from 'wallet';
import { useNfts } from 'hook/useNfts';
import ProfileNFTCard from './ProfileNFTCard';
import RawIcon from './RawIcon';
import VerticalMenuIC from 'assets/ic/outlined/out.png';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const types = [
  {
    value: 'mynft',
    label: 'My NFTs',
  },
  {
    value: 'allnft',
    label: 'All NFTs',
  },
];
interface Props {
  index: number;
  setIndex: (i: number) => void;
}
// const menuItems = ['Rules', 'About']

function Sidenav({ index, setIndex }: Props) {
  const { pathname } = useLocation();
  const { account, activate } = useWeb3React();
  const userData = useSelector((state: RootState) => state.auth.user);
  const [nfts] = useNfts(account ? account : '', 10);
  const [theme, setTheme] = useState('dark');
  const [type, setType] = useState(types[0]);
  const [totalInvites, totalUnreads] = useTotalInvites();
  const mx = MatrixService.matrixClient;
  const user = mx?.getUser(mx?.getUserId() as string);
  const [avatarSrc, setAvatarSrc] = useState(
    user?.avatarUrl ? mx?.mxcUrlToHttp(user.avatarUrl, 80, 80, 'crop') : null
  );
  const uploadImageRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [options, setOptions] = useState({
    visible: true,
    alerted: false,
  });
  useEffect(() => {
    console.log(account, userData.walletAddress, 'hhh');
    if (userData) {
      console.log(userData);
      setOptions({ visible: userData.showNft, alerted: userData.getAlerted });
    }
    if (account) {
      if (account === userData.walletAddress) return;
      if (userData.walletAddress === '') {
        updateWallet(account);
        return;
      }
    }
  }, [account, userData]);
  const updateWallet = async (address: string) => {
    JwtService.updateUser({ walletAddress: address })
      .then((user: any) => {
        if (user) {
          dispatch(updateSuccess(user));
          addToast('Your wallet address is updated successfully', {
            appearance: 'success',
          });
        } else addToast('Something went wrong!', { appearance: 'error' });
      })
      .catch((e: any) => {
        addToast(e.message ? e.message : JSON.stringify(e), {
          appearance: 'error',
        });
      });
  };
  const handleConnect = async () => {
    await activate(injectedConnector, (error) => {
      if (error.name === 'UnsupportedChainIdError')
        addToast(
          'You have selected invalid network. Please select Ethereum mainnet.',
          { appearance: 'warning' }
        );
    });
  };
  const handleOptionChange = (data: any) => {
    JwtService.updateUser(data)
      .then((user: any) => {
        if (user) {
          dispatch(updateSuccess(user));
        } else addToast('Something went wrong!', { appearance: 'error' });
      })
      .catch((e: any) => {
        addToast(e.message ? e.message : JSON.stringify(e), {
          appearance: 'error',
        });
      });
  };
  useEffect(() => {
    handleConnect();
  }, []);

  const handleMode = () => {
    setTheme((value) => (value === 'dark' ? 'light' : 'dark'));
    const html = document.querySelector('html');
    if (theme !== 'dark') html?.classList.add('dark');
    else html?.classList.remove('dark');
  };
  const toHome = () => {
    dispatch(selectCommunity(null));
    selectRoom('');
  };
  const handleUpload = async (e: any) => {
    if (e === null) {
      mx?.setAvatarUrl('');
      setAvatarSrc(null);
    } else {
      const file = e.target.files.item(0);
      if (file === null) return;
      try {
        const uPromise = mx?.uploadContent(file, { onlyContentUri: false });
        const res = await uPromise;
        if (typeof res?.content_uri === 'string') {
          mx?.setAvatarUrl(res.content_uri);
          setAvatarSrc(mx?.mxcUrlToHttp(res.content_uri, 80, 80, 'crop'));
        }
      } catch (e: any) {
        addToast(e.message ? e.message : JSON.stringify(e));
      }
    }
    // uploadImageRef.current.value = null;
  };
  const renderNfts = (nfts: any) => {
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
  // useEffect(() => {
  //   JwtService.validateOtp('523635')
  // }, [])
  const renderSidebar = () => (
    <>
      <div className="flex min-h-screen flex-col min-w-[315px] max-w-[315px] bg-white dark:bg-[#111111] shadow-sm">
        <div className="flex items-center w-full justify-start px-[35px]">
          <div className="flex justify-center w-full px-[20px] border-b border-b-[#697A8D66] h-20 items-center">
            <Link onClick={toHome} to="/home">
              <img
                className="max-w-[170px] hidden dark:block"
                src={logo_dark}
                alt="logo"
              />
              <img
                className="max-w-[170px] dark:hidden"
                src={logo_light}
                alt="logo"
              />
            </Link>
          </div>
        </div>
        <div className="flex flex-col py-[26px] gap-[18px] flex-grow max-h-[calc(100vh-80px)]">
          <div className="flex justify-between items-center px-[35px]">
            <p className="text-primary text-sm font-semibold dark:text-white">
              My Profile
            </p>
            <Link to="/user/settings">
              <RawIcon size={20} src={SettingsIcon} isImage={false} />
            </Link>
          </div>
          <div className="flex flex-col items-center w-full px-[35px]">
            <div className="flex items-center justify-center group rounded-full relative">
              <Avatar
                imageSrc={avatarSrc}
                text={user?.displayName}
                bgColor={user?.userId ? colorMXID(user?.userId) : 'tranparent'}
                size="large"
              />
              {avatarSrc !== null && (
                <button
                  onClick={() => handleUpload(null)}
                  className="transition-all absolute rounded-full top-0 left-0 w-full h-full bg-[#00000088] text-white text-sm font-bold group-hover:opacity-100 opacity-0"
                >
                  Remove
                </button>
              )}
            </div>
            <label className={`flex`}>
              <p className="text-[15px] mt-2 text-secondary hover:text-primary cursor-pointer">
                Change your avatar
              </p>
              <input
                ref={uploadImageRef}
                type="file"
                className="hidden"
                onChange={handleUpload}
                accept="image/*"
              />
            </label>
          </div>
          <div className="flex flex-col w-full px-[35px]">
            <Dropdown
              id="type"
              current={type}
              onChange={setType}
              options={types}
            />
          </div>
          <div className="flex flex-col px-[35px] flex-grow gap-[12px] overflow-y-auto text-[#a6aacf] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800">
            {account !== undefined ? (
              <div className="flex flex-col gap-[18px]">
                <div className="grid grid-cols-3 gap-[4px]">
                  {renderNfts(nfts)}
                </div>
                <button className="text-white rounded-xl -my-2 py-2 px-6 bg-gradient-to-r from-[#4776E6] to-[#8E54E9] self-center text-[13px] font-semibold hover:from-[#4776E6E0] hover:to-[#8E54E9E0]">
                  Refresh
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={handleConnect}
                  className="text-white rounded-xl py-2 px-6 bg-gradient-to-r from-[#4776E6] to-[#8E54E9] self-center text-[13px] font-semibold"
                >
                  Connect Wallet
                </button>
              </div>
            )}
            <div className="bg-[#697A8D66] min-h-[1px] w-full my-1.5"></div>
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => handleOptionChange({ showNft: !options.visible })}
            >
              {options.visible ? <Checked /> : <Unchecked />}
              <p className="text-[13px] text-secondary font-semibold">
                My NFTs are visible to everyone
              </p>
            </div>
            <div className="bg-[#697A8D66] min-h-[1px] w-full my-1.5"></div>
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() =>
                handleOptionChange({ getAlerted: !options.alerted })
              }
            >
              {options.alerted ? <Checked /> : <Unchecked />}
              <p className="text-[13px] text-secondary font-semibold">
                Be alerted to purchase offers received
              </p>
            </div>
          </div>
          <div className="flex flex-col px-[35px] gap-[12px] ">
            <div className="bg-[#697A8D66] min-h-[1px] w-full"></div>
            {/* Dark mode toggler */}
            {/* <button
              onClick={handleMode}
              className="flex gap-6 items-center text-[22px] text-primary font-[600]"
            >
              <div className="min-w-[24px] flex justify-center">
                <img src={mode} alt="" />
              </div>
              <div className="flex justify-between flex-grow gap-2">
                <p>{theme === 'dark' ? 'Dark' : 'Light'} Mode</p>
                <div className="flex rounded-full bg-[#F3F3F5] dark:bg-[#1F1F22] p-[4px]">
                  <div
                    className={`rounded-full w-[26px] h-[26px] flex justify-center items-center ${
                      theme === 'light'
                        ? 'bg-white dark:bg-[#111111]'
                        : 'bg-transparent'
                    }`}
                  >
                    <img src={light} alt="" />
                  </div>
                  <div
                    className={`rounded-full w-[26px] h-[26px] flex justify-center items-center ${
                      theme === 'dark'
                        ? 'bg-white dark:bg-[#111111]'
                        : 'bg-transparent'
                    }`}
                  >
                    <img src={dark} alt="" />
                  </div>
                </div>
              </div>
            </button> */}
            {/* Private messages */}
            <Link
              onClick={() => pathname !== '/private' && selectRoom('')}
              to={'/private'}
              className={`bg-gradient-to-r ${
                pathname !== '/private'
                  ? 'dark:bg-[#1F1F22] hover:bg-[#e3e3e5] dark:hover:bg-[#222233] from-[#4776E619] to-[#8E54E919]'
                  : 'from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6E0] hover:to-[#8E54E9E0]'
              } rounded-xl py-[8px] px-[12px] flex gap-4 items-center justify-center w-full relative`}
              // type="button"
            >
              <MailIcon />
              {pathname === '/private' ? (
                <p className="text-[14px] text-white font-[600]">
                  Private messages
                </p>
              ) : (
                <GradientText size={14} value="Private messages" />
              )}
              {totalInvites + totalUnreads > 0 && (
                <div className="absolute right-4 -top-2">
                  <span className="relative flex w-5 h-5">
                    <span className="absolute inline-flex w-full h-full bg-[#4776E6dd] rounded-full opacity-75 animate-ping"></span>
                    <span className="relative flex justify-center items-center rounded-full h-5 w-5 bg-gradient-to-r from-[#4776E6] to-[#8E54E9] border-2 border-white">
                      <p className="text-white text-[8px]">
                        {totalInvites + totalUnreads}
                      </p>
                    </span>
                  </span>
                </div>
              )}
            </Link>
            <div className="flex gap-3 items-center justify-between">
              <button className="w-full flex items-center gap-1 justify-center hover:bg-[#E3E3E5] dark:hover:bg-[#2F2F33] text-[15px] rounded-xl text-secondary font-semibold px-[12px] py-[6px] bg-[#F3F3F5] dark:bg-[#1F1F22]">
                Disconnect
                <RawIcon size={18} src={VerticalMenuIC} isImage={false} />
              </button>
              <div
                className="flex rounded-xl bg-[#F3F3F5] dark:bg-[#1F1F22] hover:bg-[#e3e3e5] dark:hover:bg-[#2F2F33] p-[4px] cursor-pointer"
                onClick={handleMode}
              >
                <div
                  className={`rounded-full w-[26px] h-[26px] flex justify-center items-center ${
                    theme === 'light'
                      ? 'bg-white dark:bg-[#111111]'
                      : 'bg-transparent'
                  }`}
                >
                  <img src={light} alt="" />
                </div>
                <div
                  className={`rounded-full w-[26px] h-[26px] flex justify-center items-center ${
                    theme === 'dark'
                      ? 'bg-white dark:bg-[#111111]'
                      : 'bg-transparent'
                  }`}
                >
                  <img src={dark} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  const renderSaleSidebar = () => (
    <>
      <div className="flex min-h-screen max-h-screen flex-col min-w-[315px] max-w-[315px] bg-white dark:bg-[#111111] overflow-hidden shadow-sm">
        <div className="flex items-center w-full justify-start px-[35px]">
          <div className="flex justify-center w-full px-[20px] border-b border-b-[#697A8D66] h-20 items-center">
            <Link onClick={() => dispatch(selectCommunity(null))} to="/home">
              <img
                className="max-w-[170px] hidden dark:block"
                src={logo_dark}
                alt="logo"
              />
              <img
                className="max-w-[170px] dark:hidden"
                src={logo_light}
                alt="logo"
              />
            </Link>
          </div>
        </div>
        <ul className="flex flex-col my-[60px] px-[35px] py-[20px] gap-[80px] font-semibold overflow-y-auto text-[#a6aacf] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800">
          {menuData.map((menu) =>
            menu.type === 'item' ? (
              <Link
                key={menu.label}
                to={menu.path as string}
                className={`rounded-md flex gap-6 p-2 items-center text-[22px] ${
                  pathname === menu.path
                    ? 'bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white'
                    : 'text-primary'
                }`}
              >
                <div className="min-w-[24px] flex justify-center">
                  <img
                    className={
                      pathname === menu.path ? 'brightness-0 invert' : undefined
                    }
                    src={menu.icon}
                    alt=""
                  />
                </div>
                <p>{menu.label}</p>
              </Link>
            ) : (
              <div key={menu.label} className="flex flex-col gap-[8px]">
                <p className="border-b border-[#697A8D66] py-[8px] text-secondary text-[15px] mb-2">
                  {menu.label}
                </p>
                {menu.children?.map((submenu) => (
                  <Link
                    key={submenu.label}
                    to={submenu.path}
                    className={`rounded-md flex gap-6 p-2 items-center text-[22px] ${
                      pathname === submenu.path
                        ? 'bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white'
                        : 'text-primary'
                    }`}
                  >
                    <div className="min-w-[24px] flex justify-center">
                      <img
                        className={
                          pathname === submenu.path
                            ? 'brightness-0 invert'
                            : undefined
                        }
                        src={submenu.icon}
                        alt=""
                      />
                    </div>
                    <p>{submenu.label}</p>
                  </Link>
                ))}
              </div>
            )
          )}
        </ul>
        <div className="px-[35px] flex w-full items-center">
          <button
            onClick={handleMode}
            className="flex gap-6 items-center text-[22px] text-primary font-[600]"
          >
            <div className="min-w-[24px] flex justify-center">
              <img src={mode} alt="" />
            </div>
            <div className="flex justify-between flex-grow gap-2">
              <p>{theme === 'dark' ? 'Dark' : 'Light'} Mode</p>
              <div className="flex rounded-full bg-[#F3F3F5] dark:bg-[#1F1F22] p-[4px]">
                <div
                  className={`rounded-full w-[26px] h-[26px] flex justify-center items-center ${
                    theme === 'light'
                      ? 'bg-white dark:bg-[#111111]'
                      : 'bg-transparent'
                  }`}
                >
                  <img src={light} alt="" />
                </div>
                <div
                  className={`rounded-full w-[26px] h-[26px] flex justify-center items-center ${
                    theme === 'dark'
                      ? 'bg-white dark:bg-[#111111]'
                      : 'bg-transparent'
                  }`}
                >
                  <img src={dark} alt="" />
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
  const renderAdminSidebar = () => {
    return (
      // My wallet menu items
      <>
        <div className="flex min-h-screen flex-col min-w-[315px] max-w-[315px] bg-white dark:bg-[#111111] overflow-hidden px-[35px] shadow-sm">
          <div className="flex items-center w-full justify-center h-20 border-b border-b-[#697A8D66] px-[20px]">
            <Link onClick={() => dispatch(selectCommunity(null))} to="/home">
              <img
                className="max-w-[170px] hidden dark:block"
                src={logo_dark}
                alt="logo"
              />
              <img
                className="max-w-[170px] dark:hidden"
                src={logo_light}
                alt="logo"
              />
            </Link>
          </div>
          <ul className="flex flex-col gap-4 py-8">
            {adminMenuData.map((item) => (
              <li className="relative" key={item.path}>
                <Link
                  to={item.path}
                  className={`px-[42px] py-[8px] bg-gradient-to-r hover:from-[#4776E644] hover:to-[#8E54E944] ${
                    pathname === item.path
                      ? 'from-[#4776E6] to-[#8E54E9]'
                      : 'from-[#4776E619] to-[#8E54E919]'
                  } flex flex-row items-center justify-center -skew-x-[24deg] cursor-pointer`}
                >
                  <div className="skew-x-[24deg]">
                    {pathname === item.path ? (
                      <p className="text-sm text-white font-semibold">
                        {item.label}
                      </p>
                    ) : (
                      <GradientText size={14} value={item.label} />
                    )}
                  </div>
                </Link>
                {item.newFeature && (
                  <div className="absolute right-0 -top-2">
                    <span className="relative flex w-10 h-5">
                      <span className="absolute inline-flex w-full h-full bg-[#4776E6dd] rounded-full opacity-75 animate-ping"></span>
                      <span className="relative flex justify-center items-center rounded-full h-5 w-10 bg-gradient-to-r from-[#4776E6] to-[#8E54E9] border-2 border-white dark:border-[#333333]">
                        <p className="text-white text-[10px] font-bold">NEW</p>
                      </span>
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  };
  if (pathname.includes('/sale'))
    // Munu bar
    return renderSaleSidebar();
  if (pathname.includes('/admin')) return renderAdminSidebar();
  if (pathname.includes('/auth') || pathname === '/connect') return null;
  //Profie
  return renderSidebar();
}

export default Sidenav;
