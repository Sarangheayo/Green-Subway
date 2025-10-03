
import './App.css'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import Header from './components/Header.jsx'

function App() {

  return (
    <>
      <Header/>
      <main>
        <Outlet/>
      </main>
      <ScrollRestoration></ScrollRestoration>
    </>
  )
}

export default App
