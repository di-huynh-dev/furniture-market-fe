import { removeFromWishlist } from '@/redux/reducers/buyer/wishlistSlice'
import { WishlistItem } from '@/types/wishlist.type'
import { formatPrice } from '@/utils/helpers'
import { CiCircleRemove } from 'react-icons/ci'
import { useDispatch } from 'react-redux'

const WishlistItemComponent: React.FC<{ item: WishlistItem }> = ({ item }) => {
  const dispatch = useDispatch()

  const removeItemFromTheWishlist = (item: WishlistItem) => {
    dispatch(removeFromWishlist(item))
  }

  return (
    <div className="flex space-x-3 w-full mb-10 border-b border-base-300 pb-6 last:border-b-0">
      <img src={item.thumbnail} alt={item.name} className="lg:h-24 lg:w-24 h-12 w-12 rounded-lg object-cover" />
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
          <div className="flex-1">
            <p className="font-bold">{item.name}</p>
            <div className="mt-2 flex items-center gap-1 text-sm">
              <p className="font-bold">Chất liệu:</p>
              <p>{item.material}</p>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm">
              <p className="font-bold">Kích thước:</p>
              <p className="text-sm">{item.size}</p>
            </div>
          </div>
          <div className="mt-2 flex lg:items-center space-x-2 flex-col-reverse">
            {item.salePrice ? (
              <>
                <div className="lg:text-xl text-sm text-secondary font-semibold">
                  Giá: {formatPrice(item.salePrice)}
                </div>
                <div className="text-sm flex gap-2">
                  <p className="line-through"> {formatPrice(item.price)}</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl text-secondary font-semibold">
                  {formatPrice(item.price * item.wishlistQuantity)}
                </div>
                <div className="text-sm flex gap-2">
                  <div className="">Giá: {formatPrice(item.price)}</div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-2 md:flex md:items-center md:justify-end">
          <button className="btn btn-ghost" onClick={() => removeItemFromTheWishlist(item)}>
            Xóa
            <CiCircleRemove className="w-[30px] h-[30px]" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default WishlistItemComponent
