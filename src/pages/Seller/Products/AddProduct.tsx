/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormInput, LoadingComponent } from '@/components'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { AddProductApiType, ProductInfo } from '@/types/product.type'
import { useQuery } from '@tanstack/react-query'
import { Seller_QueryKeys } from '@/constants/query-keys'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useState } from 'react'
import useImagePreview from '@/hooks/useImagePreview'
import toast from 'react-hot-toast'

export type FormData = AddProductApiType

interface CategoryType {
  id: string
  name: string
}

const AddProduct = () => {
  const axiosPrivate = useAxiosPrivate()
  const { previewImages: thumbnail, handleFileChange: handleThumbnailChange } = useImagePreview()
  const { previewImages: images, handleFileChange: handleImagesChange } = useImagePreview()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedSystemCategory, setSelectedSystemCategory] = useState<string>('')

  const { data: shopCategories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['shopCategories'],
    queryFn: async () => {
      try {
        const resp = await axiosPrivate.get('/seller/category')
        if (resp.status === 200) {
          return resp.data.data
        }
      } catch (error: any) {
        toast.error(error.response.data.messages[0])
      }
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

  const handleAddProduct = async (data: FormData) => {
    setIsLoading(true)
    const formData = new FormData()

    const info: ProductInfo = {
      name: data.name,
      price: data.price,
      salePrice: data.salePrice,
      description: data.description,
      weight: data.weight,
      height: data.height,
      length: data.length,
      width: data.width,
      material: data.material,
      inStock: data.inStock,
      featured: data.featured,
      used: data.used,
    }
    if (selectedCategory !== '') {
      info['storeCategoryId'] = selectedCategory
    }
    if (selectedSystemCategory !== '') {
      info['systemCategoryId'] = selectedSystemCategory
    }
    const json = JSON.stringify(info)
    const blob = new Blob([json], {
      type: 'application/json',
    })
    formData.append('info', blob)
    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail[0])
    } else {
      toast.error('Vui lòng chọn một hình ảnh cho logo.')
      return
    }

    if (data.images instanceof FileList) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append('images', data.images[i])
      }
    } else {
      toast.error('Vui lòng chọn ít nhất một hình ảnh cho logo.')
      return
    }

    try {
      const resp = await axiosPrivate.post('/seller/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (resp.status === 200) {
        toast.success(resp.data.messages[0])
        setIsLoading(false)
        reset()
        setSelectedCategory('')
        setSelectedSystemCategory('')
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.messages[0])
      } else {
        toast.error('Đã xảy ra lỗi khi thêm sản phẩm.')
      }
    }
  }

  const validationSchema = yup.object({
    name: yup.string().required('Không được để trống!'),
    price: yup.number().required('Không được để trống!').moreThan(0, 'Giá phải lớn hơn 0'),
    salePrice: yup.number().moreThan(0, 'Giá phải lớn hơn 0').required('Không được để trống!'),
    description: yup.string().required('Không được để trống!'),
    weight: yup.number().required('Không được để trống!').moreThan(0, 'Giá trị phải lớn hơn 0'),
    height: yup.number().required('Không được để trống!').moreThan(0, 'Giá trị phải lớn hơn 0'),
    length: yup.number().required('Không được để trống!').moreThan(0, 'Giá trị phải lớn hơn 0'),
    width: yup.number().required('Không được để trống!').moreThan(0, 'Giá trị phải lớn hơn 0'),
    material: yup.string().required('Không được để trống!'),
    inStock: yup.number().required('Không được để trống!').moreThan(0, 'Giá phải lớn hơn 0'),
    featured: yup.boolean().required('Không được để trống!'),
    used: yup.boolean().required('Không được để trống!'),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  })

  if (isLoadingCategories || isLoadingSystemCategories) {
    return <LoadingComponent />
  }

  return (
    <section className="mx-4 my-2 text-sm">
      <div className="card shadow-lg bg-white">
        <div className="card-body">
          <form onSubmit={handleSubmit(handleAddProduct)} encType="multipart/form-data">
            <span className="font-bold text-xl">Thêm sản phẩm mới</span>
            <div className="">
              <div className=" ">1. Hình ảnh sản phẩm</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="label" htmlFor="logo">
                    <span className="label-text capitalize text-sm">Thumbnail(*)</span>
                  </label>
                  <input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    {...register('thumbnail')}
                    className="input input-bordered text-sm"
                    onChange={handleThumbnailChange}
                  />
                  {errors.thumbnail?.message && <p className="text-red-500 text-sm">{errors.thumbnail.message}</p>}
                  {thumbnail &&
                    thumbnail.map((image, index) => (
                      <div key={`back-${index}`} className="mt-2">
                        <img src={image} alt={`Back Preview ${index}`} className="w-80 h-60 object-contain" />
                      </div>
                    ))}
                </div>
                <div className="col-span-2">
                  <label className="label" htmlFor="logo">
                    <span className="label-text capitalize text-sm">Hình ảnh sản phẩm(*)</span>
                  </label>
                  <input
                    id="logo"
                    type="file"
                    accept="image/*"
                    className="input input-bordered text-sm"
                    {...register('images')}
                    onChange={handleImagesChange}
                    multiple
                  />
                  {errors.images?.message && <p className="text-red-500 text-sm">{errors.images.message}</p>}
                  <div className="grid grid-cols-4 gap-2">
                    {images &&
                      images.map((image, index) => (
                        <div key={`back-${index}`} className="mt-2 flex">
                          <img src={image} alt={`Back Preview ${index}`} className="w-80 h-60 object-contain" />
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
                    label="Tên sản phẩm(*)"
                    register={register}
                    placeholder="Bàn gỗ cao cấp Italia"
                    errorMessage={errors?.name?.message}
                  />

                  <FormInput
                    prop="material"
                    label="Chất liệu(*)"
                    register={register}
                    type="text"
                    errorMessage={errors.material?.message}
                    placeholder="Ví dụ: Gỗ Beech, MDF Veneer beech"
                  />
                  <FormInput
                    prop="description"
                    label="Mô tả chi tiết (*)"
                    register={register}
                    errorMessage={errors.description?.message}
                    type="text"
                    placeholder="Mô tả chi tiết sản phẩm"
                  />
                </div>
              </div>
              <div>
                <span>3. Thông tin bán hàng</span>
                <div className="px-10 grid grid-cols-3 gap-4">
                  <FormInput
                    label="Số lượng trong kho (*)"
                    prop="inStock"
                    type="number"
                    placeholder="Vd: 124"
                    register={register}
                    errorMessage={errors.inStock?.message}
                  />
                  <FormInput
                    label="Giá nhập (*)"
                    prop="price"
                    type="number"
                    placeholder="Vd: 124"
                    register={register}
                    errorMessage={errors.price?.message}
                  />
                  <FormInput
                    label="Giá bán (*)"
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
                  <select className="select select-bordered w-full max-w-xs" {...register('used')}>
                    <option disabled selected value="">
                      Tình trạng (*)
                    </option>
                    <option value="false">Mới</option>
                    <option value="true"> Đã qua sử dụng</option>
                  </select>
                  {errors.used?.message && <p className="text-red-500 text-sm">{errors.used.message}</p>}
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
                <div className="mx-10 grid grid-cols-4 gap-4">
                  <FormInput
                    label="Chiều dài(*)"
                    prop="length"
                    type="number"
                    placeholder="Đơn vị: cm"
                    register={register}
                    errorMessage={errors.length?.message}
                  />
                  <FormInput
                    label="Chiều rộng(*)"
                    prop="width"
                    type="number"
                    placeholder="Đơn vị: cm"
                    register={register}
                    errorMessage={errors.width?.message}
                  />
                  <FormInput
                    label="Chiều cao(*)"
                    prop="height"
                    type="number"
                    placeholder="Đơn vị: cm"
                    register={register}
                    errorMessage={errors.height?.message}
                  />
                  <FormInput
                    label="Cân nặng(*)"
                    prop="weight"
                    type="number"
                    placeholder="Đơn vị: gram"
                    register={register}
                    errorMessage={errors.weight?.message}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center my-2">
              <button type="submit" className="btn btn-primary text-white">
                {isLoading ? 'Đang xử lý ...' : 'Thêm sản phẩm'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default AddProduct
