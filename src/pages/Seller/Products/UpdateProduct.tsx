/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormInput, LoadingComponent } from '@/components'
import { useForm } from 'react-hook-form'
// import { yupResolver } from '@hookform/resolvers/yup'
// import * as yup from 'yup'
import { UpdateProductApiType } from '@/types/product.type'
import { useQuery } from '@tanstack/react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useState } from 'react'
import useImagePreview from '@/hooks/useImagePreview'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { Seller_QueryKeys } from '@/constants/query-keys'

export type FormData = UpdateProductApiType

interface CategoryType {
  id: string
  name: string
}

const UpdateProduct = () => {
  const axiosPrivate = useAxiosPrivate()
  const { previewImages: thumbnail, handleFileChange: handleThumbnailChange } = useImagePreview()
  const { previewImages: images, handleFileChange: handleImagesChange } = useImagePreview()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedSystemCategory, setSelectedSystemCategory] = useState<string>('')

  const { id } = useParams()

  const { data: shopCategories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['shopCategories'],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/seller/category')
      return resp.data.data
    },
  })

  const { data: systemCategories, isLoading: isLoadingSystemCategories } = useQuery({
    queryKey: [Seller_QueryKeys.SYSTEM_CATEGORY],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/category/system')
        if (resp.status === 200) {
          return resp.data.data
        }
      } catch (error: any) {
        toast.error(error.response.data.messages[0])
      }
    },
  })

  const handleUpdateProduct = async (data: FormData) => {
    setIsLoading(true)
    const formData = new FormData()

    const info: FormData = {}

    if (data.name) info['name'] = data.name
    if (data.price) info['price'] = data.price
    if (data.salePrice) info['salePrice'] = data.salePrice
    if (data.description) info['description'] = data.description
    if (data.size) info['size'] = data.size
    if (data.material) info['material'] = data.material
    if (data.inStock) info['inStock'] = data.inStock
    if (data.featured) info['featured'] = data.featured
    if (data.weight) info['weight'] = data.weight
    if (data.height) info['height'] = data.height
    if (data.length) info['length'] = data.length
    if (data.width) info['width'] = data.width
    if (data.used) info['used'] = data.used

    if (selectedCategory !== '') {
      info['storeCategoryId'] = selectedCategory
    }
    if (selectedSystemCategory !== '') {
      info['systemCategoryId'] = selectedCategory
    }
    const json = JSON.stringify(info)

    const blob = new Blob([json], {
      type: 'application/json',
    })

    formData.append('info', blob)
    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail[0])
    }

    if (data.images instanceof FileList) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append('images', data.images[i])
      }
    }

    try {
      const resp = await axiosPrivate.patch(`/seller/product/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (resp.status === 200) {
        toast.success(resp.data.messages[0])

        setIsLoading(false)
      } else {
        setIsLoading(false)
        toast.error(resp.data.messages[0])
      }
    } catch (error: any) {
      toast.error(error.response.data.message[0])
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({})

  if (isLoadingCategories || isLoadingSystemCategories) {
    return <LoadingComponent />
  }

  return (
    <section className="mx-4 my-2 text-sm">
      <div className="card shadow-lg my-2 bg-white">
        <div className="card-body">
          <form onSubmit={handleSubmit(handleUpdateProduct)} encType="multipart/form-data">
            <div className="my-2">
              <span className="font-bold text-xl">Cập nhật sản phẩm</span>
              <p className="text-error text-lg">Lưu ý: Chỉ nhập mới thông tin vào ô cần cập nhật</p>
              <div className="">
                <div className=" ">1. Hình ảnh sản phẩm</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="label" htmlFor="logo">
                      <span className="label-text capitalize text-sm">Thumbnail</span>
                    </label>
                    <input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      {...register('thumbnail')}
                      className="file-input file-input-bordered file-input-xs w-full max-w-xs"
                      onChange={handleThumbnailChange}
                    />
                    {errors.thumbnail?.message && <p className="text-red-500 text-sm">{errors.thumbnail.message}</p>}
                    {thumbnail &&
                      thumbnail.map((image, index) => (
                        <div key={`back-${index}`} className="mt-2">
                          <img src={image} alt={`Back Preview ${index}`} className="w-60 h-60" />
                        </div>
                      ))}
                  </div>
                  <div className="col-span-2">
                    <label className="label" htmlFor="logo">
                      <span className="label-text capitalize text-sm">Hình ảnh sản phẩm</span>
                    </label>
                    <input
                      id="logo"
                      type="file"
                      accept="image/*"
                      className="file-input file-input-bordered file-input-xs w-full max-w-xs"
                      {...register('images')}
                      onChange={handleImagesChange}
                      multiple
                    />
                    {errors.images?.message && <p className="text-red-500 text-sm">{errors.images.message}</p>}
                    <div className="grid grid-cols-4 gap-2">
                      {images &&
                        images.map((image, index) => (
                          <div key={`back-${index}`} className="mt-2 flex">
                            <img src={image} alt={`Back Preview ${index}`} className="w-60 h-60" />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div>
                  <span>2. Thông tin chi tiết sản phẩm</span>
                  <div className="px-10">
                    <FormInput
                      prop="name"
                      type="text"
                      label="Tên sản phẩm"
                      register={register}
                      placeholder="Bàn gỗ cao cấp Italia"
                      errorMessage={errors?.name?.message}
                    />

                    <FormInput
                      prop="material"
                      label="Chất liệu"
                      register={register}
                      type="text"
                      errorMessage={errors.material?.message}
                      placeholder="Ví dụ: Gỗ Beech, MDF Veneer beech"
                    />
                    <label className="label">
                      <span className="label-text capitalize text-sm">Mô tả chi tiết</span>
                    </label>
                    <textarea
                      rows={3}
                      {...register('description')}
                      className="textarea textarea-bordered w-full"
                      placeholder="Mô tả chi tiết sản phẩm"
                    ></textarea>
                  </div>
                </div>
                <div>
                  <span>3. Thông tin bán hàng</span>
                  <div className="px-10 grid grid-cols-3 gap-4">
                    <FormInput
                      label="Số lượng trong kho "
                      prop="inStock"
                      type="number"
                      placeholder="Vd: 124"
                      register={register}
                      errorMessage={errors.inStock?.message}
                    />
                    <FormInput
                      label="Giá nhập "
                      prop="price"
                      type="number"
                      placeholder="Vd: 124"
                      register={register}
                      errorMessage={errors.price?.message}
                    />
                    <FormInput
                      label="Giá bán "
                      prop="salePrice"
                      type="number"
                      placeholder="Vd: 124"
                      register={register}
                      errorMessage={errors.salePrice?.message}
                    />
                  </div>
                </div>

                <div>
                  <span>4. Thuộc</span>

                  <div className="mx-10 grid grid-cols-4 gap-4">
                    <select
                      onChange={(e) => setSelectedSystemCategory(e.target.value)}
                      className="select select-bordered w-full max-w-xs"
                    >
                      <option disabled selected>
                        Danh mục hàng của sàn
                      </option>
                      {systemCategories &&
                        systemCategories.map((category: CategoryType) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                    <select
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="select select-bordered w-full max-w-xs"
                    >
                      <option disabled selected>
                        Danh mục hàng của shop
                      </option>
                      {shopCategories &&
                        shopCategories.map((category: CategoryType) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                    <select className="select select-bordered w-full max-w-xs" {...register('used')}>
                      <option disabled selected value="">
                        Tình trạng
                      </option>
                      <option value="false">Mới</option>
                      <option value="true"> Đã qua sử dụng</option>
                    </select>

                    <div className="flex items-center">
                      <input
                        id="featured"
                        type="checkbox"
                        {...register('featured')} // Bind checkbox with register
                        className="form-checkbox h-5 w-5 text-blue-500"
                      />
                      <label htmlFor="featured" className="ml-2">
                        Sản phẩm nổi bật
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <span>5. Thông tin vận chuyển</span>
                  <div className="mx-10 md:grid grid-cols-4 gap-4">
                    <FormInput
                      label="Chiều dài(*)"
                      prop="length"
                      type="number"
                      placeholder="Đơn vị: cm"
                      register={register}
                    />
                    <FormInput
                      label="Chiều rộng(*)"
                      prop="width"
                      type="number"
                      placeholder="Đơn vị: cm"
                      register={register}
                    />
                    <FormInput
                      label="Chiều cao(*)"
                      prop="height"
                      type="number"
                      placeholder="Đơn vị: cm"
                      register={register}
                    />
                    <FormInput
                      label="Cân nặng(*)"
                      prop="weight"
                      type="number"
                      placeholder="Đơn vị: gram"
                      register={register}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button type="submit" className="btn btn-primary text-white">
                {isLoading ? 'Đang xử lý ...' : 'Cập nhật sản phẩm'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default UpdateProduct
