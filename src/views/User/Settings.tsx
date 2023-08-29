import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Checked, Unchecked } from 'components/Icon';
import { JwtService, MatrixService } from 'services';
import { RootState } from 'store';
import saveIcon from 'assets/images/save-icon.png';
import BackIcon from 'assets/images/back.png';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';
import QRCode from 'qrcode';
import ReactCodeInput from 'react-code-input';
import { useDispatch } from 'react-redux';
import { updateSuccess } from 'slices';
const props = {
  inputStyle: {
    fontFamily: 'monospace',
    borderRadius: '8px',
    fontSize: '16px',
    border: '1px solid #565A7F',
    padding: '12px',
    width: '40px',
    height: '40px',
  },
};

const UserSettings = () => {
  const { addToast } = useToasts();
  const userInfo = useSelector((state: RootState): any => state.auth.user);
  const [name, setName] = useState('');
  const [oldPassword, setOldPassword] = useState('public');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [language, setLanguage] = useState('');
  const [qrImage, setQRImage] = useState('');
  const [enabling, setEnabling] = useState(false);
  const [saving, setSaving] = useState(false);
  const [code, setCode] = useState('');
  const [socialLinks, setSocialLinks] = useState<any>();
  const [privateNoti, setPrivateNoti] = useState(false);
  const [smartNoti, setSmartNoti] = useState(false);
//   const mx = MatrixService.matrixClient;
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    if (userInfo.otp_auth_url) {
      QRCode.toDataURL(
        userInfo.otp_auth_url,
        (err: any, image_data: string) => {
          if (err) return;
          setQRImage(image_data);
        }
      );
    }
    if (userInfo) {
      setName(userInfo.userName);
      setSocialLinks({
        twitter: userInfo.twitter,
        facebook: userInfo.facebook,
        instagram: userInfo.instagram,
      });
      setSmartNoti(userInfo.smartNoti);
      setPrivateNoti(userInfo.privateNoti);
      setLanguage(userInfo.language);
    }
  }, [userInfo]); //eslint-disable-line
  const detectChange = () => {
    if (userInfo) {
      let changed = false;
      //   if (userInfo.userName !== name) changed = true;
      if (userInfo.twitter !== socialLinks?.twitter) changed = true;
      if (userInfo.facebook !== socialLinks?.facebook) changed = true;
      if (userInfo.instagram !== socialLinks?.instagram) changed = true;
      if (userInfo.language !== language) changed = true;
      if (userInfo.privateNoti !== privateNoti) changed = true;
      if (userInfo.smartNoti !== smartNoti) changed = true;
      // console.log()
      return changed;
    }
    return false;
  };

  const handleSave = async () => {
    setSaving(true);
    JwtService.updateUser({
      privateNoti,
      smartNoti,
      language,
      ...socialLinks,
    })
      .then((user: any) => {
        if (user) {
          dispatch(updateSuccess(user));
          addToast('Updated successfully', { appearance: 'success' });
        } else addToast('Something went wrong!', { appearance: 'error' });
        setSaving(false);
      })
      .catch((e: any) => {
        addToast(e.message ? e.message : JSON.stringify(e), {
          appearance: 'error',
        });
        setSaving(false);
      });
  };

  const Divider = () => (
    <div className="min-h-[1px] w-full bg-[#C3C3C3] dark:bg-primary mt-4"></div>
  );

  const handleEnable2FA = async () => {
    // disable
    console.log(code);
    setEnabling(true);
    setCode('');
    if (userInfo.otp_enabled) {
      const verified: any = await JwtService.validateOtp(code).catch((e) => {
        addToast(e, { appearance: 'error' });
        setEnabling(false);
        return;
      });
      if (verified) {
        const ret = await JwtService.disableOtp().catch((e) => {
          addToast(e, { appearance: 'error' });
          setEnabling(false);
          return;
        });
        if (ret) {
          addToast('Two-factor authentication is disabled successfully', {
            appearance: 'success',
          });
          dispatch(updateSuccess({ ...userInfo, otp_enabled: false }));
          setEnabling(false);
          return;
        }
        addToast('Something went wrong!', { appearance: 'error' });
        setEnabling(false);
      }
    } else {
      //enable
      const verified: any = await JwtService.validateOtp(code).catch((e) => {
        addToast(e, { appearance: 'error' });
        setEnabling(false);
        return;
      });
      if (verified) {
        const ret = await JwtService.generateOtp(false).catch((e) => {
          addToast(e, { appearance: 'error' });
          setEnabling(false);
          return;
        });
        if (ret) {
          addToast('Two-factor authentication is enabled successfully', {
            appearance: 'success',
          });
          dispatch(updateSuccess({ ...userInfo, otp_enabled: true }));
          setEnabling(false);
          return;
        }
        addToast('Something went wrong!', { appearance: 'error' });
        setEnabling(false);
      }
    }
  };

  return (
    <div className="flex-grow flex flex-col bg-white dark:bg-[#111111] shadow-sm gap-4 py-8 px-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800">
      <button
        className="border border-primary rounded-full self-start p-1"
        onClick={() => history.goBack()}
      >
        <img src={BackIcon} alt="" />
      </button>
      <div className="flex flex-col flex-grow items-start gap-2">
        <p className="text-2xl text-primary font-bold mb-8">Account Settings</p>
        <div className="px-10 flex flex-col xl:flex-row gap-10 w-full">
          <div className="flex flex-col items-start gap-2 w-full">
            <p className="text-sm font-bold text-secondary">Username</p>
            <input
              className="px-[22px] py-3.5 text-xs rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white w-full"
              placeholder="username here..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex-grow"></div>
          </div>
          <div className="flex flex-col items-start gap-2 w-full">
            <p className="text-sm font-bold text-secondary">Password</p>
            <input
              className="px-[22px] py-3.5 text-xs rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white w-full"
              placeholder="Old Password"
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              className="px-[22px] py-3.5 text-xs rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white w-full"
              placeholder="New Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="px-[22px] py-3.5 text-xs rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white w-full"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <Divider />
        <div className="px-10 flex flex-col xl:flex-row gap-10 w-full mt-4">
          <div className="flex flex-col items-start gap-2 w-full">
            <p className="text-sm font-bold text-secondary">Social networks</p>
            <p className="text-sm dark:text-white text-primary mt-3">Twitter</p>
            <input
              className="px-[22px] py-3.5 text-xs rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white w-full"
              placeholder="Twitter ..."
              value={socialLinks?.twitter ?? ''}
              onChange={(e) =>
                setSocialLinks({ ...socialLinks, twitter: e.target.value })
              }
            />
            <p className="text-sm dark:text-white text-primary mt-3">
              Facebook
            </p>
            <input
              className="px-[22px] py-3.5 text-xs rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white w-full"
              value={socialLinks?.facebook ?? ''}
              placeholder="Facebook ..."
              onChange={(e) =>
                setSocialLinks({ ...socialLinks, facebook: e.target.value })
              }
            />
            <p className="text-sm dark:text-white text-primary mt-3">
              Instagram
            </p>
            <input
              className="px-[22px] py-3.5 text-xs rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white w-full"
              value={socialLinks?.instagram ?? ''}
              placeholder="Instagram ..."
              onChange={(e) =>
                setSocialLinks({ ...socialLinks, instagram: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col items-start gap-2 w-full">
            <p className="text-sm font-bold text-secondary">Language</p>
            <div
              className="flex items-center gap-4 cursor-pointer mt-3"
              onClick={() => setLanguage('English')}
            >
              {language === 'English' ? <Checked /> : <Unchecked />}
              <p className="text-[13px] text-secondary font-semibold">
                English
              </p>
            </div>
            <div
              className="flex items-center gap-4 cursor-pointer mt-3"
              onClick={() => setLanguage('French')}
            >
              {language === 'French' ? <Checked /> : <Unchecked />}
              <p className="text-[13px] text-secondary font-semibold">French</p>
            </div>
            <div
              className="flex items-center gap-4 cursor-pointer mt-3"
              onClick={() => setLanguage('Russian')}
            >
              {language === 'Russian' ? <Checked /> : <Unchecked />}
              <p className="text-[13px] text-secondary font-semibold">
                Russian
              </p>
            </div>
          </div>
        </div>
        <Divider />
        <div className="px-10 flex flex-col xl:flex-row gap-10 w-full mt-4">
          <div className="w-full flex flex-col">
            <p className="text-sm font-bold text-secondary">Notifications</p>
            <div
              className="flex items-center gap-4 cursor-pointer mt-3"
              onClick={() => setPrivateNoti((value) => !value)}
            >
              {privateNoti ? <Checked /> : <Unchecked />}
              <p className="text-[13px] text-secondary font-semibold">
                Private messages
              </p>
            </div>
            <div
              className="flex items-center gap-4 cursor-pointer mt-3"
              onClick={() => setSmartNoti((value) => !value)}
            >
              {smartNoti ? <Checked /> : <Unchecked />}
              <p className="text-[13px] text-secondary font-semibold">
                If you don't come to a server for 3 days you won't receive any
                more notifications from that server
              </p>
            </div>
          </div>
        </div>

        {detectChange() && (
          <button
            onClick={handleSave}
            className="rounded-md py-2 px-6 self-center mt-8 bg-gradient-to-r from-[#4776E6] to-[#8E54E9] flex items-center text-sm text-white font-semibold gap-1"
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
        <div className="px-10 flex flex-col xl:flex-row gap-10 w-full mt-4">
          <div className="w-full flex flex-col">
            <p className="text-sm font-bold text-secondary">
              Two-factor Authentication
            </p>
            {!userInfo.otp_enabled && (
              <div className="w-full flex flex-col">
                <p className="text-sm dark:text-white text-primary mt-2">
                  Download and install Google Authenticator. Enable Two-factor
                  Authentication to protect your account from unauthorized
                  access.
                </p>
                <p className="text-sm dark:text-white text-primary mt-2">
                  Scan the QR code with your Google Authenticator App or enter
                  the secret key manually.
                </p>
              </div>
            )}
            <div className="flex-grow"></div>
            <p className="text-sm dark:text-white text-primary mt-4 mb-2">
              Verification code
            </p>
            <ReactCodeInput
              type="text"
              fields={6}
              name={'Enable 2FA'}
              inputMode="tel"
              value={code}
              onChange={(e) => setCode(e)}
              {...props}
            />
            <button
              onClick={handleEnable2FA}
              className="bg-gradient-to-r self-start from-[#4776E6] to-[#8E54E9] text-sm font-bold rounded-full text-white px-10 py-2 mt-3.5 flex items-center gap-2"
            >
              {userInfo.otp_enabled ? 'Disable' : 'Enable'}
              {enabling && (
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
          </div>

          {!userInfo.otp_enabled && (
            <div className="w-full flex flex-col items-start">
              {qrImage ? <img src={qrImage} alt="" /> : null}

              <p className="text-sm dark:text-white text-primary mt-4">
                Your secret key
              </p>
              {userInfo.otp_base32 ? (
                <span className="mt-2 px-[22px] py-3.5 text-xs rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white w-full">
                  {userInfo.otp_base32}
                </span>
              ) : null}
              <p className="text-sm dark:text-white text-primary mt-4">
                Write down this code, never reveal it to others. You can use it
                to regain access to your account if there is no access to the
                authenticator.
              </p>
            </div>
          )}
        </div>
        <Divider />
        <div className="px-10 flex flex-col xl:flex-row xl:justify-end xl:items-center w-full mt-4 gap-6">
          <p className="text-sm font-bold text-secondary">
            Delete your account
          </p>
          <button className="text-white rounded-md font-bold px-8 py-2 bg-red-500 hover:bg-red-400">
            Delete permanently
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
