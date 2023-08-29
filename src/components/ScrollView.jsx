import React from 'react';

const ScrollView = React.forwardRef(({
  horizontal=false, vertical=true, autoHide=false, invisible=false, onScroll=null, children,
}, ref) => {
  let scrollbarClasses = '';
  if (horizontal) scrollbarClasses += ' scrollbar__h';
  if (vertical) scrollbarClasses += ' scrollbar__v';
  if (autoHide) scrollbarClasses += ' scrollbar--auto-hide';
  if (invisible) scrollbarClasses += ' scrollbar--invisible';
  return (
    <div onScroll={onScroll} ref={ref} className={`overflow-y-auto`}>
      {children}
    </div>
  );
});

export default ScrollView;
