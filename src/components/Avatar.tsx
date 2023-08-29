import React, { useEffect, useState } from 'react';

interface AvatarProps {
  text?: string;
  bgColor?: string;
  iconSrc?: string;
  iconColor?: string;
  imageSrc?: string | null;
  size?: string;
}

const Avatar = React.forwardRef(
  (
    { text, bgColor, iconSrc, iconColor, imageSrc, size }: AvatarProps,
    ref: any
  ) => {
    const [isError, setIsError] = useState(false);
    // let textSize = 's1';
    // if (size === 'large') textSize = 'h1';
    // if (size === 'small') textSize = 'b1';
    // if (size === 'extra-small') textSize = 'b3';
    useEffect(() => {
      if (imageSrc) setIsError(false);
    }, [imageSrc]);
    return (
      <div ref={ref} className="flex justify-start">
        {imageSrc !== null && imageSrc !== undefined && !isError ? (
          <img
            draggable="false"
            className={`aspect-square ${
              size === 'large'
                ? 'min-w-[120px] max-w-[120px] rounded-full'
                : size === 'extra-small'
                ? 'rounded-full min-w-[32px] max-w-[32px]'
                : size === 'medium'
                ? 'rounded-full min-w-[80px] max-w-[80px]'
                : 'min-w-[50px] max-w-[50px] rounded-full'
            } flex items-center justify-center`}
            src={imageSrc as string}
            // onLoad={(e) => { e.target.style.backgroundColor = 'transparent'; }}
            // onError={(e) => { e.target.src = ImageBrokenSVG; }}
            onError={() => setIsError(true)}
            alt=""
          />
        ) : (
          <span
            className={`aspect-square ${
              size === 'large'
                ? 'min-w-[120px] max-w-[120px] rounded-full'
                : size === 'extra-small'
                ? 'rounded-full w-8 h-8'
                : size === 'medium'
                ? 'rounded-full w-[80px] h-[80px]'
                : 'min-w-[50px] max-w-[50px] rounded-full'
            } flex items-center justify-center`}
            style={{ backgroundColor: text !== null ? bgColor : 'transparent' }}
          >
            {text !== null && text !== undefined && (
              <p
                className={`text-white text-[${
                  size === 'large' ? '44px' : '20px'
                }]`}
              >
                {text[0]}
              </p>
            )}
          </span>
        )}
      </div>
    );
  }
);

export default Avatar;
