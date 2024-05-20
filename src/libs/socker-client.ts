const SOCKET_REGISTER_URL = `${import.meta.env.VITE_REACT_APP_URL}/ws/secured`
const SOCKET_USER_TOPIC_PREFIX_URL = `/ws/secured/messenger/user`
const SOCKET_NOTIFY_TOPIC_PREFIX_URL = `/ws/secured/announce/user`

export { SOCKET_REGISTER_URL, SOCKET_USER_TOPIC_PREFIX_URL, SOCKET_NOTIFY_TOPIC_PREFIX_URL }
