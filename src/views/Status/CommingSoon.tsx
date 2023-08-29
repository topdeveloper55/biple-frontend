import logoLight from 'assets/images/logos/logo_light.png';
import logoDark from 'assets/images/logos/logo_dark.png';

const ComingSoon = () => {
  return (
    <div className="flex-grow flex flex-col justify-center items-center bg-white dark:bg-[#111111] shadow-sm gap-3 py-[26px] px-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800">
      <img className="hidden dark:block max-w-[180px]" src={logoDark} alt="" />
      <img className="dark:hidden block max-w-[180px]" src={logoLight} alt="" />
      <p className="text-[64px] font-semibold text-primary dark:text-white">
        Coming soon!
      </p>
      <p className="text-xl font-semibold text-secondary dark:text-white">
        Get ready! Something really cool is coming!
      </p>
    </div>
  );
};

export default ComingSoon;
