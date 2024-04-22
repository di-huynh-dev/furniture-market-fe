/* eslint-disable @typescript-eslint/no-explicit-any */
import { Buyer_QueryKeys } from '@/constants/query-keys'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { selectCart } from '@/redux/reducers/buyer/cartSlice'
import { CartItem } from '@/types/cart.type'
import { formatDate, formatPrice } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { CiLocationOn } from 'react-icons/ci'
import { MdOutlineEditLocationAlt } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { CiDiscount1 } from 'react-icons/ci'
import { VoucherRespType } from '@/types/voucher.type'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

type DeliveryAddress = {
  id: string
  deliveryAddress: string
  receiverPhone: string
  receiverName: string
}

const BuyerCheckout = () => {
  const axiosPrivate = useAxiosBuyerPrivate()
  const cartItems = useSelector(selectCart)

  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [shippingFees, setShippingFees] = useState<{ [key: string]: number }>({})
  const [voucherAppliedMessages, setVoucherAppliedMessages] = useState<{
    [key: string]: { discount: number; total: number }
  }>({})
  const [selectedVouchers, setSelectedVouchers] = useState<{ [key: string]: string[] }>({})
  const [selectedVoucher, setSelectedVoucher] = useState([])

  useEffect(() => {
    document.title = 'Fnest - Thanh toán'
  }, [])

  const handleToggleVoucherSelection = (productId: string, voucherId: string) => {
    setSelectedVouchers((prevSelectedVouchers) => {
      const currentSelectedVouchers = prevSelectedVouchers[productId] || []
      const updatedSelectedVouchers = [...currentSelectedVouchers]
      const index = updatedSelectedVouchers.indexOf(voucherId)

      if (index !== -1) {
        updatedSelectedVouchers.splice(index, 1)
      } else {
        updatedSelectedVouchers.push(voucherId)
      }

      return {
        ...prevSelectedVouchers,
        [productId]: updatedSelectedVouchers,
      }
    })
  }

  const { data: addresses, isLoading: isLoadingAddress } = useQuery({
    queryKey: [Buyer_QueryKeys.USER_ADDRESS],
    queryFn: async () => {
      const resp = await axiosPrivate.get('/buyer/delivery-address')
      setSelectedAddressId(resp.data.data.defaultAddressId)
      return resp.data.data
    },
  })

  const getVoucherListByProductId = async (id: string) => {
    try {
      const resp = await axiosPrivate.get(`/buyer/voucher/by-product/${id}`)
      setSelectedVoucher(resp.data.data)
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const applyVoucher = async (productId: string, total: number) => {
    try {
      if (selectedVouchers[productId] && selectedVouchers[productId].length > 0) {
        const voucherIds = selectedVouchers[productId]

        const resp = await axiosPrivate.post('/buyer/voucher/use', {
          productId: productId,
          total: total,
          voucherIds: voucherIds,
        })
        if (resp.status === 200) {
          toast.success(resp.data.messages[0])
          setVoucherAppliedMessages((prevState) => ({
            ...prevState,
            [productId]: resp.data.data,
          }))
        }
      }
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  const calculateShippingFeeForProduct = async (productId: string, quantity: number, deliveryAddressId: string) => {
    try {
      const resp = await axiosPrivate.post('/shipping-fee', {
        deliveryAddressId: deliveryAddressId,
        orderItemRequests: [{ productId, quantity }],
      })
      return resp.data.data.fee
    } catch (error: any) {
      toast.error(error.response.data.messages[0])
    }
  }

  useEffect(() => {
    if (!isLoadingAddress && addresses) {
      for (const item of cartItems.cartItemList) {
        calculateShippingFeeForProduct(item.id, item.cartQuantity, selectedAddressId)
          .then((fee) => {
            setShippingFees((prevState) => ({
              ...prevState,
              [item.id]: fee,
            }))
          })
          .catch((error) => {
            console.error('Error calculating shipping fee:', error)
          })
      }
    }
  }, [isLoadingAddress, addresses, selectedAddressId])

  const calculateTotalPrice = () => {
    let totalPrice = 0
    let totalShippingFee = 0
    let totalDiscount = 0

    // Tính tổng tiền hàng và tổng phí vận chuyển
    for (const item of cartItems.cartItemList) {
      const itemPrice = item.price * item.cartQuantity
      totalPrice += itemPrice
      totalShippingFee += shippingFees[item.id] || 0

      // Tính tổng voucher giảm giá (nếu có)
      if (voucherAppliedMessages[item.id]) {
        totalDiscount += voucherAppliedMessages[item.id].discount || 0
      }
    }

    // Tổng thanh toán = Tổng tiền hàng + Tổng phí vận chuyển - Tổng voucher giảm giá
    const totalPayment = totalPrice + totalShippingFee - totalDiscount

    return {
      totalPrice: totalPrice,
      totalShippingFee: totalShippingFee,
      totalDiscount: totalDiscount,
      totalPayment: totalPayment,
    }
  }

  const totalPriceInfo = calculateTotalPrice()

  if (isLoadingAddress) return <p>Loading...</p>

  return (
    <div className="">
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Chọn địa chỉ giao hàng</h3>
          {addresses &&
            addresses.deliveryAddresses.map((address: DeliveryAddress) => (
              <div key={address.id} className="grid grid-cols-4 gap-2 my-2">
                <input
                  type="checkbox"
                  checked={selectedAddressId === address.id}
                  className="checkbox"
                  onChange={() => setSelectedAddressId(address.id)}
                />
                <div className="col-span-3">
                  <p>
                    {address.receiverName} | {address.receiverPhone}
                  </p>
                  <p className="text-sm text-gray-500">{address.deliveryAddress}</p>
                </div>
              </div>
            ))}
          <div className="modal-action">
            <form method="dialog">
              <div className="flex gap-2">
                <button className="btn btn-primary text-white">Xác nhận</button>
                <button className="btn">Đóng</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      <div className="align-element bg-base-100 shadow-xl my-2 p-4">
        <div className="flex gap-2 items-center capitalize text-primary font-semibold">
          <CiLocationOn />
          <p>Địa chỉ nhận hàng</p>
        </div>
        <div className="">
          {addresses?.deliveryAddresses.map((address: DeliveryAddress) => {
            if (address.id === addresses.defaultAddressId) {
              return (
                <div className="grid grid-cols-6 gap-4 items-center">
                  <p className="font-bold">
                    {address.receiverName}, {address.receiverPhone}
                  </p>
                  <p className="col-span-4">{address.deliveryAddress}</p>

                  <button
                    className="flex gap-2 items-center cursor-pointer text-primary"
                    onClick={() => {
                      const dialog = document.getElementById('my_modal_2') as HTMLDialogElement
                      dialog.showModal()
                    }}
                  >
                    <MdOutlineEditLocationAlt />
                    <p>Thay đổi</p>
                  </button>
                </div>
              )
            } else {
              return null
            }
          })}
        </div>
      </div>

      <div className="align-element bg-base-100 shadow-xl my-2 p-4">
        <p className="text-lg">Thông tin sản phẩm</p>
        <div className="grid grid-cols-8 text-gray-500">
          <div className="col-span-3">Sản phẩm</div>
          <div className="col-span-2">Chất liệu</div>
          <div>Đơn giá</div>
          <div>Số lượng</div>
          <div>Thành tiền</div>
        </div>

        {cartItems.cartItemList.map((item: CartItem) => (
          <div>
            <div className="grid grid-cols-8 my-2 gap-3">
              <div className="col-span-3 flex gap-2">
                <img src={item.thumbnail} alt={item.name} className="w-24 h-24 object-cover" />
                <p>{item.name}</p>
              </div>
              <p className="col-span-2">{item.material}</p>
              <p>{formatPrice(item.price)}</p>
              <p>{item.cartQuantity}</p>
              <p>{formatPrice(item.price * item.cartQuantity)}</p>
            </div>

            <div className="flex justify-end gap-2">
              <div className="flex gap-2 items-center text-primary">
                <CiDiscount1 />
                <p>Voucher của shop</p>
              </div>
              <div className="flex gap-2 items-center p-4">
                <div
                  className="dropdown dropdown-hover dropdown-bottom dropdown-end"
                  onClick={() => getVoucherListByProductId(item.id)}
                >
                  <div tabIndex={0} role="button" className="text-blue-500">
                    Chọn voucher
                  </div>

                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-96">
                    {selectedVoucher.map((voucher: VoucherRespType) => (
                      <div
                        className={`border p-2 my-2 grid grid-cols-5 items-center gap-2 ${
                          !voucher.usable ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Link to={`/shop/${item.storeInfo.id}`}>
                          <img src={item.storeInfo.logo} alt="Logo shop" className="w-24 " />
                        </Link>
                        <div className="col-span-3">
                          <p>Mã: {voucher.code}</p>
                          <p>{voucher.name}</p>
                          <p>Giảm: {formatPrice(voucher.maxDiscount)}</p>
                          <p>Đơn tối thiểu: {formatPrice(voucher.minValue)}</p>
                          <p className="text-sm text-gray-500">
                            HSD: Từ {formatDate(voucher.startDate)} đến {formatDate(voucher.endDate)}
                          </p>
                        </div>

                        <input
                          type="checkbox"
                          disabled={!voucher.usable}
                          checked={selectedVouchers[item.id]?.includes(voucher.id)}
                          onChange={() => handleToggleVoucherSelection(item.id, voucher.id)}
                        />
                      </div>
                    ))}
                    <button
                      className="btn btn-primary text-white"
                      onClick={() => applyVoucher(item.id, item.price * item.cartQuantity)}
                    >
                      Áp dụng
                    </button>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-5 flex justify-end gap-2 border-dashed border-2 border-indigo-200">
              <div>
                {voucherAppliedMessages[item.id] && (
                  <p>Giảm giá: {formatPrice(voucherAppliedMessages[item.id].discount)}</p>
                )}
                <p>Phí vận chuyển: {formatPrice(shippingFees[item.id]) || 'Calculating...'}</p>
                <div className="flex gap-2 text-primary">
                  Tổng tiền ({item.cartQuantity} sản phẩm):
                  {voucherAppliedMessages[item.id] ? (
                    <p>
                      {formatPrice(
                        item.price * item.cartQuantity +
                          shippingFees[item.id] -
                          voucherAppliedMessages[item.id].discount,
                      )}
                    </p>
                  ) : (
                    <p>{formatPrice(item.price * item.cartQuantity + shippingFees[item.id])}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="align-element bg-base-100 shadow-xl my-2 p-4">
        <p className="text-lg">Phương thức thanh toán</p>
        <div className="flex justify-end">
          <div>
            <div className="flex gap-2 my-4">
              <p>Tổng tiền hàng:</p>
              <p>{formatPrice(totalPriceInfo.totalPrice)}</p>
            </div>
            <div className="flex gap-2 my-4">
              <p>Phí vận chuyển:</p>
              <p>{formatPrice(totalPriceInfo.totalShippingFee)}</p>
            </div>
            <div className="flex gap-2 my-4">
              <p>Tổng cộng Voucher giảm giá:</p>
              <p>- {formatPrice(totalPriceInfo.totalDiscount)}</p>
            </div>
            <div className="flex gap-2 my-4 items-center">
              <p>Tổng thanh toán</p>
              <p className="text-primary text-3xl font-semibold">{formatPrice(totalPriceInfo.totalPayment)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerCheckout
