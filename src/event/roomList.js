import { selectTab, selectSpace, selectRoom } from 'action/navigation';
import cons from 'services/cons';
import navigation from 'services/navigation';

const initRoomListListener = (roomList) => {
  const listenRoomLeave = (roomId) => {
    const parents = roomList.roomIdToParents.get(roomId);

    if (parents) {
      [...parents].forEach((pId) => {
        const data = navigation.spaceToRoom.get(pId);
        if (data?.roomId === roomId) {
          navigation.spaceToRoom.delete(pId);
        }
      });
    }

    if (navigation.selectedRoomId === roomId) {
      selectRoom(null);
    }

    if (navigation.selectedSpacePath.includes(roomId)) {
      const idIndex = navigation.selectedSpacePath.indexOf(roomId);
      if (idIndex === 0) selectTab(cons.tabs.HOME);
      else selectSpace(navigation.selectedSpacePath[idIndex - 1]);
    }

    navigation.removeRecentRoom(roomId);
  };

  roomList.on(cons.events.roomList.ROOM_LEAVED, listenRoomLeave);
  return () => {
    roomList.removeListener(cons.events.roomList.ROOM_LEAVED, listenRoomLeave);
  };
};

// eslint-disable-next-line import/prefer-default-export
export { initRoomListListener };
