import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const HistoryCard = ({ data }: any) => {
  const [loading, setLoading] = useState(true)
  return (
    <div className="flex px-6 py-5 bg-[#f5f5f5] dark:bg-[#1f1f22] gap-4">
      <div className="aspect-square min-w-[48px] overflow-hidden">
        {loading && <div className="w-full aspect-square image-loading"></div>}
        <LazyLoadImage
          className="object-cover w-full rounded-md transition duration-300 ease-in-out aspect-square group-hover:scale-110"
          alt=""
          placeholder={
            <div className="w-full aspect-square image-loading"></div>
          }
          src={data.image} // use normal <img> attributes as props
          // delayTime={5000}
          afterLoad={() => setLoading(false)}
        />
      </div>
      <div className="flex flex-col items-start flex-grow gap-2">
        <div className="flex gap-4 items-center">
          <p className="text-secondary dark:text-[#d5d5d5]">{data.name}</p>
          <p className="rounded-full text-[11px] text-primary dark:text-white bg-[#04DA4C4D] py-1 px-3">
            {data.type}
          </p>
        </div>
        <div className="flex items-center text-[12px] gap-3">
          <p className="text-secondary dark:text-[#a5a5a5]">
            From <b className="text-primary dark:text-white">{data.from}</b>
          </p>
          <p className="text-secondary dark:text-[#a5a5a5]">
            To <b className="text-primary dark:text-white">{data.to}</b>
          </p>
          <p className="text-primary font-bold dark:text-white">{data.date}</p>
        </div>
      </div>
    </div>
  )
}

export default HistoryCard;