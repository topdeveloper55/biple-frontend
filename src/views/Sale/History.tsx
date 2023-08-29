import { useState } from 'react';
import HistoryCard from 'components/HistoryCard';
import { Cross } from 'components/Icon';
const histories = [
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
  {
    name: 'Villager #13877',
    type: 'Transfer',
    from: 'Null Address',
    to: 'You',
    date: 'one year ago',
    image:
      'https://looksrare.mo.cloudinary.net/0x0000000005756B5a03E751bD0280e3A55BC05B6E/0xbd2880c5913f8013b6f2b2f68c9c40f62535d6f42e8c8749e940e32dd6515798?resource_type=image&f=auto&c=limit&w=48&q=auto',
  },
];
const categoryList = ['Mint', 'Transfer', 'Sale', 'Offer', 'Listing'];
const History = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const toggleSelect = (value: string) => {
    if (categories.includes(value))
      setCategories(categories.filter((item) => item !== value));
    else setCategories([...categories, value]);
  };
  return (
    <div className="flex-grow flex flex-col bg-white dark:bg-[#111111] shadow-sm gap-9 py-[26px]">
      <div className="flex gap-3 flex-wrap px-20">
        {categoryList.map((value, index) => (
          <button
            key={index}
            onClick={() => toggleSelect(value)}
            className={`rounded-lg px-6 py-2 flex justify-start gap-[18px] items-center ${
              categories.includes(value)
                ? 'bg-gradient-to-r from-[#4776E6] to-[#8E54E9] text-white'
                : 'bg-gradient-to-r from-[#4776E620] to-[#8E54E920] text-primary dark:text-white hover:from-[#4776E640] hover:to-[#8E54E940]'
            }`}
          >
            {value}
          </button>
        ))}
        {categories.length > 0 && (
          <button
            onClick={() => setCategories([])}
            className="rounded-lg px-6 py-2 flex justify-start gap-1 items-center bg-gradient-to-r from-[#4776E620] to-[#8E54E920] text-primary dark:text-white hover:from-[#4776E640] hover:to-[#8E54E940]"
          >
            <div className="max-w-3.5 flex">
              <Cross />
            </div>
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-col overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800 px-20 divide-y divide-[#697A8D33]">
        {histories.map((item, index) => (
          <HistoryCard data={item} key={index} />
        ))}
      </div>
    </div>
  );
};

export default History;
