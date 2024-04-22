import { ProductDetailType } from '@/types/product.type'
import { formatPrice } from '@/utils/helpers'
import { AiOutlineHeart } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { BsStarFill } from 'react-icons/bs'
import { CiLocationOn } from 'react-icons/ci'
import { useDispatch } from 'react-redux'
import { addToCart, getTotals } from '@/redux/reducers/buyer/cartSlice'
// import { addItemToWishlist, getTotalsWishlist } from '@/redux/reducers/buyer/wishlistSlice'
import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'

const BuyerProductCard: React.FC<ProductDetailType> = ({
  id,
  thumbnail,
  name,
  inStock,
  sold,
  price,
  material,
  weight,
  height,
  length,
  width,
  featured,
  salePrice,
  onSale,
  reviewAmount,
  storeInfo,
}) => {
  const product = {
    id,
    thumbnail,
    name,
    inStock,
    sold,
    weight,
    height,
    length,
    width,
    price,
    featured,
    salePrice,
    onSale,
    reviewAmount,
    storeInfo,
    material,
  }
  const axiosPrivate = useAxiosBuyerPrivate()
  const dispatch = useDispatch()
  const handleAddToCart = () => {
    dispatch(addToCart(product))
    dispatch(getTotals())
  }

  const addToWishlistMutation = useMutation({
    mutationFn: async (id: string) => {
      const resp = await axiosPrivate.put(`/buyer/favourite-product/${id}`)
      return resp
    },
    onSuccess: (resp) => {
      toast.success(resp.data.messages[0])
    },
    onError: (error) => {
      console.log(error)
    },
  })
  const handleAddToWishlist = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    addToWishlistMutation.mutate(id)
  }
  return (
    <div key={id} className="card w-full hover:shadow-2xl ease-in-out duration-300 bg-white">
      <Link to={`/product/${id}`}>
        <figure className="px-2 pt-2 relative">
          <img src={thumbnail} alt={name} className="rounded-xl lg:h-64 md:h-48 w-full object-cover" />
        </figure>
        <div className="flex">
          <button
            onClick={handleAddToWishlist}
            className="absolute btn btn-circle bg-white top-[-20px] right-2 p-1 text-white tracking-wide group"
          >
            <AiOutlineHeart className="w-[30px] h-[30px] text-info transition duration-300 group-hover:text-red-500" />
          </button>
          {featured && (
            <span className="absolute top-2 left-2 badge badge-error text-white tracking-wide text-lg">HOT</span>
          )}
        </div>
        <div className="card-body p-4 md:p-4 lg:p-8">
          <div className="min-h-[60px]">
            <h2 className="card-title capitalize text-sm lg:text-lg">{name}</h2>
          </div>
          {onSale ? (
            <div className="flex justify-between lg:text-lg md:text-sm text-sm">
              <span className=" text-left line-through text-gray-400">{formatPrice(price)}</span>
              <span className="text-secondary text-left font-bold">{formatPrice(salePrice)}</span>
            </div>
          ) : (
            <div className="">
              <span className="text-secondary text-left">{formatPrice(price)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <div className="flex gap-1">
              <BsStarFill className="text-yellow-500" />
              <BsStarFill className="text-yellow-500" />
              <BsStarFill className="text-yellow-500" />
              <BsStarFill className="text-yellow-500" />
              <BsStarFill className="text-yellow-500" />
              <span className="text-sm">({reviewAmount})</span>
            </div>
            <span className="text-sm">Đã bán: {sold}</span>
          </div>
          <div className="flex items-center gap-1">
            <CiLocationOn />
            <span className="text-sm text-gray-400">
              {storeInfo?.address.split(',')[storeInfo?.address.split(',').length - 1].trim()}
            </span>
          </div>
        </div>
      </Link>
      {inStock === 0 || inStock < 0 ? (
        <p className="text-warning text-center">Sản phẩm tạm hết hàng!</p>
      ) : (
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center rounded-md bg-info px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 cursor-pointer"
        >
          <IoMdAddCircleOutline className="w-6 h-6" />
          Thêm vào giỏ hàng
        </button>
      )}
    </div>
  )
}

export default BuyerProductCard
