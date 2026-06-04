
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import { AdminLayout } from './layout/Layout'
import AddUser from './pages/Admin/AddUser'
import { ProtectedRoute } from './components/ProtectedRoute'
import AddRoom from './pages/Admin/AddRoom'
import Availability from './pages/Employee/Availability'
import BookRoom from './pages/Employee/BookRoom'
import BookingHistory from './pages/Employee/BookingHistory'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route element={<ProtectedRoute><AdminLayout/></ProtectedRoute>}>
          <Route path='/create-room' element={<AddRoom/>}/>
          <Route path='/create-user' element={<AddUser/>}/>
          <Route path='/check-availability' element={<Availability/>}/>
          <Route path='/book-room' element={<BookRoom/>}/>
          <Route path='/booking-history' element={<BookingHistory/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
