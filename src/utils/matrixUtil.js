import { MatrixService } from 'services';

import HashIC from 'assets/ic/outlined/hash.svg';
import HashGlobeIC from 'assets/ic/outlined/hash-globe.svg';
import HashLockIC from 'assets/ic/outlined/hash-lock.svg';
import SpaceIC from 'assets/ic/outlined/space.svg';
import SpaceGlobeIC from 'assets/ic/outlined/space-globe.svg';
import SpaceLockIC from 'assets/ic/outlined/space-lock.svg';

const WELL_KNOWN_URI = '/.well-known/matrix/client';

export const getBaseUrl = async (servername) => {
  let protocol = 'https://';
  if (servername.match(/^https?:\/\//) !== null) protocol = '';
  const serverDiscoveryUrl = `${protocol}${servername}${WELL_KNOWN_URI}`;
  try {
    const result = await (
      await fetch(serverDiscoveryUrl, { method: 'GET' })
    ).json();

    const baseUrl = result?.['m.homeserver']?.base_url;
    if (baseUrl === undefined) throw new Error();
    return baseUrl;
  } catch (e) {
    return `${protocol}${servername}`;
  }
};

export const getUsername = (userId) => {
  const mx = MatrixService.matrixClient;
  const user = mx?.getUser(userId);
  if (user === null || user === undefined) return userId;
  let username = user.displayName;
  if (typeof username === 'undefined') {
    username = userId;
  }
  return username;
};

export const getUsernameOfRoomMember = (roomMember) => {
  return roomMember.name || roomMember.userId;
};

export const isRoomAliasAvailable = async (alias) => {
  try {
    const result = await MatrixService.matrixClient.resolveRoomAlias(alias);
    if (result.room_id) return false;
    return false;
  } catch (e) {
    if (e.errcode === 'M_NOT_FOUND') return true;
    return false;
  }
};

export const getPowerLabel = (powerLevel) => {
  if (powerLevel > 9000) return 'Goku';
  if (powerLevel > 100) return 'Founder';
  if (powerLevel === 100) return 'Admin';
  if (powerLevel >= 50) return 'Mod';
  return 'User';
};

export const parseReply = (rawBody) => {
  if (rawBody?.indexOf('>') !== 0) return null;
  let body = rawBody.slice(rawBody.indexOf('<') + 1);
  const user = body.slice(0, body.indexOf('>'));

  body = body.slice(body.indexOf('>') + 2);
  const replyBody = body.slice(0, body.indexOf('\n\n'));
  body = body.slice(body.indexOf('\n\n') + 2);

  if (user === '') return null;

  const isUserId = user.match(/^@.+:.+/);

  return {
    userId: isUserId ? user : null,
    displayName: isUserId ? null : user,
    replyBody,
    body,
  };
};

export const trimHTMLReply = (html) => {
  if (!html) return html;
  const suffix = '</mx-reply>';
  const i = html.indexOf(suffix);
  if (i < 0) {
    return html;
  }
  return html.slice(i + suffix.length);
};

export const hasDMWith = (userId) => {
  const mx = MatrixService.matrixClient;
  const directIds = [...MatrixService.roomList.directs];

  return directIds.find((roomId) => {
    const dRoom = mx.getRoom(roomId);
    const roomMembers = dRoom.getMembers();
    if (roomMembers.length <= 2 && dRoom.getMember(userId)) {
      return true;
    }
    return false;
  });
};

export const joinRuleToIconSrc = (joinRule, isSpace) => {
  return (
    {
      restricted: () => (isSpace ? SpaceIC : HashIC),
      knock: () => (isSpace ? SpaceLockIC : HashLockIC),
      invite: () => (isSpace ? SpaceLockIC : HashLockIC),
      public: () => (isSpace ? SpaceGlobeIC : HashGlobeIC),
    }[joinRule]?.() || null
  );
};

// NOTE: it gives userId with minimum power level 50;
const getHighestPowerUserId = (room) => {
  const userIdToPower = room.currentState
    .getStateEvents('m.room.power_levels', '')
    ?.getContent().users;
  let powerUserId = null;
  if (!userIdToPower) return powerUserId;

  Object.keys(userIdToPower).forEach((userId) => {
    if (userIdToPower[userId] < 50) return;
    if (powerUserId === null) {
      powerUserId = userId;
      return;
    }
    if (userIdToPower[userId] > userIdToPower[powerUserId]) {
      powerUserId = userId;
    }
  });
  return powerUserId;
};

export const getIdServer = (userId) => {
  const idParts = userId.split(':');
  return idParts[1];
};

export const getServerToPopulation = (room) => {
  const members = room.getMembers();
  const serverToPop = {};

  members?.forEach((member) => {
    const { userId } = member;
    const server = getIdServer(userId);
    const serverPop = serverToPop[server];
    if (serverPop === undefined) {
      serverToPop[server] = 1;
      return;
    }
    serverToPop[server] = serverPop + 1;
  });

  return serverToPop;
};

export const genRoomVia = (room) => {
  const via = [];
  const userId = getHighestPowerUserId(room);
  if (userId) {
    const server = getIdServer(userId);
    if (server) via.push(server);
  }
  const serverToPop = getServerToPopulation(room);
  const sortedServers = Object.keys(serverToPop).sort(
    (svrA, svrB) => serverToPop[svrB] - serverToPop[svrA]
  );
  const mostPop3 = sortedServers.slice(0, 3);
  if (via.length === 0) return mostPop3;
  if (mostPop3.includes(via[0])) {
    mostPop3.splice(mostPop3.indexOf(via[0]), 1);
  }
  return via.concat(mostPop3.slice(0, 2));
};

export const isCrossVerified = (deviceId) => {
  try {
    const mx = MatrixService.matrixClient;
    const crossSignInfo = mx.getStoredCrossSigningForUser(mx.getUserId());
    const deviceInfo = mx.getStoredDevice(mx.getUserId(), deviceId);
    const deviceTrust = crossSignInfo.checkDeviceTrust(
      crossSignInfo,
      deviceInfo,
      false,
      true
    );
    return deviceTrust.isCrossSigningVerified();
  } catch {
    // device does not support encryption
    return null;
  }
};

export const hasCrossSigningAccountData = () => {
  const mx = MatrixService.matrixClient;
  const masterKeyData = mx.getAccountData('m.cross_signing.master');
  return !!masterKeyData;
};

export const getDefaultSSKey = () => {
  const mx = MatrixService.matrixClient;
  try {
    return mx.getAccountData('m.secret_storage.default_key').getContent().key;
  } catch {
    return undefined;
  }
};

export const getSSKeyInfo = (key) => {
  const mx = MatrixService.matrixClient;
  try {
    return mx.getAccountData(`m.secret_storage.key.${key}`).getContent();
  } catch {
    return undefined;
  }
};

export const hasDevices = async (userId) => {
  const mx = MatrixService.matrixClient;
  try {
    const usersDeviceMap = await mx.downloadKeys([userId, mx.getUserId()]);
    return Object.values(usersDeviceMap).every(
      (userDevices) => Object.keys(userDevices).length > 0
    );
  } catch (e) {
    console.error(
      "Error determining if it's possible to encrypt to all users: ",
      e
    );
    return false;
  }
};
