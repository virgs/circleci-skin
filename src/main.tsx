import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'

import './scss/styles.scss'
// import 'bootswatch/dist/cosmo/bootstrap.min.css'
// import 'bootswatch/dist/minty/bootstrap.min.css'
// import 'bootswatch/dist/zephyr/bootstrap.min.css'
import 'bootswatch/dist/materia/bootstrap.min.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
