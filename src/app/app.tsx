import './app.scss'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Price from 'pages/price/ui/price'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/price" element={<Price />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
