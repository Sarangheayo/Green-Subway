import './App.css'
import Header from './components/Header.jsx'
import { Outlet, ScrollRestoration } from 'react-router-dom';
 

function App() {

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  )
}

export default App;
