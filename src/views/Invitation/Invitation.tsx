import { useSelector } from 'react-redux';
import GradientText from 'components/GradientText';
import { RootState } from 'store';
import { useEffect, useState } from 'react';

const Invitation = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const currentRoom = useSelector(
    (state: RootState): any => state.community.current
  );
  const [userReferral, setUserReferral] = useState('');
  const [serverReferral, setServerReferral] = useState('');
  const handleCopy = () => {
    console.log('copied!');
    console.log(userReferral);
  };
  useEffect(() => {
    if (user.referralCode) setUserReferral(user.referralCode);
    if (currentRoom.inviteLink) setServerReferral(currentRoom.inviteLink);
  }, [user, currentRoom]);
  return (
    <div className="text-primary dark:text-white flex-grow flex flex-col bg-white dark:bg-[#111111] shadow-sm gap-9 py-[26px] px-20 items-center">
      <p className="text-[26px] font-bold">Share your link</p>
      <div className="flex gap-8 items-center">
        <span className="px-[44px] py-4 focus:ring-0 min-w-1 text-[17px] font-bold bg-gradient-to-r from-[#4776E619] to-[#8E54E919] rounded-[10px]">
          {`https://biples.netlify.app/r/${serverReferral}`}
        </span>
        <button
          onClick={handleCopy}
          className="bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-sm font-bold rounded-full text-white px-10 py-2"
        >
          Copy link
        </button>
      </div>
      <GradientText value="This invitation link expires in 7 days." size={15} />
      <div className="flex flex-col">
        <div className="flex items-center justify-center gap-24">
          <div className="flex flex-col items-center max-w-[140px] gap-4">
            <div className="rounded-full bg-gradient-to-r from-[#4776E6] to-[#8E54E9] p-[3px] flex justify-center items-center">
              <div className="aspect-square bg-white dark:bg-[#111111] min-w-[130px] text-[46px] rounded-full flex justify-center items-center">
                <GradientText size={46} value="52" />
              </div>
            </div>
            <p className="text-sm font-semibold text-center">
              Number of invited members
            </p>
          </div>
          <div className="flex flex-col items-center max-w-[140px] gap-4">
            <div className="rounded-full bg-gradient-to-r from-[#4776E6] to-[#8E54E9] p-[3px] flex justify-center items-center">
              <div className="aspect-square bg-white dark:bg-[#111111] min-w-[130px] text-[23px] rounded-full flex justify-center items-center">
                <GradientText size={23} value="Member" />
              </div>
            </div>
            <p className="text-sm font-semibold text-center">
              Current <br />
              role
            </p>
          </div>
        </div>
        <p className="text-secondary dark:text-white text-xs mt-8 max-w-xl text-center py-8 px-12 border-b border-[#697A8D66]">
          Some channels decide to assign a certain special role to the member
          who invites their friend in order to reward them
        </p>
      </div>
    </div>
  );
};

export default Invitation;
