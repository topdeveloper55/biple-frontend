import cons from 'services/cons';
import appDispatcher from 'services/dispatcher';

export const selectTab = (tabId) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.SELECT_TAB,
    tabId,
  });
};

export const selectSpace = (roomId) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.SELECT_SPACE,
    roomId,
  });
};

export const selectRoom = (roomId, eventId) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.SELECT_ROOM,
    roomId,
    eventId,
  });
};

// Open navigation on compact screen sizes
export const openNavigation = () => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_NAVIGATION,
  });
};

export const openSpaceSettings = (roomId, tabText) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_SPACE_SETTINGS,
    roomId,
    tabText,
  });
};

export const openSpaceManage = (roomId) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_SPACE_MANAGE,
    roomId,
  });
};

export const openSpaceAddExisting = (roomId) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_SPACE_ADDEXISTING,
    roomId,
  });
};

export const toggleRoomSettings = (tabText) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.TOGGLE_ROOM_SETTINGS,
    tabText,
  });
};

export const openShortcutSpaces = () => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_SHORTCUT_SPACES,
  });
};

export const openInviteList = () => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_INVITE_LIST,
  });
};

export const openPublicRooms = (searchTerm) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_PUBLIC_ROOMS,
    searchTerm,
  });
};

export const openCreateRoom = (isSpace = false, parentId = null) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_CREATE_ROOM,
    isSpace,
    parentId,
  });
};

export const openJoinAlias = (term) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_JOIN_ALIAS,
    term,
  });
};

export const openInviteUser = (roomId, searchTerm) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_INVITE_USER,
    roomId,
    searchTerm,
  });
};

export const openProfileViewer = (userId, roomId) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_PROFILE_VIEWER,
    userId,
    roomId,
  });
};

export const openSettings = (tabText) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_SETTINGS,
    tabText,
  });
};

export const openEmojiBoard = (cords, requestEmojiCallback) => {
  console.log('openemojiboard')

  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_EMOJIBOARD,
    cords,
    requestEmojiCallback,
  });
};

export const openReadReceipts = (roomId, userIds) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_READRECEIPTS,
    roomId,
    userIds,
  });
};

export const openViewSource = (event) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_VIEWSOURCE,
    event,
  });
};

export const replyTo = (userId, eventId, body, formattedBody) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.CLICK_REPLY_TO,
    userId,
    eventId,
    body,
    formattedBody,
  });
};

export const openSearch = (term) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_SEARCH,
    term,
  });
};

export const openReusableContextMenu = (
  placement,
  cords,
  render,
  afterClose
) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_REUSABLE_CONTEXT_MENU,
    placement,
    cords,
    render,
    afterClose,
  });
};

export const openReusableDialog = (title, render, afterClose) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_REUSABLE_DIALOG,
    title,
    render,
    afterClose,
  });
};

export const openEmojiVerification = (request, targetDevice) => {
  appDispatcher.dispatch({
    type: cons.actions.navigation.OPEN_EMOJI_VERIFICATION,
    request,
    targetDevice,
  });
};
