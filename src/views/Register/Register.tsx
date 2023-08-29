// import manLeft from 'assets/images/man_left.png'
// import manRight from 'assets/images/man_right.png'
import logo_dark from 'assets/images/logos/logo_text_dark.png';
import logo_light from 'assets/images/logos/logo_text_light.png';
import GradientText from 'components/GradientText';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { JwtService } from 'services';
import * as auth from 'action/auth';
import cons from 'services/cons';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { useDispatch } from 'react-redux';
import { actionPending } from 'slices';
import { useToasts } from 'react-toast-notifications';
import * as referralCodes from 'referral-codes';

const baseUrl = 'https://hwsrv-1001623.hostwindsdns.com';

const Register = () => {
  const history = useHistory();
  const { state } = useLocation<string>();
  console.log('state register', state);
  const { addToast } = useToasts();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();

  const signupMatrix = () => {
    return new Promise(async (resolve, reject) => {
      const tempClient = auth.createTemporaryClient(baseUrl);
      return tempClient
        .isUsernameAvailable(userName)
        .then(async (isAvail) => {
          if (!isAvail) {
            reject('Username is already taken!');
            return;
          }
          if (email.length > 0) {
            const value = await Promise.allSettled([
              tempClient.registerRequest(
                {
                  username: userName,
                  password,
                  initial_device_display_name: cons.DEVICE_DISPLAY_NAME,
                },
                'user'
              ),
            ]);
            const registerFlow =
              value[0].status === 'rejected' ? value[0].reason.data : undefined;
            const { session } = registerFlow;
            if (session === undefined) return reject('Something went wrong');
            const d = await auth.completeRegisterStage(
              baseUrl,
              userName,
              password,
              { type: 'm.login.dummy', session }
            );
            return resolve(d);
          }
        })
        .catch((err) => {
          console.log(err);
          const msg = err.message || err.error;
          if (
            ['M_USER_IN_USE', 'M_INVALID_USERNAME', 'M_EXCLUSIVE'].indexOf(
              err.errcode
            ) > -1
          ) {
            console.log({
              username:
                err.errcode === 'M_USER_IN_USE'
                  ? 'Username is already taken'
                  : msg,
            });
          } else if (msg) console.log({ other: msg });
        });
    });
  };
  const handleSignup = async () => {
    const [referralCode] = referralCodes.generate({
      length: 12,
    });
    if (userName === '' || email === '' || password === '')
      return addToast('Fill the empty fields!', { appearance: 'error' });
    if (password !== confirmPassword)
      return addToast('Password is invalid', { appearance: 'error' });
    dispatch(actionPending(true));
    const res: any = await JwtService.checkMail(email).catch((e) => {
      return addToast(e, { appearance: 'error' });
    });
    if (!res?.available) {
      return dispatch(actionPending(false));
    }
    const ret = await signupMatrix().catch((e) => {
      addToast(e.message ? e.message : JSON.stringify(e), {
        appearance: 'error',
      });
    });
    if (ret === undefined) {
      return dispatch(actionPending(false));
    }
    if (ret)
      JwtService.createUser({
        userName,
        email,
        password,
        role: 'normal',
        referralCode,
        referral: state ? state : '',
      })
        .then((res) => {
          addToast('Registered successfully!', { appearance: 'success' });
          dispatch(actionPending(false));
          history.push({ pathname: '/auth/login', state });
          return console.log(res);
        })
        .catch((e: any) => {
          addToast(e.message ? e.message : JSON.stringify(e), {
            appearance: 'error',
          });
          dispatch(actionPending(false));
        });
  };
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      {/* <img className="hidden min-w-0 lg:block" src={manLeft} alt="" /> */}
      <div className="bg-white dark:bg-[#111111] shadow-sm gap-2 flex flex-col text-primary font-semibold sm:px-[140px] sm:py-[90px] sm:min-w-[630px] sm:max-w-[630px] min-w-full h-full sm:h-auto px-8 py-16">
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
          className="px-[22px] py-3.5 text-xs rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic"
          placeholder="User name here..."
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <p className="text-sm mt-3.5">Email</p>
        <input
          className="px-[22px] py-3.5 text-xs rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic"
          placeholder="Email  here..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex justify-end w-full">
          <GradientText
            size={11}
            value="+ add an address to reset your password"
          />
        </div>
        <p className="text-sm mt-3.5">Password</p>
        <input
          className="px-[22px] py-3.5 text-xs rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic"
          placeholder="Password here..."
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-sm mt-3.5">Confirm Password</p>
        <input
          className="px-[22px] py-3.5 text-xs rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic"
          placeholder="Password here..."
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          onClick={handleSignup}
          className="bg-gradient-to-r self-center from-[#4776E6] to-[#8E54E9] text-sm font-bold rounded-full text-white px-[40px] py-[8px] mt-[14px] flex items-center gap-2"
        >
          Register
          {loading && (
            <div className="flex justify-center w-4 h-4">
              <svg
                className="inline text-gray-200 min-w-6 min-h-6 animate-spin fill-white"
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
          <p className="text-[13px]">Already have an account?</p>
          <Link to={{ pathname: '/auth/login', state }}>
            <GradientText size={13} value="Sing In" />
          </Link>
        </div>
        <div className="w-full flex justify-center gap-1 mt-3.5 text-xs text-primary">
          <p className="whitespace-nowrap">
            *By clicking “register”, you are agree with our
          </p>
          <a href="/#" className="font-bold whitespace-nowrap">
            privacy policy
          </a>
          <p className="whitespace-nowrap">and</p>
          <a href="/#" className="font-bold whitespace-nowrap">
            terms &amp; condition.
          </a>
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

export default Register;
