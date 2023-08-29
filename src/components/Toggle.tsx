const Toggle = ({value, onChange, label}: any) => {
  return (
    <div className="flex items-center justify-center w-full">
      <label htmlFor={label} className="flex items-center cursor-pointer">
        <div className="relative">
          <input type="checkbox" id={label} className="sr-only" onChange={onChange} checked={value} />
          <div className="block bg-[#d3d3d3] dark:bg-[#3f3f3f] w-14 h-8 rounded-full"></div>
          <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
        </div>
        <div className="ml-3 text-gray-700 font-medium">{label}</div>
      </label>
    </div>
  )
}

export default Toggle;