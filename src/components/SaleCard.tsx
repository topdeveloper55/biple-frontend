import { useState } from 'react'
import { Link } from 'react-router-dom'
import BuyDialog from './BuyDialog'
import GradientText from './GradientText'
import OfferDialog from './OfferDialog'

const SaleCard = ({ data }: any) => {
  const [openOffer, setOpenOffer] = useState(false)
  const [openBuy, setOpenBuy] = useState(false)
  const handleBid = (e: any) => {
    e.preventDefault()
    setOpenOffer(true)
  }
  const handleBuy = (e: any) => {
    e.preventDefault()
    setOpenBuy(true)
  }
  return (
    <div className="flex flex-col items-center justify-center bg-[#F3F3F5] dark:bg-[#1F1F22] rounded-2xl p-[14px] group gap-[8px]">
      <Link
        to={`/sale/collections/${data.collectionAddress}/${data.tokenId}`}
        className="relative w-full overflow-hidden rounded-2xl aspect-square  cursor-pointer"
      >
        <div className="absolute inset-x-0 inset-y-0 z-50 flex items-end w-full text-white transition duration-300 ease-in-out opacity-0 cursor-pointer group-hover:opacity-100 top-2">
          <div className="w-full">
            <div className="flex w-full pb-10 space-y-3 text-xl transition-all duration-300 ease-in-out translate-y-6 transform-gpu group-hover:opacity-100">
              <div className="flex justify-end w-full gap-2 px-2">
                <button
                  onClick={handleBid}
                  className="rounded-full flex justify-center items-center bg-white dark:bg-[#1f1f2f] hover:bg-[#E3E3E3] dark:hover:bg-[#222232] px-5 py-1.5"
                >
                  <GradientText size={14} value="Bid" />
                </button>
                <button
                  onClick={handleBuy}
                  className="rounded-full bg-gradient-to-r hover:from-[#4776E6dd] hover:to-[#8E54E9dd] from-[#4776E6] to-[#8E54E9] text-white text-sm font-[600] px-5 py-1.5"
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>
        <img
          alt=""
          className="object-cover w-full transition duration-300 ease-in-out rounded-2xl aspect-square group-hover:scale-110"
          src={data.image}
        />
      </Link>
      <div className="flex flex-col w-full">
        <span className="flex items-center gap-1 text-secondary dark:text-white text-[13px] font-[600] py-1">
          {data.collection}
          <svg
            className="max-w-[10px] max-h-[10px]"
            width="10px"
            height="10px"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.26433 10H4.73567L3.49218 8.71929H1.65302L1.25838 8.34698V6.54505L0 5.26433V4.73567L1.25838 3.45495V1.64557L1.65302 1.27327H3.49218L4.73567 0H5.26433L6.54505 1.27327H8.35443L8.72673 1.63812V3.45495L10 4.73567V5.26433L8.70439 6.54505V8.34698L8.33209 8.71929H6.54505L5.26433 10ZM4.03574 6.84289H4.56441L7.37156 4.03574L6.84289 3.50707L4.3038 6.05361L3.27625 5.02606L2.74758 5.55473L4.03574 6.84289Z"
              fill="#4776E6"
            />
          </svg>
        </span>
        <p className="text-primary dark:text-white font-bold text-[17px]">
          {data.name}
        </p>
        <div className="flex justify-between items-center text-primary dark:text-white">
          <span className="italic text-sm">Current bid</span>
          <span className="flex items-center text-[13px]">
            <svg
              className="max-w-[9px] max-h-[16px] mr-1 fill-[#565A7F] dark:fill-white"
              width="9"
              height="16"
              viewBox="0 0 9 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8.99704 8.15L4.5 11.05L0 8.15L4.5 0L8.99704 8.15ZM4.5 11.9812L0 9.08125L4.5 16L9 9.08125L4.5 11.9812Z" />
            </svg>
            <b>{data.currentBid}</b>
            <span>{data.symbol}</span>
          </span>
        </div>
        <div className="flex justify-between items-center text-primary dark:text-white">
          <span className="italic text-sm">Buy now</span>
          <span className="flex items-center text-[13px]">
            <svg
              className="max-w-[9px] max-h-[16px] mr-1 fill-[#565A7F] dark:fill-white"
              width="9"
              height="16"
              viewBox="0 0 9 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8.99704 8.15L4.5 11.05L0 8.15L4.5 0L8.99704 8.15ZM4.5 11.9812L0 9.08125L4.5 16L9 9.08125L4.5 11.9812Z" />
            </svg>
            <b>{data.buyNow}</b>
            <span>{data.symbol}</span>
          </span>
        </div>
      </div>
      <OfferDialog open={openOffer} setOpen={setOpenOffer} data={data} />
      <BuyDialog open={openBuy} setOpen={setOpenBuy} data={data} />
    </div>
  )
}

export default SaleCard
