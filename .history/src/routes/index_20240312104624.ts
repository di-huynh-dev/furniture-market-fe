import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Landing from '../pages'

export const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Landing />,
    },
  ])
  return <RouterProvider router={router} />
}
