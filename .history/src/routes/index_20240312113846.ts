import { RouterProvider, createBrowserRouter } from 'react-router-dom'

export const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Landing />,
    },
  ])
  return <RouterProvider router={router} />
}
