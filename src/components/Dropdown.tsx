import { useEffect, useRef, useState } from 'react'

interface Props {
  options: {
    value: string
    label: string
  }[]
  onChange: (_: { value: string; label: string }) => void
  current: { value: string; label: string }
  id: string
  type?: string
}

const Dropdown = ({ options, onChange, current, id, type }: Props) => {
  const [open, setOpen] = useState(false)
  const picker = useRef<HTMLDivElement>(null)
  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  })
  const handleClick = (e: any) => {
    if (!picker.current) return
    if (!e.target.closest(`#${picker.current.id}`) && open) {
      setOpen(false)
    }
  }
  return (
    <div className="flex relative" ref={picker} id={id}>
      <button
        onClick={() => setOpen((open) => !open)}
        id="dropdownButton"
        className={`${
          type === 'transparent'
            ? 'hover:bg-gradient-to-r from-[#4776E619] to-[#8E54E919] dark:hover:bg-[#1F1F22] justify-center'
            : 'bg-gradient-to-r from-[#4776E619] to-[#8E54E919] dark:bg-[#1F1F22] hover:bg-[#e3e3e5] dark:hover:bg-[#222233] justify-between'
        } font-semibold text-secondary rounded-lg text-center py-[8px] px-[12px] flex gap-2 items-center w-full`}
        type="button"
      >
        <p className="text-[15px]">{current.label}</p>
        <svg
          className="max-w-[13px] max-h-[8px]"
          width="13"
          height="8"
          viewBox="0 0 13 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.3895 0L6.5 4.47842L1.61048 0L0 1.47507L6.5 7.42857L13 1.47507L11.3895 0Z"
            fill="url(#paint0_linear_213_170)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_213_170"
              x1="7.30429e-08"
              y1="3.67519"
              x2="12.3774"
              y2="3.67519"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4776E6" />
              <stop offset="1" stopColor="#8E54E9" />
            </linearGradient>
          </defs>
        </svg>
      </button>

      {/* <!-- Dropdown menu --> */}
      {open && (
        <div
          className={`z-[100] min-w-full mr-2 text-base list-none bg-white absolute ${
            type === 'transparent' ? 'bottom-[40px]' : 'top-[40px]'
          } rounded divide-y divide-gray-100 shadow dark:bg-gray-700`}
        >
          <ul className="py-1" aria-labelledby="dropdownButton">
            {options.map((option: { value: string; label: string }) => {
              return (
                <li key={option.value}>
                  <span
                    onClick={() => {
                      onChange(option)
                      setOpen(false)
                    }}
                    className="flex min-w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white whitespace-nowrap"
                  >
                    {option.label}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Dropdown
