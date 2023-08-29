import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Avatar from 'components/Avatar';
import { normalizeMembers } from 'components/GeneralMessage';
import GradientText from 'components/GradientText';
import { MatrixService } from 'services';
import { RootState } from 'store';
import colorMXID from 'utils/colorMXID';
import { memberByAtoZ, memberByPowerLevel } from 'utils/sort';

const Roles = () => {
  const community = useSelector(
    (state: RootState): any => state.community.current
  );
  const mx = MatrixService.matrixClient;
  const [members, setMembers] = useState([]);
  useEffect(() => {
    if (community) {
      const room = mx?.getRoom(community.roomId);
      const memberOfMembership = normalizeMembers(
        room?.getMembersWithMembership('join')
      )
        .sort(memberByAtoZ)
        .sort(memberByPowerLevel);
      // console.log(room?.getMembersWithMembership('join'))
      setMembers(memberOfMembership);
    }
  }, [community]); //eslint-disable-line
  return (
    <div className="flex-grow flex flex-col bg-white dark:bg-[#111111] shadow-sm gap-9 py-8 px-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800">
      <div className="flex flex-col flex-grow items-start gap-2 mt-4">
        <button className="w-full flex items-center justify-between bg-gradient-to-r from-[#4776E61A] to-[#8E54E91A] rounded-full px-5 py-3 hover:from-[#4776E644] hover:to-[#8E54E944]">
          <p className="text-primary font-semibold text-sm">Recent Actions</p>
          <svg
            className="max-w-[9px] max-h-3.5 rotate-180"
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
        </button>
        <button className="w-full flex items-center justify-between bg-gradient-to-r from-[#4776E61A] to-[#8E54E91A] rounded-full px-5 py-3 hover:from-[#4776E644] hover:to-[#8E54E944] mt-3">
          <p className="text-primary font-semibold text-sm">
            Add a stuff member
          </p>
          <svg
            className="max-w-[9px] max-h-3.5 rotate-180"
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
        </button>
        <p className="text-primary text-sm font-semibold">
          You can add users to help you manage your community
        </p>
        <div className="bg-gradient-to-r from-[#4776E61A] to-[#8E54E91A] rounded-lg px-3 py-3 flex flex-col w-full">
          {members.map((member: any) => (
            <div key={member.userId} className="flex gap-2 items-center cursor-pointer hover:bg-gradient-to-r from-[#4776E620] to-[#8E54E920] px-2 py-1.5 rounded-lg">
              <Avatar
                text={member.name}
                bgColor={colorMXID(member.userId)}
                imageSrc={member.avatarSrc}
              />
              <div className="flex-grow flex flex-col gap-1">
                <p className="text-sm font-semibold text-primary">
                  {member.name}
                </p>
                <p className="text-xs font-semobold text-secondary">
                  @{member.username}
                </p>
              </div>
              <GradientText
                value={member.peopleRole ? member.peopleRole : 'User'}
                size={14}
              />
            </div>
          ))}
        </div>
        <p className="w-full text-left text-primary">
          Each user must activate their 2FA before being promoted for security
          reasons
        </p>
        <div className="w-full flex justify-end text-secondary">
          <button className="">Read More...</button>
        </div>
      </div>
    </div>
  );
};

export default Roles;
