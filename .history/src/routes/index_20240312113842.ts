import { RouterProvider, createBrowserRouter } from 'react-router-dom'

export const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Landing />,
    },
  ])
  ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />)
}
