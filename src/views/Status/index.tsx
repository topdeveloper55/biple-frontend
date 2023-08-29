const NotFound = () => {
  return (
    <div className="flex-grow flex flex-col bg-white dark:bg-[#111111] shadow-sm gap-[36px] py-[26px] px-[80px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800">
      <p className="text-[64px] font-semibold text-primary dark:text-white">
        404 Not found!
      </p>
    </div>
  );
};

export default NotFound;
