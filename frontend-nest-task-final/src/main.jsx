import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Protected from './pages/Protected.jsx';
import Taskopration from './pages/Taskopration.jsx';

let router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },

  

  {
    Component : Protected,
    children : [
      {
        path : "/task",
        Component : Taskopration
      }
    ]
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <RouterProvider router={router} />
  </StrictMode>,
)
