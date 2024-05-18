import { useEffect } from 'react'
import ProductList from './Components/ProductList'
import SystemCategoryList from './Components/SystemCategoryList'
import TopShopList from './Components/TopShopList'

const BuyerProductHome = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Fnest - Tất cả sản phẩm'
  }, [])
  return (
    <section className="align-element">
      <SystemCategoryList />
      <TopShopList />
      <ProductList />
    </section>
  )
}

export default BuyerProductHome
