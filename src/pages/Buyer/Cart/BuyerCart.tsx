import CartItemList from './components/CartItemList'
import CartTotal from './components/CartTotal'

const BuyerCart = () => {
  return (
    <div className="align-element">
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>Giỏ hàng</a>
          </li>
        </ul>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 my-2">
        <div className="lg:col-span-8">
          <CartItemList />
        </div>
        <div className="lg:col-span-4 lg:pl-4 ">
          <CartTotal />
        </div>
      </div>
    </div>
  )
}

export default BuyerCart
