import { useState } from "react"
import { LazyLoadImage } from "react-lazy-load-image-component"

const ProfileNFTCard = ({ imageUrl, videoUrl }: any) => {
  const [isImage, setIsImage] = useState(true)
  return (
    <>
      {isImage ? (
        <LazyLoadImage
          className="aspect-square bg-[#F3F3F5] dark:bg-[#1F1F22] object-cover w-full transition duration-300 ease-in-out rounded-[10px] cursor-pointer hover:scale-105"
          alt=""
          placeholder={
            <div className="w-full aspect-square image-loading"></div>
          }
          src={imageUrl} // use normal <img> attributes as props
          // delayTime={5000}
          onError={() => setIsImage(false)}
        />
      ) : (
        <video
          className="aspect-square bg-[#F3F3F5] dark:bg-[#1F1F22] rounded-[10px] transition duration-300 ease-in-out cursor-pointer hover:scale-105 "
          controls={false}
          loop
          autoPlay
        >
          <source src={videoUrl ? videoUrl : imageUrl} type="video/mp4" />
          <source src={videoUrl ? videoUrl : imageUrl} type="video/ogg" />
          <source src={videoUrl ? videoUrl : imageUrl} type="video/mov" />
          <source src={videoUrl ? videoUrl : imageUrl} type="video/avi" />
          <source src={videoUrl ? videoUrl : imageUrl} type="video/wmv" />
          <source src={videoUrl ? videoUrl : imageUrl} type="video/flv" />
          <source src={videoUrl ? videoUrl : imageUrl} type="video/webm" />
          <source src={videoUrl ? videoUrl : imageUrl} type="video/mkv" />
          <source src={videoUrl ? videoUrl : imageUrl} type="video/avchd" />
        </video>
      )}
    </>
  )
}

export default ProfileNFTCard
