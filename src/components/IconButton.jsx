import React from 'react';

import RawIcon from './RawIcon';
import Tooltip from './Tooltip';
// import { blurOnBubbling } from './script';

const IconButton = React.forwardRef(({
  variant, size, type,
  tooltip, tooltipPlacement, src,
  onClick, tabIndex, disabled, isImage,
  className,
}, ref) => {
  const btn = (
    <button
      ref={ref}
      className={`rounded-lg p-1 self-center hover:bg-slate-300 ic-btn ic-btn-${variant} ${className} w-[30px] aspect-square flex items-center justify-center`}
      // onMouseUp={(e) => blurOnBubbling(e, `.ic-btn-${variant}`)}
      onClick={onClick}
      // eslint-disable-next-line react/button-has-type
      type={type}
      tabIndex={tabIndex}
      disabled={disabled}
    >
      <RawIcon size={18} src={src} isImage={isImage} />
    </button>
  );
  if (tooltip === null) return btn;
  return (
    <Tooltip
      placement={tooltipPlacement}
      content={<p className="text-[12px] text-white py-2 px-3 rounded-lg bg-gradient-to-r from-[#4776E6aa] to-[#8E54E9aa]">{tooltip}</p>}
    >
      {btn}
    </Tooltip>
  );
});

export default IconButton;
