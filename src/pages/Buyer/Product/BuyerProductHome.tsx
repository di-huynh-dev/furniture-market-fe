import ProductList from './Components/ProductList'
import SystemCategoryList from './Components/SystemCategoryList'
import TopShopList from './Components/TopShopList'

const BuyerProductHome = () => {
  return (
    <section className="align-element">
      <SystemCategoryList />
      <TopShopList />
      <ProductList />
    </section>
  )
}

export default BuyerProductHome
