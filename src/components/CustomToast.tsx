import { DefaultToast } from "react-toast-notifications";
import colorMXID from "utils/colorMXID";
import Avatar from "./Avatar";
import GradientText from "./GradientText";
import { useHistory } from 'react-router-dom';
import { selectRoom } from "action/navigation";

const CustomToast = ({ children, ...props }: any) => {
  const { appearance } = props
  const { senderName, content, avatarUrl, id } = appearance === 'info' ? JSON.parse(children) : { senderName: '', content: '', avatarUrl: '', id: '' }
  const history = useHistory()
  
  const handleReply = () => {

  }

  const handlePrivate = () => {
    history.push('/private')
    selectRoom(id)
  }
  return (
    <DefaultToast {...props}>
      {appearance !== 'info' ? <div>{children}</div> :
        <div className="flex flex-col items-start">
          {/* <p className="">New message arrived</p> */}
          <div className="flex items-start gap-[8px]">
            <Avatar
              text={senderName}
              bgColor={colorMXID(id)}
              imageSrc={avatarUrl}
              // iconColor="var(--ic-surface-low)"
              // iconSrc={iconSrc}
              size="extra-small"
            />
            <div className='flex-grow text-left mt-1.5'>
              <p>{senderName}</p>
              <p>{content}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 pl-[43px]">
            <button onClick={handleReply} className="bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:from-[#4776E6dd] hover:to-[#8E54E9dd] text-sm font-bold rounded-lg text-white px-[12px] py-[8px]">Reply</button>
            <button onClick={handlePrivate} className="bg-gradient-to-r from-[#4776E615] to-[#8E54E915] hover:bg-gradient-to-r hover:from-[#4776E644] hover:to-[#8E54E944] text-sm font-bold rounded-lg text-white px-[12px] py-[8px]"><GradientText value="Private messages" size={14} /></button>
          </div>
        </div>
      }
    </DefaultToast>
  )
};

export default CustomToast;