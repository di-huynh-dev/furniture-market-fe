/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from 'react-redux'
import image from '@/assets/images/no-item.jpg'
import { selectAuth } from '@/redux/reducers/authSlice'
import { Buyer_QueryKeys } from '@/constants/query-keys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { toast } from 'react-toastify'
import { CiCircleRemove } from 'react-icons/ci'
import { LoadingComponent } from '@/components'
import { Link } from 'react-router-dom'

const WishlistItemList = () => {
  const axiosPrivate = useAxiosBuyerPrivate()
  const user = useSelector(selectAuth)
  const client = useQueryClient()

  const { data: userWishlist, isLoading } = useQuery({
    queryKey: [Buyer_QueryKeys.USER_WISHLIST],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/buyer/favourite-product')
      return resp.data.data
    },
    enabled: !!user.authData.accessToken,
  })
  const addToWishlistMutation = useMutation({
    mutationFn: async (id: string) => {
      const resp = await axiosPrivate.put(`/buyer/favourite-product/${id}`)
      return resp
    },
    onSuccess: (resp) => {
      toast.success(resp.data.messages[0])
      client.invalidateQueries({
        queryKey: [Buyer_QueryKeys.USER_WISHLIST],
      })
    },
    onError: (error: any) => {
      toast.error(error.response.data.messages[0])
    },
  })

  if (isLoading) return <LoadingComponent />
  return (
    <div className="">
      {userWishlist?.length === 0 ? (
        <div className="flex flex-col items-center lg:text-xl text-sm py-10">
          <img src={image} alt="Giỏ hàng trống" className="w-1/4 h-1/4" />
          <p className="font-bold">Không có sản phẩm yêu thích nào!</p>
          <p>Hãy tiếp tục mua sắm thoải mái bạn nhé!</p>
        </div>
      ) : (
        <div className="card py-4 bg-base-100 shadow-sm m-2 lg:px-10 px-4">
          {userWishlist.map((item: { id: string; thumbnail: string; name: string; material: string }) => (
            <Link to={`/product/${item.id}`}>
              <div className="flex space-x-3 w-full mb-10 border-b border-base-300 pb-6 last:border-b-0">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="lg:h-24 lg:w-24 h-12 w-12 rounded-lg object-cover"
                />
                <div className="flex-1 flex flex-col">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
                    <div className="flex-1">
                      <p className="font-bold">{item.name}</p>
                      <div className="mt-2 flex items-center gap-1 text-sm">
                        <p className="font-bold">Chất liệu:</p>
                        <p>{item.material}</p>
                      </div>
                    </div>
                    <div className="mt-2 md:flex md:items-center md:justify-end">
                      <button className="btn btn-ghost" onClick={() => addToWishlistMutation.mutate(item.id)}>
                        Bỏ yêu thích
                        <CiCircleRemove className="w-[30px] h-[30px]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default WishlistItemList
