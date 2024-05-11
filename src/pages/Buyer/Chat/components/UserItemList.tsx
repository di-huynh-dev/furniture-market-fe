import { UserType } from '@/types/user.type'

const UserItemList = ({ item }: { item: UserType }) => {
  return (
    <div className="grid grid-cols-3 my-2 gap-2 items-center">
      <div className="col-span-1 avatar online">
        <img src={item.avatar} alt={item.fullName} className="w-6 h-6 rounded-full object-cover" />
      </div>
      <div className="col-span-2">
        <p className="font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap">{item.fullName}</p>
      </div>
    </div>
  )
}

export default UserItemList
