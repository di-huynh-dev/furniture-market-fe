import { clearWishlist, getTotalsWishlist, selectWishlist } from '@/redux/reducers/buyer/wishlistSlice'
import { useSelector } from 'react-redux'
import image from '@/assets/images/no-item.jpg'
import WishlistItem from './WishlistItem'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
const WishlistItemList = () => {
  const wishlist = useSelector(selectWishlist)
  const dispatch = useDispatch()

  const handleDeleteAll = () => {
    dispatch(clearWishlist())
    dispatch(getTotalsWishlist())
    toast.success('Đã xóa tất cả sản phẩm khỏi wishlist!')
  }
  return (
    <div className="card py-4 bg-base-100 shadow-sm mx-2 lg:px-10 px-4">
      {wishlist.wishlistItemList.length === 0 ? (
        <div className="flex flex-col items-center lg:text-xl text-sm py-10">
          <img src={image} alt="Giỏ hàng trống" className="w-1/2 h-1/2" />
          <p className="font-bold">Không có sản phẩm yêu thích nào!</p>
          <p>Hãy tiếp tục mua sắm thoải mái bạn nhé!</p>
        </div>
      ) : (
        <>
          {wishlist.wishlistItemList.map((item) => (
            <WishlistItem item={item} key={item.id} />
          ))}
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
            <button className="btn btn-ghost btn-info">Khám phá ngay</button>
            <button
              className="btn btn-ghost btn-primary"
              onClick={() => {
                handleDeleteAll()
              }}
            >
              Xóa tất cả
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default WishlistItemList
