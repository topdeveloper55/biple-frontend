// import { Cross } from './icon'

const Modal = ({ children, open, onClose }: any) => {
  if (!open) return null
  return (
    <div onClick={onClose} className="absolute w-full h-screen top-0 left-0 bg-[#F5F5F5B2] dark:bg-[#d3d3d315] z-[100] flex justify-center items-center cursor-default">
      <div onClick={(e) => e.stopPropagation()} className="relative max-w-[680px] shadow-md w-full rounded-lg bg-white dark:bg-[#111111] px-[78px] py-[68px] max-h-full overflow-y-auto text-[#a6aacf] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-zinc-700 dark:scrollbar-track-neutral-800">
        {children}
        {/* <div
          className="cursor-pointer absolute top-10 right-10"
          onClick={onClose}
        >
          <Cross />
        </div> */}
      </div>
    </div>
  )
}

export default Modal
