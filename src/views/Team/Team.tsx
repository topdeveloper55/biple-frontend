import TeamCard from 'components/TeamCard';
import { teamData } from 'constant';

const Team = () => {
  return (
    <div className="flex-grow flex flex-col bg-white dark:bg-[#111111] shadow-sm gap-[36px] py-[26px] px-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800">
      <div className="flex flex-grow items-start">
        <div className="grid 2xl:grid-cols-3 xl:grid-cols-2 gap-4 w-full">
          {teamData.map((data: any, index: number) => (
            <TeamCard key={index} data={data} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
