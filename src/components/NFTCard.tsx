import { LazyLoadImage } from 'react-lazy-load-image-component'
import rightArrow from 'assets/images/right_arrow.png'

const NFTCard = ({ data }: any) => {
  return (
    // <div className='flex flex-col border border-[#cdcdcd] rounded-2xl'>
    //   <img className='w-[330px] h-[330px] object-cover rounded-t-md' src={data.image} alt="asset" />
    //   <p className='text-[15px] text-white bg-[#697A8D] px-[32px] py-[12px] rounded-b-md'>{`${data.name} #${data.tokenId}`}</p>
    // </div>
    <div className="flex flex-col items-center justify-center border border-[#cdcdcd] dark:border-[#222222] rounded-2xl">
      <div className="overflow-hidden aspect-square cursor-pointer rounded-t-md relative group w-full">
        <div className="z-50 w-full opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out cursor-pointer absolute inset-x-0 -top-2 pt-30 text-white flex items-end">
          <div className="w-full px-8">
            <div className="transform-gpu space-y-3 text-xl group-hover:opacity-100 group-hover:w-full w-[52px] translate-y-6 pb-10 transition-all duration-300 ease-in-out">
              <button
                onClick={() => console.log('joining community')}
                className="flex rounded-2xl mx-auto w-full overflow-hidden"
              >
                <p className="rounded-l-lg py-[12px] flex-grow bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white text-sm font-[600] min-w-0 whitespace-nowrap	">
                  Join the community
                </p>
                <div className="rounded-r-lg h-[52px] w-[52px] min-w-[52px] flex justify-center items-center aspect-square bg-white dark:bg-[#111111]">
                  <img src={rightArrow} alt="" />
                </div>
              </button>
            </div>
          </div>
        </div>
        <LazyLoadImage
          className="object-cover w-full transition duration-300 ease-in-out rounded-2xl aspect-square group-hover:scale-110"
          alt=""
          placeholder={
            <div className="w-full aspect-square image-loading"></div>
          }
          src={data.image} // use normal <img> attributes as props
        />
      </div>
      <p className="text-[15px] w-full text-white bg-[#697A8D] dark:bg-[#1f1f22] px-[32px] py-[12px] rounded-b-md">{`${data.name}`}</p>
    </div>
  )
}

export default NFTCard
