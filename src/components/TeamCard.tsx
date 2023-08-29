const TeamCard = ({ data }: any) => {
  return (
    <div className="flex flex-col items-center justify-center bg-[#F3F3F5] dark:bg-[#1F1F22] rounded-2xl p-[14px] group gap-3.5">
      <div className="relative w-7/12 overflow-hidden rounded-full cursor-pointer aspect-square p-[4px] bg-gradient-to-b from-[#4776E6] to-[#8E54E9]">
        <img
          alt=""
          className="object-cover w-full transition rounded-full duration-300 ease-in-out aspect-square group-hover:scale-110"
          src={data.image}
        />
      </div>
      <div className="flex flex-col w-full bg-white dark:bg-[#111] rounded-2xl py-[14px] gap-2.5 items-center">
        <div className="flex gap-3 items-end">
          <a href={data.twitter} target="_blank" rel="noreferrer">
            <svg
              className="max-w-[19px] max-h-[15px]"
              width="19"
              height="15"
              viewBox="0 0 19 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 1.77927C18.3013 2.07995 17.5507 2.28311 16.7616 2.37493C17.5758 1.90181 18.1849 1.15718 18.4753 0.279967C17.7104 0.721218 16.8732 1.03181 16.0001 1.19824C15.413 0.58947 14.6354 0.185967 13.7879 0.050377C12.9405 -0.0852125 12.0707 0.0546982 11.3135 0.448387C10.5563 0.842076 9.95419 1.46752 9.60054 2.22761C9.2469 2.9877 9.16155 3.83991 9.35775 4.65193C7.80776 4.57635 6.29146 4.18511 4.90725 3.5036C3.52304 2.82209 2.30186 1.86554 1.32295 0.696035C0.988241 1.25675 0.795781 1.90686 0.795781 2.59922C0.795407 3.22251 0.953458 3.83624 1.25591 4.38598C1.55836 4.93572 1.99586 5.40446 2.5296 5.75061C1.91061 5.73148 1.30528 5.56905 0.763983 5.27684V5.3256C0.763921 6.19978 1.07529 7.04707 1.64527 7.72368C2.21524 8.40029 3.00871 8.86456 3.89104 9.03771C3.31683 9.18863 2.71481 9.21086 2.13045 9.10272C2.37939 9.8549 2.86431 10.5127 3.51731 10.9839C4.17031 11.4551 4.95871 11.7163 5.77213 11.7308C4.3913 12.7835 2.68598 13.3545 0.930503 13.352C0.619538 13.3521 0.308837 13.3344 0 13.2992C1.78191 14.4118 3.85618 15.0023 5.97463 15C13.1459 15 17.0662 9.23193 17.0662 4.22936C17.0662 4.06683 17.062 3.90268 17.0545 3.74016C17.817 3.20461 18.4753 2.54144 18.9983 1.78171L19 1.77927Z"
                fill="url(#paint0_linear_401_1044)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_401_1044"
                  x1="1.06755e-07"
                  y1="7.42105"
                  x2="18.09"
                  y2="7.42105"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4776E6" />
                  <stop offset="1" stopColor="#8E54E9" />
                </linearGradient>
              </defs>
            </svg>
          </a>
          <a href={data.linkedin} target="_blank" rel="noreferrer">
            <svg
              className="max-w-[19px] max-h-[18px]"
              width="19"
              height="18"
              viewBox="0 0 19 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.0921 18H0.36031V5.98232H4.0921V18ZM2.22419 4.343C1.03089 4.343 0.0629883 3.35458 0.0629883 2.16125C0.0629883 1.58805 0.290686 1.03833 0.695991 0.633016C1.1013 0.227703 1.65101 0 2.22419 0C2.79738 0 3.34709 0.227703 3.7524 0.633016C4.1577 1.03833 4.3854 1.58805 4.3854 2.16125C4.3854 3.35458 3.4171 4.343 2.22419 4.343ZM18.059 18H14.3352V12.1499C14.3352 10.7556 14.3071 8.96766 12.395 8.96766C10.4548 8.96766 10.1575 10.4824 10.1575 12.0494V18H6.42968V5.98232H10.0088V7.62164H10.061C10.5592 6.67743 11.7762 5.68098 13.5919 5.68098C17.3687 5.68098 18.063 8.16808 18.063 11.3985V18H18.059Z"
                fill="url(#paint0_linear_401_1046)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_401_1046"
                  x1="0.0629884"
                  y1="8.90526"
                  x2="17.2009"
                  y2="8.90526"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4776E6" />
                  <stop offset="1" stopColor="#8E54E9" />
                </linearGradient>
              </defs>
            </svg>
          </a>
          <a href={data.mail} target="_blank" rel="noreferrer">
            <svg
              className="max-w-[14px] max-h-[12px]"
              width="14"
              height="12"
              viewBox="0 0 14 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.33333 0C1.71449 0 1.121 0.252856 0.683417 0.702944C0.245833 1.15303 0 1.76348 0 2.4V2.6412L7 6.5184L14 2.6424V2.4C14 1.76348 13.7542 1.15303 13.3166 0.702944C12.879 0.252856 12.2855 0 11.6667 0H2.33333ZM14 4.0044L7.2765 7.728C7.19152 7.77505 7.09651 7.79969 7 7.79969C6.90349 7.79969 6.80848 7.77505 6.7235 7.728L0 4.0044V9.6C0 10.2365 0.245833 10.847 0.683417 11.2971C1.121 11.7471 1.71449 12 2.33333 12H11.6667C12.2855 12 12.879 11.7471 13.3166 11.2971C13.7542 10.847 14 10.2365 14 9.6V4.0044Z"
                fill="url(#paint0_linear_401_1053)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_401_1053"
                  x1="7.86616e-08"
                  y1="5.93684"
                  x2="13.3295"
                  y2="5.93684"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4776E6" />
                  <stop offset="1" stopColor="#8E54E9" />
                </linearGradient>
              </defs>
            </svg>
          </a>
        </div>
        <span className="text-primary dark:text-white text-[17px] font-bold">
          {data.name}
        </span>
        <span className="text-secondary dark:text-white text-[13px] font-semibold -mt-2">
          {data.role}
        </span>
      </div>
    </div>
  )
}

export default TeamCard
