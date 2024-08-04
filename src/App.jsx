import { useState } from 'react'
import './App.css'
import Root from './Pages/Route/Route';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Pages/Home/Home';
import SignIn from './Pages/SignIn/SignIn';
import SignUp from './Pages/SignUp/SignUp';
import Profile from './Pages/Profile/Profile';
import About from './Pages/About/About';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bcrypt from 'bcryptjs'

function App() {
  const [count, setCount] = useState(0)

  const router = createBrowserRouter ([{
    path: '/',
    element: <Root />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/signin', element: <SignIn/> },
      { path: '/signup', element: <SignUp/>},
      { path: '/Profile', element: <Profile/>},
      { path: '/About', element: <About/>}
    ]
  }]);


  return (
    <>
      <div>
        <RouterProvider router={router} />
        <ToastContainer />
      </div>

    </>
  )
}

export default App
