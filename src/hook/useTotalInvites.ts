import { useEffect, useState } from 'react';
import { MatrixService } from 'services';
import cons from 'services/cons';

export const useTotalInvites = () => {
  const { roomList, notifications } = MatrixService;
  // const roomCount = roomList?.inviteRooms.size ? roomList?.inviteRooms.size : 0
  // const directCount = roomList?.inviteDirects.size ? roomList?.inviteDirects.size : 0
  const totalInviteCount = () =>
    roomList?.inviteDirects.size ? roomList?.inviteDirects.size : 0;
  const totalUnreadCount = () => {
    const directIds = roomList?.directs;
    let total = 0;
    directIds?.forEach((id) => {
      total += notifications?.getTotalNoti(id);
    });
    return total;
  };
  const [totalInvites, updateTotalInvites] = useState(totalInviteCount());
  const [totalUnreads, updateTotalUnreads] = useState(totalUnreadCount());
  useEffect(() => {
    const onInviteListChange = () => {
      updateTotalInvites(totalInviteCount());
    };
    const onNotiChange = (
      roomId: string,
      total: number,
      prevTotal: number | null
    ) => {
      updateTotalUnreads(totalUnreadCount());
    };
    notifications?.on(cons.events.notifications.NOTI_CHANGED, onNotiChange);
    roomList?.on(cons.events.roomList.INVITELIST_UPDATED, onInviteListChange);
    return () => {
      roomList?.removeListener(
        cons.events.roomList.INVITELIST_UPDATED,
        onInviteListChange
      );
      notifications?.removeListener(
        cons.events.notifications.NOTI_CHANGED,
        onNotiChange
      );
    };
  }, []); //eslint-disable-line

  return [totalInvites, totalUnreads];
};
