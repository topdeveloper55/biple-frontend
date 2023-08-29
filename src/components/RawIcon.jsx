import React from 'react';

function RawIcon({
  color=null, size, src, isImage=false,
}) {
  const style = {};
  if (color !== null) style.backgroundColor = color;
  if (isImage) {
    style.backgroundColor = 'transparent';
    style.backgroundImage = `url(${src})`;
  } else {
    style.WebkitMaskImage = `url(${src})`;
    style.maskImage = `url(${src})`;
  }

  return <span className={`ic-raw bg-secondary aspect-square min-w-[${size}px] min-h-[${size}px]`} style={style}> </span>;
}

export default RawIcon;
