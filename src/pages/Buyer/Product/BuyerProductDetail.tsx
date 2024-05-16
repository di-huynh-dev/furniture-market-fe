import { Seller_QueryKeys } from '@/constants/query-keys'
import axiosClient from '@/libs/axios-client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AiOutlineHeart } from 'react-icons/ai'
import { FaStar } from 'react-icons/fa'
import { formatDate, formatPrice } from '@/utils/helpers'
import { ReviewType } from '@/types/review.type'
import { useDispatch } from 'react-redux'
import { addToCart, getTotals } from '@/redux/reducers/buyer/cartSlice'

const BuyerProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [reviews, setReviews] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    scrollTo(0, 0)
    getReviewByStarsMutation.mutate(0)
  }, [])

  const { data: product_detail, isLoading } = useQuery({
    queryKey: [Seller_QueryKeys.PRODUCT_DETAIL],
    queryFn: async () => {
      const resp = await axiosClient.get(`/product/${id}`)
      setSelectedImage(resp.data.data.images[0])
      return resp.data.data
    },
    enabled: !!id,
  })
  console.log(product_detail)

  const getReviewByStarsMutation = useMutation({
    mutationFn: async (tabName: number) => {
      if (tabName === 0) {
        const resp = await axiosClient.get(`/review/search?product.equals=id,${id}`)
        return resp
      } else {
        const resp = await axiosClient.get(`/review/search?product.equals=id,${id}&star.equals=${tabName}`)
        return resp
      }
    },
    onSuccess: (resp) => {
      setReviews(resp.data.data.content)
    },
  })
  const handleTabClick = (tabName: number) => {
    setActiveTab(tabName)
    getReviewByStarsMutation.mutate(tabName)
  }

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setSelectedImageIndex(imageUrl)
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product_detail))
    dispatch(getTotals())
  }

  const handleAddToWishList = () => {}

  if (isLoading) {
    return <div>Loading...</div>
  }

  // Calculate the average rating
  // const averageRating: number | string = product_detail.totalReviewPoint / product_detail.reviewAmount

  return <></>
}

export default BuyerProductDetail
