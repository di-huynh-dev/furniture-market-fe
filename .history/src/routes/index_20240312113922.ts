import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { FC } from 'react'
import Landing from './Landing'

const AppRoutes: FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Landing />,
    },
  ])
  return <RouterProvider router={router} />
}

export default AppRoutes
