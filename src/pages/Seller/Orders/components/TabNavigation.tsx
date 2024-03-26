import { useState } from 'react'
import { NavLink } from 'react-router-dom'
const TabNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('')

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName)
  }
  return (
    <>
      <div role="tablist" className="tabs tabs-lifted">
        <NavLink
          to=""
          role="tab"
          onClick={() => handleTabClick('')}
          className={`tab ${activeTab === '' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''}`}
        >
          Tất cả
        </NavLink>
        <NavLink
          to="unpaid"
          role="tab"
          className={`tab ${
            activeTab === 'unpaid' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
          }`}
          onClick={() => handleTabClick('unpaid')}
        >
          Chờ xác nhận
        </NavLink>
        <NavLink
          to="toship"
          role="tab"
          className={`tab ${
            activeTab === 'toship' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
          }`}
          onClick={() => handleTabClick('toship')}
        >
          Chờ lấy hàng
        </NavLink>
        <NavLink
          to="shipping"
          role="tab"
          className={`tab ${
            activeTab === 'shipping' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
          }`}
          onClick={() => handleTabClick('shipping')}
        >
          Đang giao
        </NavLink>
        <NavLink
          to="completed"
          role="tab"
          onClick={() => handleTabClick('completed')}
          className={`tab ${
            activeTab === 'completed' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
          }`}
        >
          Đã giao
        </NavLink>
        <NavLink
          to="cancelled"
          role="tab"
          onClick={() => handleTabClick('cancelled')}
          className={`tab ${
            activeTab === 'cancelled' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
          }`}
        >
          Đã hủy
        </NavLink>
        <NavLink
          to="return"
          role="tab"
          onClick={() => handleTabClick('return')}
          className={`tab ${
            activeTab === 'return' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
          }`}
        >
          Trả hàng/Hoàn tiền
        </NavLink>
        <NavLink
          to="failed_delivery"
          role="tab"
          onClick={() => handleTabClick('failed_delivery')}
          className={`tab ${
            activeTab === 'failed_delivery' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
          }`}
        >
          Giao thất bại
        </NavLink>
      </div>
    </>
  )
}

export default TabNavigation
