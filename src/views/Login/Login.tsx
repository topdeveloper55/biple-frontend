// import manLeft from 'assets/images/man_left.png'
// import manRight from 'assets/images/man_right.png'
import logo_dark from 'assets/images/logos/logo_text_dark.png';
import logo_light from 'assets/images/logos/logo_text_light.png';
import GradientText from 'components/GradientText';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { JwtService, MatrixService } from 'services';
import { useDispatch } from 'react-redux';
import {
  actionPending,
  loginFailed,
  loginSuccess,
  selectCommunity,
} from 'slices';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { getBaseUrl } from 'utils/matrixUtil';
import * as auth from 'action/auth';
import { initRoomListListener } from 'event/roomList';
import { useToasts } from 'react-toast-notifications';
import { useStore } from 'hook/useStore';
import { join } from 'action/room';

const baseUrl = 'https://hwsrv-1001623.hostwindsdns.com';

function normalizeUsername(rawUsername: string) {
  const noLeadingAt =
    rawUsername.indexOf('@') === 0 ? rawUsername.substr(1) : rawUsername;
  return noLeadingAt.trim();
}

const Login = () => {
  const { addToast } = useToasts();
  const history = useHistory();
  const { state } = useLocation<string>();
  const { accessToken, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const mountStore = useStore();
  const signInMatrix = async () => {
    let userBaseUrl = baseUrl;
    let username = email;
    const mxIdMatch = username.match(/^@(.+):(.+\..+)$/);
    if (mxIdMatch) {
      [, username, userBaseUrl] = mxIdMatch;
      userBaseUrl = await getBaseUrl(userBaseUrl);
    }
    return await auth.login(
      userBaseUrl,
      normalizeUsername(username),
      undefined,
      password
    );
  };
  const handleSignin = async () => {
    if (email === '' || password === '')
      return addToast('Fill the empty fields!', { appearance: 'error' });

    dispatch(actionPending(true));
    const res = await signInMatrix().catch((e) => {
      let msg = e.message;
      if (msg === 'Unknown message') msg = 'Please check your credentials';
      addToast(msg, { appearance: 'error' });
    });
    if (res === undefined) {
      return dispatch(actionPending(false));
    }
    MatrixService.init(res);
    MatrixService.once('init_loading_finished', () => {
      // clearInterval(iId);
      // initHotkeys();
      initRoomListListener(MatrixService.roomList);
      // changeLoading(false);
      JwtService.signIn(email, password, state ? state : '')
        .then(async (userData: any) => {
          addToast('Signed in successfully!', { appearance: 'success' });
          if (userData.community) {
            const focus = userData.community;
            mountStore.setItem(true);
            const alias = focus.roomId;
            const announcement = focus.announcement;
            try {
              await join(announcement, false, undefined);
              await join(alias, false, undefined);
              if (!mountStore.getItem()) return;
              JwtService.joinServer({
                communityId: focus._id,
              })
                .then((res: any) => {
                  addToast('Joined community successfully!', {
                    appearance: 'success',
                  });
                  dispatch(selectCommunity(focus));
                  dispatch(loginSuccess({ userData }));
                })
                .catch((e: any) => {
                  addToast(e.message ? e.message : JSON.stringify(e), {
                    appearance: 'error',
                  });
                  dispatch(loginSuccess({ userData }));
                });
            } catch {
              dispatch(loginSuccess({ userData }));
              if (!mountStore.getItem()) return;
              addToast(
                `unable to find community with ${alias}. Either community is private or doesn't exist`,
                { appearance: 'error' }
              );
              // console.log(`unable to find room/space with ${alias}. Either room/space is private or doesn't exist`)
            }
          } else return dispatch(loginSuccess({ userData }));
        })
        .catch((error) => {
          addToast(error.message ? error.message : error, { appearance: 'error' });
          console.log('error in login', error);
          return dispatch(loginFailed(error));
        });
    });
  };
  const handleKeyDown = async (e: any) => {
    if (e.keyCode === 13) {
      await handleSignin();
    }
  };
  useEffect(() => {
    if (accessToken) history.push('/home');
  }, [accessToken, history]);
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      {/* <img className="hidden min-w-0 lg:block" src={manLeft} alt="" /> */}
      <div className="bg-white dark:bg-[#111111] shadow-sm gap-2 flex flex-col text-primary font-[600] sm:px-[140px] sm:py-[90px] sm:min-w-[630px] min-w-full h-full sm:h-auto px-8 py-16">
        <div className="flex justify-center border-b border-[#697A8D66] py-[18px]">
          <img
            className="min-h-[50px] hidden dark:block"
            src={logo_dark}
            alt="logo"
          />
          <img
            className="min-h-[50px] dark:hidden"
            src={logo_light}
            alt="logo"
          />
        </div>
        <p className="text-sm mt-10">User Name</p>
        <input
          className="px-[22px] py-3.5 text-xs dark:text-white rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic"
          placeholder="User name here..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="text-sm mt-3.5">Password</p>
        <input
          className="px-[22px] py-3.5 text-xs dark:text-white rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic"
          placeholder="Password here..."
          type="password"
          value={password}
          onKeyDown={handleKeyDown}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end w-full">
          <GradientText size={11} value="Forgot your password?" />
        </div>
        <button
          onClick={handleSignin}
          className="bg-gradient-to-r self-center from-[#4776E6] to-[#8E54E9] text-sm font-bold rounded-full text-white px-10 py-2 mt-3.5 flex items-center gap-2"
        >
          Sign in
          {loading && (
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
        <div className="w-full flex justify-center gap-1 mt-3.5">
          <p className="text-[13px]">Need an account?</p>
          <Link to={{ pathname: '/auth/register', state }}>
            <GradientText size={13} value="Registration" />
          </Link>
        </div>
      </div>
      {/* <img className="hidden min-w-0 lg:block" src={manRight} alt="" /> */}
      <div className="fixed sm:right-[35px] bottom-4 flex gap-3 text-xs text-primary justify-center">
        <p className="text-secondary">@Biples 2022. All Rights Reserved.</p>
        <a className="underline" href="/#">
          Privacy Policy
        </a>
        <a className="underline" href="/#">
          Cookie Policy Policy
        </a>
      </div>
    </div>
  );
};

export default Login;
