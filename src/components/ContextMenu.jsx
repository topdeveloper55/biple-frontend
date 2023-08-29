import React, { useState, useEffect } from 'react';

import Tippy from '@tippyjs/react';
import 'tippy.js/animations/scale-extreme.css';

import ScrollView from './ScrollView';

function ContextMenu({
  content, placement, maxWidth, render, afterToggle,
}) {
  const [isVisible, setVisibility] = useState(false);
  const showMenu = () => setVisibility(true);
  const hideMenu = () => setVisibility(false);

  useEffect(() => {
    if (afterToggle !== null) afterToggle(isVisible);
  }, [isVisible]);

  return (
    <Tippy
      animation="scale-extreme"
      className="context-menu"
      visible={isVisible}
      onClickOutside={hideMenu}
      content={<ScrollView invisible>{typeof content === 'function' ? content(hideMenu) : content}</ScrollView>}
      placement={placement}
      interactive
      arrow={false}
      maxWidth={maxWidth}
      duration={200}
    >
      {render(isVisible ? hideMenu : showMenu)}
    </Tippy>
  );
}

function MenuHeader({ children }) {
  return (
    <div className="context-menu__header">
      <p variant="b3">{ children }</p>
    </div>
  );
}

function MenuItem({
  variant, iconSrc, type,
  onClick, children, disabled,
}) {
  return (
    <div className="context-menu__item">
      <button
        variant={variant}
        iconSrc={iconSrc}
        type={type}
        onClick={onClick}
        disabled={disabled}
      >
        { children }
      </button>
    </div>
  );
}

function MenuBorder() {
  return <div style={{ borderBottom: '1px solid var(--bg-surface-border)' }}> </div>;
}

export {
  ContextMenu as default, MenuHeader, MenuItem, MenuBorder,
};
