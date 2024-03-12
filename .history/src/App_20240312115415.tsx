import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { BuyerLogin, Landing } from './pages'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Landing />,
    },
    {
      path: '/auth/login',
      element: <BuyerLogin />,
    },
  ])
  return <RouterProvider router={router} />
}

export default App
