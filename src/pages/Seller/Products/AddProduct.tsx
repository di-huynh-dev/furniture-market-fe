import { FileInput, FormInput } from '@/components'

const AddProduct = () => {
  return (
    <div className="shadow-lg bg-white m-2">
      <div className="px-10">
        <span className="font-bold">Thêm sản phẩm mới</span>
        <div className="">
          <div className=" ">1. Hình ảnh sản phẩm</div>
          <div className="grid grid-cols-2 gap-2">
            <FileInput
              title="Tải lên thumbnail"
              subLabel="Tải lên hình ảnh 1:1"
              note="Lưu ý: Ảnh bìa sẽ được hiện thị tại các trang Kết quả tìm kiếm, Gắp ý hình ảnh bìa đẹp sẽ thu hút thểm lỗit truy cập vào bạn"
            />
            <FileInput title="Tải hình ảnh sản phẩm" subLabel="Tải lên hình ảnh 1:1" />
          </div>
          <div>
            <span>2. Thông tin chi tiết sản phẩm</span>
            <div className="px-10">
              <FormInput label="Tên sản phẩm" name="name" type="text" placeholder="Ví dụ: Tủ Tivi Hung King" />
              <FormInput
                label="Chất liệu"
                name="material"
                type="text"
                placeholder="Ví dụ: Gỗ Beech, MDF Veneer beech"
              />
              <FormInput label="Kích thước" name="size" type="text" placeholder="Ví dụ: D2000 - R550 - C562 mm" />
              <FormInput label="Mô tả" large name="description" type="text" placeholder="Mô tả chi tiết sản phẩm" />
            </div>
          </div>
          <div>
            <span>3. Thông tin bán hàng</span>
            <div className="px-10">
              <FormInput label="Giá bán" name="sale_price" type="text" placeholder="Đơn vị: VNĐ" />
              <FormInput label="Kho hàng" name="inStock" type="text" placeholder="Vd: 124" />
            </div>
          </div>
          <div>
            <span>3. Thông tin vận chuyển</span>
            <div className="px-10">
              <FormInput label="Trọng lượng" name="weight" type="text" placeholder="Đơn vị: kg" />
              <span>Kích thước đóng gói</span>
              <div className="grid grid-cols-3 gap-2">
                <FormInput label="Dài" name="boxSize" type="text" placeholder="cm" />
                <FormInput label="Rộng" name="boxSize" type="text" placeholder="cm" />
                <FormInput label="Cao" name="boxSize" type="text" placeholder="cm" />
              </div>
            </div>
          </div>

          <div>
            <span>3. Khác</span>
            <div className="px-10">
              <select className="select select-bordered w-full max-w-xs">
                <option disabled selected>
                  Tình trạng
                </option>
                <option>Mới</option>
                <option>Đã qua sử dụng</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProduct
