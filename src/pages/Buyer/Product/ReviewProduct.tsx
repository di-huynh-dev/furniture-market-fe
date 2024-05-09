/* eslint-disable @typescript-eslint/no-explicit-any */
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaRegStar, FaStar } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'

const ReviewProduct = () => {
  const axiosPrivate = useAxiosBuyerPrivate()
  const { id } = useParams()
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const navigation = useNavigate()

  useEffect(() => {
    scrollTo(0, 0)
  }, [])

  const { data: productDetail, isLoading } = useQuery({
    queryKey: ['productDetail'],
    queryFn: async () => {
      const resp = await axiosPrivate.get(`/product/${id}`)
      return resp.data.data
    },
  })

  const handleReview = async () => {
    try {
      const review = {
        productId: id,
        content: content,
        star: rating,
      }
      const resp = await axiosPrivate.post('/buyer/review', review)
      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        setContent('')
        setRating(5)
        navigation('/product/' + id)
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  if (isLoading) return <div>Loading...</div>
  return (
    <>
      <div className="p-10">
        <div className="">
          <h3 className="font-bold text-lg capitalize">Đánh giá sản phẩm</h3>
          <div className="grid grid-cols-5 gap-2 items-center my-2">
            <figure>
              <img src={productDetail?.thumbnail} alt={productDetail?.name} className="h-20 w-20" />
            </figure>
            <div className="col-span-4">
              <h2 className="text-lg">{productDetail?.name}</h2>
              <div className="text-sm text-gray-500">
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <span className=" text-gray-400">Vật liệu: {productDetail?.material}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <input
            type="text"
            placeholder="Nhập đánh giá của bạn"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input input-bordered input-success w-full my-2"
          />
          <p>Chất lượng sản phẩm</p>
          <div className="flex gap-2 my-2 items-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <span key={index} onClick={() => setRating(index + 1)}>
                {index < rating ? (
                  <FaStar className="lg:w-8 lg:h-8 w-4 h-4 text-amber-500" />
                ) : (
                  <FaRegStar className="lg:w-8 lg:h-8 w-4 h-4 text-amber-500" />
                )}
              </span>
            ))}
            <span className="ml-2">
              {rating === 1 && ' Tệ'}
              {rating === 2 && ' Không hài lòng'}
              {rating === 3 && ' Bình thường'}
              {rating === 4 && ' Hài lòng'}
              {rating === 5 && ' Tuyệt vời'}
            </span>
          </div>
          <div className="modal-action">
            <button onClick={handleReview} className="btn btn-primary text-white">
              {'Gửi đánh giá'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReviewProduct
