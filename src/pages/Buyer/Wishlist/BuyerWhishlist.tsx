import WishlistItemList from './components/WishlistItemList'

const BuyerWhishlist = () => {
  return (
    <div>
      <div className="align-element">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <a>Home</a>
            </li>
            <li>
              <a>Sản phẩm yêu thích</a>
            </li>
          </ul>
        </div>

        <div className="">
          <WishlistItemList />
        </div>
      </div>
    </div>
  )
}

export default BuyerWhishlist
