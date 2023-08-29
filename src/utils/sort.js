import { MatrixService } from 'services';

export const roomIdByActivity = (id1, id2) => {
  const room1 = MatrixService.matrixClient.getRoom(id1);
  const room2 = MatrixService.matrixClient.getRoom(id2);

  return room2.getLastActiveTimestamp() - room1.getLastActiveTimestamp();
};

export const roomIdByAtoZ = (aId, bId) => {
  let aName = MatrixService.matrixClient.getRoom(aId).name;
  let bName = MatrixService.matrixClient.getRoom(bId).name;

  // remove "#" from the room name
  // To ignore it in sorting
  aName = aName.replace(/#/g, '');
  bName = bName.replace(/#/g, '');

  if (aName.toLowerCase() < bName.toLowerCase()) {
    return -1;
  }
  if (aName.toLowerCase() > bName.toLowerCase()) {
    return 1;
  }
  return 0;
};

export const memberByAtoZ = (m1, m2) => {
  const aName = m1.name;
  const bName = m2.name;

  if (aName.toLowerCase() < bName.toLowerCase()) {
    return -1;
  }
  if (aName.toLowerCase() > bName.toLowerCase()) {
    return 1;
  }
  return 0;
};
export const memberByPowerLevel = (m1, m2) => {
  const pl1 = m1.powerLevel;
  const pl2 = m2.powerLevel;

  if (pl1 > pl2) return -1;
  if (pl1 < pl2) return 1;
  return 0;
};
