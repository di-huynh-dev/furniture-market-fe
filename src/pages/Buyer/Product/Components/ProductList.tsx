import axiosClient from '@/libs/axios-client'
import { ProductDetailType } from '@/types/product.type'
import { useMutation } from '@tanstack/react-query'
import BuyerProductCard from './BuyerProductCard'
import { useEffect, useState } from 'react'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { useSelector } from 'react-redux'
import { selectAuth } from '@/redux/reducers/authSlice'

const ProductList = ({ selectedCategory }: { selectedCategory: string }) => {
  const [productList, setProductList] = useState<ProductDetailType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(12)
  const [totalPages, setTotalPages] = useState<number>(0)
  const user = useSelector(selectAuth)
  const axiosPrivate = useAxiosBuyerPrivate()
  const searchMutation = useMutation({
    mutationFn: async () => {
      if (!user.authData.accessToken) {
        const resp = await axiosClient.get(
          `/product/search-filter?category.contains=name,${selectedCategory}&currentPage=${currentPage}&pageSize=${pageSize}`,
        )
        return resp
      } else {
        const resp = await axiosPrivate.get(
          `/product/search-filter?category.contains=name,${selectedCategory}&currentPage=${currentPage}&pageSize=${pageSize}`,
        )
        return resp
      }
    },
    onSuccess: (resp) => {
      const searchData = resp.data.data || {}
      setPageSize(searchData.pageSize)
      setCurrentPage(searchData.currentPage)
      setTotalPages(searchData.totalPages)
      setProductList(searchData.content || [])
    },
    onError: (error) => {
      console.error(error)
    },
  })

  useEffect(() => {
    searchMutation.mutate()
  }, [currentPage, pageSize, selectedCategory])

  return (
    <div className="my-4 bg-white p-4">
      <div className="flex justify-between items-center mb-6">
        <p>Tất cả sản phẩm</p>
        <div className="flex gap-2 items-center">
          <div className="text-sm">
            Trang {currentPage + 1}/{totalPages}
          </div>
          <div className="join">
            {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
              <button
                onClick={() => setCurrentPage(page)}
                key={page}
                className={`join-item btn-xs ${page === currentPage ? 'btn btn-active btn-primary text-white' : 'btn'}`}
              >
                {page + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      {productList.length === 0 && <p className="text-center my-10">Không có sản phẩm nào được tìm thấy</p>}
      <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-x-2 gap-y-8">
        {productList.map((product: ProductDetailType) => (
          <BuyerProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  )
}

export default ProductList
