import axiosClient from '@/libs/axios-client'
import { ProductDetailType } from '@/types/product.type'
import { useMutation } from '@tanstack/react-query'
import BuyerProductCard from './BuyerProductCard'
import { useEffect, useState } from 'react'

const ProductList = () => {
  const [productList, setProductList] = useState<ProductDetailType[]>([])
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(16)
  const [totalPages, setTotalPages] = useState<number>(0)

  const searchMutation = useMutation({
    mutationFn: async () => {
      const resp = await axiosClient.get(`/product/search-filter?currentPage=${currentPage}&pageSize=${pageSize}`)
      console.log(resp.data.data)

      return resp
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
  }, [currentPage, pageSize])

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
      <div className="grid grid-cols-4 gap-2">
        {productList.map((product: ProductDetailType) => (
          <BuyerProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  )
}

export default ProductList
