import { useState } from 'react';

interface Props {
  title?: string;
  children?: React.ReactNode;
  open: boolean;
}

const Accordion = ({ title, children, open }: Props) => {
  const [expand, setExpand] = useState<boolean>(open);

  return (
    <div className="transition border border-[#F3F3F5] dark:border-[#1F1F22] rounded-lg">
      <div
        onClick={() => setExpand((prev) => !prev)}
        className="accordion-header rounded-lg bg-gradient-to-r from-[#4776E620] to-[#8E54E920] text-primary cursor-pointer transition flex space-x-5 px-5 items-center h-16 justify-between"
      >
        <h3 className="text-secondary dark:text-white">{title}</h3>
        {expand ? (
          <svg
            viewBox="0 0 32 32"
            focusable="false"
            className="max-w-[24px] transition-all"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16 10L26 20L24.6 21.4L16 12.8L7.4 21.4L6 20L16 10Z"
              fill="currentColor"
            ></path>
          </svg>
        ) : (
          <svg
            viewBox="0 0 32 32"
            focusable="false"
            className="max-w-[24px] rotate-180 transition-all"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16 10L26 20L24.6 21.4L16 12.8L7.4 21.4L6 20L16 10Z"
              fill="currentColor"
            ></path>
          </svg>
        )}
      </div>
      <div
        className={`accordion-content transition-all overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800 ${
          expand ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
