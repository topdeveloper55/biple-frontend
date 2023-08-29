import {useEffect} from 'react'
import Selector from './Selector';
import { selectRoom } from 'action/navigation';
import { MatrixService } from 'services';

const RoomsCategory = ({
  roomIds, drawerPostie
}) => {
  const mx = MatrixService.matrixClient
  useEffect(() => {
    const updateMemberPresence = (e) => {
      console.log("=-=-=--=-=-=-=-==-", e)
    }
    mx.on('m.presence', updateMemberPresence)
    return () => {
      mx.removeListener('m.presence', updateMemberPresence)
    }
  }, [])
  const renderSelector = (roomId) => {
    return (
      <Selector
        key={roomId}
        roomId={roomId}
        isDM={true}
        drawerPostie={drawerPostie}
        onClick={() => (selectRoom(roomId))}
      />
    );
  };
  return (
    <div className="room-category">
      <div className="room-category__content w-full flex flex-col gap-2">
        {roomIds.map(renderSelector)}
      </div>
    </div>
  );
}

export default RoomsCategory;
