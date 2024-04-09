import { Seller_QueryKeys } from '@/constants/query-keys'
import axiosClient from '@/libs/axios-client'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AiOutlineHeart } from 'react-icons/ai'
import { FaStar } from 'react-icons/fa'
import { formatPrice } from '@/utils/helpers'

const BuyerProductDetail = () => {
  const { id } = useParams()
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState('')

  const { data: product_detail, isLoading } = useQuery({
    queryKey: [Seller_QueryKeys.PRODUCT_DETAIL],
    queryFn: async () => {
      const resp = await axiosClient.get(`/product/${id}`)
      console.log(resp)

      setSelectedImage(resp.data.data.images[0])
      return resp.data.data
    },
    enabled: !!id,
  })

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setSelectedImageIndex(imageUrl)
  }
  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid lg:grid-cols-2 grid-col-1 gap-10 align-element bg-white p-5 my-5">
            <div className="">
              <img src={selectedImage} className="border-solid border-2 rounded-xl " />
              <div className="grid md:grid-cols-6 grid-cols-4 gap-1 mt-2 ">
                {product_detail.images.map((url: string) => {
                  return (
                    <img
                      key={url}
                      src={url}
                      alt={product_detail.name}
                      className={`rounded-xl object-fit h-[75px] border-solid border-2 ${
                        selectedImageIndex === url ? 'border-info' : 'border-gray-300'
                      }`}
                      onClick={() => handleImageClick(url)}
                    />
                  )
                })}
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <h2 className="lg:text-4xl md:text-2xl text-base font-bold">{product_detail.name}</h2>
                <AiOutlineHeart className="w-[30px] h-[30px] text-primary transition-colors duration-300" />
              </div>
              <div className="flex justify-between p-2 lg:text-base text-sm">
                <div className="flex items-center">
                  <FaStar />({product_detail.reviewAmount} đánh giá)
                </div>
                <span>
                  <b>Đã bán: </b>
                  {product_detail.sold}
                </span>
              </div>
              {product_detail.onSale ? (
                <div className="lg:text-lg text-base">
                  <span className="text-primary font-bold pr-4">{formatPrice(product_detail.salePrice)}</span>
                  <span className="line-through">{formatPrice(product_detail.price)}</span>
                </div>
              ) : (
                <div className="lg:text-lg text-base">
                  <span className="text-primary text-2xl font-bold pr-4">{formatPrice(product_detail.price)}</span>
                </div>
              )}
              <div className="lg:text-base text-sm">
                <div className="pb-2 border-b-2">
                  <span className="text-sm tex-base-300">SKU: {product_detail.id}</span>
                </div>
                <p className="py-2">
                  <b>Chất liệu: </b>
                  {product_detail.material}
                </p>
                <p className="py-2">
                  <b>Kích thước: </b>
                  {product_detail.size}
                </p>
                <p className="py-2">
                  <b>Số lượng còn lại: </b>
                  {product_detail.inStock}
                </p>
                {product_detail.storeCategories[0] && (
                  <p className="py-2">
                    <b>Danh mục: </b>
                    {product_detail.storeCategories.map((category: string) => category).join(', ')}
                  </p>
                )}
                <p className="py-2 leading-loose">
                  <b>Mô tả: </b>
                  {product_detail.description}
                </p>
              </div>
            </div>
          </div>
          <div className="my-5 bg-white align-element p-10 grid grid-cols-5 gap-4">
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-2">
                <img src={product_detail.storeInfo.logo} alt="" className="rounded-full w-40 h-40 object-cover" />
                <div className="space-y-2">
                  <p className="text-lg font-bold">{product_detail.storeInfo.shopName}</p>
                  <p className="text-sm text-gray-500">{product_detail.storeInfo.address}</p>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-sm btn-primary text-white">Xem shop</button>
                    <button className="btn btn-sm btn-outline">Chat</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 col-span-3">
              <div className="flex gap-2">
                <p>Số lượng đánh giá: </p>
                <p className="text-primary">{product_detail.storeInfo.avgReviewStar}</p>
              </div>
              <div className="flex gap-2">
                <p>Tổng số sản phẩm: </p>
                <p className="text-primary">{product_detail.storeInfo.productAmount}</p>
              </div>
              <div className="flex gap-2">
                <p>Số lượng đánh giá: </p>
                <p className="text-primary">{product_detail.storeInfo.numReview}</p>
              </div>
              <div className="flex gap-2">
                <p>Số người theo dõi: </p>
                <p className="text-primary">{product_detail.storeInfo.numReview}</p>
              </div>
              <div className="flex gap-2">
                <p>Đã tham gia: </p>
                <p className="text-primary">12.04.2022</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default BuyerProductDetail
