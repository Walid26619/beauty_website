import React from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {MotionConfig} from 'motion/react'
import './index.css'
import App from './App'
import {DataProvider} from './data'
import {CartProvider} from './cart'
createRoot(document.getElementById('root')).render(<BrowserRouter><MotionConfig reducedMotion="user"><DataProvider><CartProvider><App/></CartProvider></DataProvider></MotionConfig></BrowserRouter>)
