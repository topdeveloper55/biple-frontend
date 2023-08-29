import React from 'react';
import Tippy from '@tippyjs/react';

function Tooltip({
  className, placement='top', content, delay=[200, 0], children,
}) {
  return (
    <Tippy
      content={content}
      className={`tooltip ${className}`}
      touch="hold"
      arrow={false}
      maxWidth={250}
      placement={placement}
      delay={delay}
      duration={[100, 0]}
    >
      {children}
    </Tippy>
  );
}

export default Tooltip;
