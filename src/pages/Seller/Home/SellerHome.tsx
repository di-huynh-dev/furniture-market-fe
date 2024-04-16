import { SellerHeader } from '@/components'
import { DrawerSide } from '@/components'
import { useEffect } from 'react'

const SellerHome = () => {
  useEffect(() => {
    document.title = 'Fnest - Kênh người bán'
  }, [])
  return (
    <div className="bg-gray-100">
      <SellerHeader />
      <DrawerSide />
    </div>
  )
}

export default SellerHome
