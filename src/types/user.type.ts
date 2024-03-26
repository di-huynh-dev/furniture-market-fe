export type UserType = {
  id: string
  fullName: string
  email: string
  phone: string
  avatar: string
  birthday: string
  status: boolean
  gender: string
  role: string
  emailConfirmed: boolean
}

export type LoginType = {
  accessToken: string
  user: UserType
}
