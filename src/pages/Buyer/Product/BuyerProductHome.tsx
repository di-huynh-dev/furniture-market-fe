import { useEffect, useState } from 'react'
import ProductList from './Components/ProductList'
import SystemCategoryList from './Components/SystemCategoryList'
import TopShopList from './Components/TopShopList'

const BuyerProductHome = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(' ')

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Fnest - Tất cả sản phẩm'
  }, [])
  return (
    <section className="align-element">
      <SystemCategoryList setSelectedCategory={setSelectedCategory} />
      <TopShopList />
      <ProductList selectedCategory={selectedCategory} />
    </section>
  )
}

export default BuyerProductHome
