
import './App.css'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import Header from './components/Header.jsx'
import InstallPrompt from './components/InstallPrompt.jsx'

function App() {

  return (
    <>
      <InstallPrompt />
      <Header/>
      <main>
        <Outlet/>
      </main>
      <ScrollRestoration></ScrollRestoration>
    </>
  )
}

export default App;
