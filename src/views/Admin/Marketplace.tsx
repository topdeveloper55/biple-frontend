import { Checked, Unchecked } from 'components/Icon';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { JwtService } from 'services';
import { selectCommunity } from 'slices';
import { RootState } from 'store';

const Marketplace = () => {
  const roomInfo = useSelector(
    (state: RootState): any => state.community.current
  );
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  useEffect(() => {
    if (roomInfo) {
      if (roomInfo.visibleTabs.includes('marketplace')) setShow(true);
      else setShow(false);
    }
  }, [roomInfo]);
  const handleShowChange = async () => {
    if (loading) return;
    setLoading(true);
    let visibleTabs;
    if (show) {
      visibleTabs = roomInfo.visibleTabs.filter(
        (tab: string) => tab !== 'marketplace'
      );
    } else {
      visibleTabs = [...roomInfo.visibleTabs, 'marketplace'];
    }
    const ret = await JwtService.updateServer({
      ...roomInfo,
      id: roomInfo._id,
      visibleTabs,
    }).catch((e) => {
      addToast(e, { appearance: 'error' });
      setLoading(false);
      return;
    });
    setLoading(false);
    if (ret) {
      dispatch(selectCommunity(ret));
      return addToast('Updated successfully', { appearance: 'success' });
    }
    addToast('Something went wrong!', { appearance: 'error' });
  };
  return (
    <div className="flex-grow flex flex-col bg-white dark:bg-[#111111] shadow-sm gap-9 py-8 px-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800">
      <div className="flex flex-col flex-grow items-start gap-2 mt-4">
        <p className="text-2xl text-primary font-bold mb-8 dark:text-white">
          Marketplace Settings
        </p>
        <div
          className="flex w-full items-center gap-2 text-sm font-semibold text-secondary cursor-pointer"
          onClick={() => handleShowChange()}
        >
          {show ? <Checked /> : <Unchecked />}
          <p className="text-primary dark:text-white">Show marketplace</p>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
