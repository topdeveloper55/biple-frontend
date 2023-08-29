import { useState } from 'react';
import GradientText from './GradientText';
import Modal from './Modal';

interface Props {
  open?: boolean;
  setOpen: any;
  data?: any;
}

const BuyDialog = ({ open, setOpen, data }: Props) => {
  const [symbol, setSymbol] = useState('eth');

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-start border-b border-[#697A8D66] py-[18px] text-4xl">
            <GradientText value="Buy" size={36} />
          </div>
          <div className="flex gap-4 items-center mt-4">
            <img className="max-w-16 aspect-square" src={data.image} alt="" />
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
              <p className="text-xs font-bold dark:text-white">{data.name}</p>
            </div>
            <div className="flex items-center text-xs font-bold text-primary dark:text-white">
              <svg
                className="max-w-3 mr-1 max-h-5 fill-[#565A7F] dark:fill-white"
                width="9"
                height="16"
                viewBox="0 0 9 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.99704 8.15L4.5 11.05L0 8.15L4.5 0L8.99704 8.15ZM4.5 11.9812L0 9.08125L4.5 16L9 9.08125L4.5 11.9812Z" />
              </svg>
              <b className="dark:text-white">0.0025</b>
            </div>
          </div>
          <p className="mt-8 text-sm text-primary dark:text-white">PAY WITH</p>
          <div className="flex gap-2">
            <button
              onClick={() => setSymbol('eth')}
              className={`rounded-lg w-full text-sm px-6 py-[18px] font-bold flex justify-between gap-2 items-center ${
                symbol === 'eth'
                  ? 'bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white'
                  : 'bg-gradient-to-r from-[#4776E620] to-[#8E54E920] text-primary dark:text-white hover:from-[#4776E640] hover:to-[#8E54E940]'
              }`}
            >
              ETH
              <div className="flex items-center gap-1">
                <div className="aspect-square flex px-[8px] items-center rounded-full bg-white">
                  <svg
                    className="max-w-[9px] max-h-4 fill-[#565A7F]"
                    width="9"
                    height="16"
                    viewBox="0 0 9 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8.99704 8.15L4.5 11.05L0 8.15L4.5 0L8.99704 8.15ZM4.5 11.9812L0 9.08125L4.5 16L9 9.08125L4.5 11.9812Z" />
                  </svg>
                </div>
                <b className="dark:text-white">0.0025</b>
              </div>
            </button>
            <button
              onClick={() => setSymbol('weth')}
              className={`rounded-lg w-full text-sm px-6 py-[18px] font-bold flex justify-between gap-2 items-center ${
                symbol === 'weth'
                  ? 'bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white'
                  : 'bg-gradient-to-r from-[#4776E620] to-[#8E54E920] text-primary dark:text-white hover:from-[#4776E640] hover:to-[#8E54E940]'
              }`}
            >
              WETH
              <div className="flex items-center gap-1">
                <div className="aspect-square flex px-2 items-center rounded-full bg-white">
                  <svg
                    className="max-w-[9px] max-h-4 fill-[#a73347]"
                    width="9"
                    height="16"
                    viewBox="0 0 9 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8.99704 8.15L4.5 11.05L0 8.15L4.5 0L8.99704 8.15ZM4.5 11.9812L0 9.08125L4.5 16L9 9.08125L4.5 11.9812Z" />
                  </svg>
                </div>
                <b className="dark:text-white">0.0025</b>
              </div>
            </button>
          </div>
          <p className="text-sm font-secondary flex items-center gap-1">
            Floor price{' '}
            <svg
              className="max-w-[9px] ml-1 max-h-4 fill-[#565A7F] dark:fill-white"
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
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-primary dark:text-white">YOU PAY</p>
            <p className="text-[22px] text-secondary flex items-center gap-1">
              <svg
                className="max-w-3 ml-1 fill-[#565A7F] dark:fill-white"
                width="9"
                height="16"
                viewBox="0 0 9 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.99704 8.15L4.5 11.05L0 8.15L4.5 0L8.99704 8.15ZM4.5 11.9812L0 9.08125L4.5 16L9 9.08125L4.5 11.9812Z" />
              </svg>
              <b className="dark:text-white text-primary">0.0025</b>
            </p>
          </div>
          <p className="w-full text-right text-sm font-semibold text-secondary">
            ($3.97)
          </p>
          <button className="mt-8 w-full bg-gradient-to-r self-center from-[#4776E6] to-[#8E54E9] text-sm font-bold rounded-full text-white px-10 py-[14px] mb-8">
            Buy
          </button>
        </div>
      </Modal>
    </>
  );
};

export default BuyDialog;
