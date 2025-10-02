
import './App.css'
import { Outlet, ScrollRestoration } from 'react-router-dom'

function App() {

  return (
    <>
      <main>
        <Outlet/>
      </main>
      <ScrollRestoration></ScrollRestoration>
    </>
  )
}

export default App
