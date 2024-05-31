/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import SockJS from 'sockjs-client'
import Stomp, { Client } from 'stompjs'
import { SOCKET_REGISTER_URL } from '@/libs/socker-client'

const useWebSocket = (): Client | null => {
  const [client, setClient] = useState<Client | null>(null)

  useEffect(() => {
    const socket = new SockJS(SOCKET_REGISTER_URL)
    const stompClient = Stomp.over(socket)

    stompClient.connect({}, () => {
      setClient(stompClient)
    })

    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {})
      }
    }
  }, [])

  return client
}

export default useWebSocket
