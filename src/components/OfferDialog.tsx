import { useState } from 'react'
import Dropdown from './Dropdown'
import GradientText from './GradientText'
import Modal from './Modal'
const symbols = [
  {
    value: 'weth',
    label: 'WETH',
  },
  {
    value: 'eth',
    label: 'ETH',
  },
]
const expires = [
  {
    value: '30',
    label: '30 days',
  },
  {
    value: '15',
    label: '15 days',
  },
] 
const OfferDialog = ({ open, setOpen, data }: any) => {
  const [price, setPrice] = useState(0)
  const [symbol, setSymbol] = useState(symbols[0])
  const [expiry, setExpiry] = useState(expires[0])
  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-start border-b border-[#697A8D66] py-[18px] text-[36px]">
            <GradientText value="Make Offer" size={36} />
          </div>
          <div className="flex gap-4 items-center mt-4">
            <img
              className="max-w-[64px] aspect-square"
              src={data.image}
              alt=""
            />
            <div className="flex flex-col flex-grow gap-2">
              <p className="text-sm font-semibold flex items-center gap-2">
                {data.collection}
                <svg
                  className="max-w-[14px] max-h-[14px]"
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
              </p>
              <p className="text-sm font-bold dark:text-white">
                {data.name}
              </p>
            </div>
          </div>
          <p className="mt-8 text-sm text-primary dark:text-white">PRICE</p>
          <div className="flex gap-2">
            <input
              className="px-[22px] w-full py-[14px] text-sm rounded-lg bg-[#F3F3F5] dark:bg-[#1F1F22] placeholder:italic text-primary dark:text-white"
              value={price}
              type="number"
              onChange={(e) => setPrice(e.target.valueAsNumber)}
            />
            <Dropdown
              id="symbol"
              current={symbol}
              onChange={setSymbol}
              options={symbols}
            />
          </div>
          <p className="text-sm font-secondary flex items-center gap-1">
            Floor price{' '} 
            <svg
              className="max-w-[9px] ml-1 max-h-[16px] fill-[#565A7F] dark:fill-white"
              width="9"
              height="16"
              viewBox="0 0 9 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8.99704 8.15L4.5 11.05L0 8.15L4.5 0L8.99704 8.15ZM4.5 11.9812L0 9.08125L4.5 16L9 9.08125L4.5 11.9812Z" />
            </svg>
            <b className="dark:text-white">0.0025</b> ($3.97)
          </p>
          <p className="mt-8 text-sm text-primary dark:text-white">EXPIRES AFTER</p>
          <div className="flex flex-col w-full gap-2">
            <Dropdown
              id="expiry"
              current={expiry}
              onChange={setExpiry}
              options={expires}
            />
          </div>
          <button className='mt-8 w-full bg-gradient-to-r self-center from-[#4776E6] to-[#8E54E9] text-sm font-bold rounded-full text-white px-[40px] py-[14px] mb-8'>Make Offer</button>
        </div>
      </Modal>
    </>
  )
}

export default OfferDialog
