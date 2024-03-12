import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { FC } from 'react'
import Landing from '@/pages'

const AppRoutes: FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Landing />,
    },
  ])
  return <RouterProvider router={router} />
}
