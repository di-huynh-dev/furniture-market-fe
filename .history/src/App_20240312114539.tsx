import { Landing } from './pages'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Landing />,
    },
  ])
  return (
    <>
      <h2>hello</h2>
    </>
  )
}

export default App
