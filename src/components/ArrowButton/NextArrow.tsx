/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaArrowCircleRight } from 'react-icons/fa'

const NextArrow = (props: any) => {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', color: '#DFAD7C', fontSize: '24px' }}
      onClick={onClick}
    >
      <FaArrowCircleRight />
    </div>
  )
}

export default NextArrow
