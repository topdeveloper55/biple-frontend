import React from 'react';

// import { twemojify } from 'util/twemojify';

import * as roomActions from 'action/room';

import TickMarkIC from 'assets/ic/outlined/tick-mark.svg';
import AddUserIC from 'assets/ic/outlined/add-user.svg';
import LeaveArrowIC from 'assets/ic/outlined/leave-arrow.svg';

import { MatrixService } from 'services';
import { confirmDialog } from './ConfirmDialog';
import { MenuHeader, MenuItem } from './ContextMenu';
import { markAsRead } from 'action/notifications';
import { openInviteUser } from 'action/navigation';

function RoomOptions({ roomId, afterOptionSelect }) {
  const mx = MatrixService.matrixClient;
  const room = mx.getRoom(roomId);
  const canInvite = room?.canInvite(mx.getUserId());

  const handleMarkAsRead = () => {
    markAsRead(roomId);
    afterOptionSelect();
  };

  const handleInviteClick = () => {
    openInviteUser(roomId);
    afterOptionSelect();
  };
  const handleLeaveClick = async () => {
    afterOptionSelect();
    const isConfirmed = await confirmDialog(
      'Leave room',
      `Are you sure that you want to leave "${room.name}" room?`,
      'Leave',
      'danger',
    );
    if (!isConfirmed) return;
    roomActions.leave(roomId);
  };

  return (
    <div style={{ maxWidth: '256px' }}>
      <MenuHeader>{(`Options for ${MatrixService.matrixClient.getRoom(roomId)?.name}`)}</MenuHeader>
      <MenuItem iconSrc={TickMarkIC} onClick={handleMarkAsRead}>Mark as read</MenuItem>
      <MenuItem
        iconSrc={AddUserIC}
        onClick={handleInviteClick}
        disabled={!canInvite}
      >
        Invite
      </MenuItem>
      <MenuItem iconSrc={LeaveArrowIC} variant="danger" onClick={handleLeaveClick}>Leave</MenuItem>
      <MenuHeader>Notification</MenuHeader>
    </div>
  );
}

export default RoomOptions;
