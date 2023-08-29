import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'

const CommunityCard = ({ data }: any) => {
  function numberWithCommas(x: any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return (
    // <div className='flex flex-col border border-[#cdcdcd] rounded-2xl'>
    //   <img className='w-[330px] h-[330px] object-cover rounded-t-md' src={data.image} alt="asset" />
    //   <p className='text-[15px] text-white bg-[#697A8D] px-[32px] py-[12px] rounded-b-md'>{`${data.name} #${data.tokenId}`}</p>
    // </div>
    <Link
      to="/chat"
      className="flex flex-col items-center justify-center border border-[#cdcdcd] dark:border-[#222222] rounded-2xl w-full min-w-[400px]"
    >
      <div className="overflow-hidden aspect-[2.3] max-h-[250px] cursor-pointer rounded-2xl relative group w-full">
        <div className="z-50 w-full opacity-1 group-hover:opacity-100 transition duration-300 ease-in-out cursor-pointer absolute left-0 bottom-0 text-white flex items-end">
          <div className="w-full">
            <div className="transform-gpu text-xl group-hover:opacity-100 group-hover:w-full transition-all duration-300 ease-in-out">
              <div className="opacity-[0.8] text-[15px] w-full text-white aspect-[5.6] bg-gradient-to-r from-[#4776E6] to-[#8E54E9] rounded-xl p-[16px] gap-[8px] max-h-[104px]">
                <div className="w-full flex justify-between items-end">
                  <p className="font-bold text-xl">{data.name}</p>
                  <p className="flex items-center text-[15px] font-semibold">
                    <svg
                      className="max-h-[18px]"
                      width="18"
                      height="20"
                      viewBox="0 0 18 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17 19V17C17 15.9391 16.5786 14.9217 15.8284 14.1716C15.0783 13.4214 14.0609 13 13 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19M13 5C13 7.20914 11.2091 9 9 9C6.79086 9 5 7.20914 5 5C5 2.79086 6.79086 1 9 1C11.2091 1 13 2.79086 13 5Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {numberWithCommas(data.members)} Members
                  </p>
                </div>
                <p className="text-[15px] font-normal tracking-tight leading-[22px]">
                  {data.description.length < 100
                    ? data.description
                    : data.description.substring(0, 100) + '...'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <LazyLoadImage
          className="object-cover w-full transition duration-300 ease-in-out rounded-2xl aspect-[2.3] group-hover:scale-110 max-h-[250px]"
          alt=""
          placeholder={
            <div className="w-full aspect-square image-loading"></div>
          }
          src={data.image} // use normal <img> attributes as props
        />
      </div>
    </Link>
  )
}

export default CommunityCard
