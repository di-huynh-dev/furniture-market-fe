import { FaArrowCircleLeft } from 'react-icons/fa'

/* eslint-disable @typescript-eslint/no-explicit-any */
const PrevArrow = (props: any) => {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', color: '#DFAD7C', fontSize: '24px' }}
      onClick={onClick}
    >
      <FaArrowCircleLeft />
    </div>
  )
}

export default PrevArrow
