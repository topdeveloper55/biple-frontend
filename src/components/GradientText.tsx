
const GradientText = ({ size, value, align }: { size: number, value: string, align?: string }) => {
  return <p className={` text-${align ? align : 'center'} font-bold text-transparent text-[${size}px] bg-clip-text bg-gradient-to-r from-[#4776E6] to-[#8E54E9]`} >
    {value}
  </p>
}
export default GradientText;