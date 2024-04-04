import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const TabNavigation = () => {
  const [activeTab, setActiveTab] = useState('profile')

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName)
  }
  return (
    <div role="tablist" className="tabs tabs-lifted">
      <NavLink
        to={'profile'}
        role="tab"
        onClick={() => handleTabClick('profile')}
        className={`tab ${
          activeTab === 'profile' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
        }`}
      >
        Thông tin chủ sở hữu
      </NavLink>
      <NavLink
        to={'shop'}
        role="tab"
        onClick={() => handleTabClick('shop')}
        className={`tab ${
          activeTab === 'shop' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
        }`}
      >
        Thông tin shop
      </NavLink>
      <NavLink
        to={'vat'}
        role="tab"
        onClick={() => handleTabClick('vat')}
        className={`tab ${activeTab === 'vat' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''}`}
      >
        Thông tin thuế
      </NavLink>
      <NavLink
        to={'identify'}
        role="tab"
        onClick={() => handleTabClick('identify')}
        className={`tab ${
          activeTab === 'identify' ? 'tab-active font-bold [--tab-border-color:primary] text-primary' : ''
        }`}
      >
        Thông tin định danh
      </NavLink>
    </div>
  )
}

export default TabNavigation
