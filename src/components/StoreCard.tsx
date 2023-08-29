const StoreCard = ({ data }: any) => {
  return (
    <div className="flex flex-col items-center justify-center bg-[#F3F3F5] dark:bg-[#1F1F22] rounded-2xl p-[14px] group gap-[8px]">
      <div className="relative w-full overflow-hidden rounded-2xl cursor-pointer aspect-square">
        <img
          alt=""
          className="object-cover w-full transition duration-300 ease-in-out rounded-2xl aspect-square group-hover:scale-110"
          src={data.image}
        />
      </div>
      <div className="flex flex-col w-full">
        <span className="text-secondary dark:text-white text-[13px] font-[600]">
          {data.type}
        </span>
        <p className="text-primary dark:text-white font-bold text-[17px]">
          {data.name}
        </p>
        <div className="flex justify-between items-center text-primary dark:text-white mt-2">
          <div className="flex items-center text-[13px] flex-grow gap-1">
            <svg
              className="max-w-[12px] max-h-[15px]"
              width="12"
              height="15"
              viewBox="0 0 12 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.85247 0L2.63144 1.27179C2.63144 1.27179 0.227595 7.47376 0.0789356 7.89342C-0.0697234 8.31308 -0.0633978 8.9762 0.591334 8.9762C1.42319 8.9762 5.64574 8.95378 5.64574 8.95378C5.64574 8.95378 4.62094 13.9608 4.56084 14.4093C4.50075 14.8578 4.97519 15.2519 5.3927 14.8002C5.80705 14.3485 11.5636 6.85869 11.8135 6.49349C12.2595 5.83998 11.8293 5.23772 11.3232 5.20889C10.8172 5.18006 7.42648 5.25374 7.42648 5.25374L9.85247 0Z"
                fill="#FECA18"
              />
              <path
                d="M7.71431 1.29839C7.71431 1.29839 6.11034 4.49829 6.05047 4.68017C5.874 5.22012 6.6492 5.43894 6.86978 5.0013C7.09037 4.56081 9 1 9 1L7.71431 1.29839ZM0.504346 7.34012C0.926608 7.32876 4.63243 7.32023 4.94125 7.30034C5.51792 7.26055 5.60615 7.97954 4.94125 7.97954C4.25113 7.97954 0.614638 7.9909 0.394053 7.99943C-0.116442 8.02216 -0.182617 7.36002 0.504346 7.34012Z"
                fill="#FDB900"
              />
              <path
                d="M3.27088 1.21694C3.27088 1.21694 1.20184 6.20876 1.08459 6.58331C0.598368 8.14781 2.34671 8.1014 2.80879 7.21309C3.03639 6.77224 5.2606 2.24447 5.35716 1.42576C5.45716 0.610367 3.27088 1.21694 3.27088 1.21694V1.21694ZM4.14677 6.25516C3.85021 6.0596 3.49157 6.23196 3.27433 6.56011C3.05708 6.88825 2.73982 7.42191 3.22605 7.70365C3.66399 7.95556 4.05022 7.44842 4.22264 7.21309C4.38816 6.98106 4.60541 6.56011 4.14677 6.25516ZM7.44689 7.3291C6.6572 7.16668 6.40202 7.79646 6.23305 8.54225C6.06408 9.28804 5.42957 11.7011 5.31233 12.2977C5.14336 13.1363 5.94339 13.2556 6.28478 12.4833C6.53996 11.9066 7.6469 9.30461 7.78828 8.89028C8.00553 8.26382 8.24691 7.49151 7.44689 7.3291Z"
                fill="#FFE36A"
              />
            </svg>
            <p className="font-semibold">{data.cost}</p>
            <span>PT</span>
          </div>
          <button className="rounded-full bg-gradient-to-r hover:from-[#4776E6dd] hover:to-[#8E54E9dd] from-[#4776E6] to-[#8E54E9] text-white text-sm font-[600] px-3 py-2">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default StoreCard
