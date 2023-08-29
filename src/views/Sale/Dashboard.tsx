import { useState } from 'react';
import Dropdown from 'components/Dropdown';
import SaleCard from 'components/SaleCard';
import { saleData } from 'constant';

const backgrounds = [
  {
    value: 'red',
    label: 'Red',
  },
  {
    value: 'blue',
    label: 'Blue',
  },
  {
    value: 'grey',
    label: 'Grey',
  },
];
const bodies = [
  {
    value: 'iron',
    label: 'Iron',
  },
  {
    value: 'silver',
    label: 'Silver',
  },
  {
    value: 'gold',
    label: 'Gold',
  },
];
const hairs = [
  {
    value: 'black',
    label: 'Black',
  },
  {
    value: 'blue',
    label: 'Blue',
  },
  {
    value: 'red',
    label: 'Red',
  },
];
const faces = [
  {
    value: 'mask',
    label: 'Mask',
  },
  {
    value: 'glasses',
    label: 'Glasses',
  },
];
const heads = [
  {
    value: 'iron',
    label: 'Iron',
  },
  {
    value: 'silver',
    label: 'Silver',
  },
  {
    value: 'gold',
    label: 'Gold',
  },
];
const piercings = [
  {
    value: 'iron',
    label: 'Iron',
  },
  {
    value: 'silver',
    label: 'Silver',
  },
  {
    value: 'gold',
    label: 'Gold',
  },
];

const Dashboard = () => {
  const [background, setBackground] = useState({
    value: '',
    label: 'Background',
  });
  const [body, setBody] = useState({ value: '', label: 'Body' });
  const [face, setFace] = useState({ value: '', label: 'Face' });
  const [hair, setHair] = useState({ value: '', label: 'Hair' });
  const [head, setHead] = useState({ value: '', label: 'Head' });
  const [piercing, setPiercing] = useState({ value: '', label: 'Piercing' });
  return (
    <div className="flex-grow w-full flex flex-col bg-white dark:bg-[#111111] shadow-sm gap-9 py-[26px]">
      <div className="flex items-center gap-4 px-20 flex-wrap">
        <Dropdown
          id="background"
          current={background}
          onChange={setBackground}
          options={backgrounds}
        />
        <Dropdown
          id="body"
          current={body}
          onChange={setBody}
          options={bodies}
        />
        <Dropdown id="face" current={face} onChange={setFace} options={faces} />
        <Dropdown id="hair" current={hair} onChange={setHair} options={hairs} />
        <Dropdown id="head" current={head} onChange={setHead} options={heads} />
        <Dropdown
          id="piercing"
          current={piercing}
          onChange={setPiercing}
          options={piercings}
        />
        <p className="font-semibold text-secondary tetx-[15px]">More...</p>
      </div>
      <div className="flex flex-grow px-20 items-start overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800">
        <div className="grid 3xl:grid-cols-5 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-4 w-full">
          {saleData.map((nft: any, index: number) => (
            <SaleCard key={index} data={nft} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
