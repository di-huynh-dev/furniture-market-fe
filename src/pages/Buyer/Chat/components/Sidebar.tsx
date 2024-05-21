import { Buyer_QueryKeys } from '@/constants/query-keys'
import useAxiosBuyerPrivate from '@/hooks/useAxiosBuyerPrivate'
import { selectAuth } from '@/redux/reducers/authSlice'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useSelector } from 'react-redux'
import UserItemList from './UserItemList'
import { UserType } from '@/types/user.type'

interface SidebarProps {
  receiverId: string | null
  handleChooseReceiver: (user: UserType) => void
}

const Sidebar: React.FC<SidebarProps> = ({ receiverId, handleChooseReceiver }) => {
  const axiosPrivate = useAxiosBuyerPrivate()
  const user = useSelector(selectAuth)

  const { data: userSentMessages, isLoading: isLoadingUserSentMessages } = useQuery({
    queryKey: [Buyer_QueryKeys.LIST_USER_SENT_MESSAGE],
    queryFn: async () => {
      const resp = await axiosPrivate.get(`/common/message/${user.authData.user.id}/opponents`)
      return resp.data.data
    },
    enabled: !!user.authData.user.id,
  })
  console.log(userSentMessages)

  if (isLoadingUserSentMessages) return <div>Loading...</div>

  return (
    <div
      className="col-span-3 overflow-y-auto h-[450px] border-r"
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #E5E7EB' }}
    >
      <p>Đến từ:</p>
      <ul className="">
        {userSentMessages?.map((item: UserType) => (
          <li
            key={item.id}
            onClick={() => handleChooseReceiver(item)}
            className={`${receiverId === item.id ? 'bg-neutral-200' : ''} rounded-xl p-1 my-2 hover:bg-neutral-200`}
          >
            <UserItemList item={item} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
