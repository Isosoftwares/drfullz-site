import { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Routes, Route } from 'react-router-dom'
import 'animate.css'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import Register from './pages/Register'
import News from './pages/dashboard/News'
import AddFunds from './pages/dashboard/AddFunds'
import SSNDOB from './pages/dashboard/SSNDOB'
import MyOrders from './pages/dashboard/MyOrders'
import ChangePassword from './pages/dashboard/ChangePassword'
import FAQpage from './pages/dashboard/FAQpage'
import Cart from './pages/dashboard/Cart'
import Support from './pages/dashboard/Support'
import Unauthorized from './pages/Unauthorized'
import PersistLogin from './components/PersistLogin'
import Missing from './pages/Missing'
import RequireAuth from './components/RequireAuth'
import RegisterSeller from './pages/RegisterSeller'
import RefundRequestPage from './pages/dashboard/orderpages/RefundRequestPage'
import AddDeficitFunds from './pages/dashboard/AddDeficitFunds'


function App() {
  // Create a client
  const queryClient = new QueryClient()

  return (
    // routes
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerSeller" element={<RegisterSeller />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/*" element={<Missing />} />

          {/* persist login */}
          <Route element={<PersistLogin />}>
            {/* dashboard routes */}
            <Route path="/dash" element={<Dashboard />}>
              <Route
                element={
                  <RequireAuth allowedRoles={['client',]} />
                }
              >
                <Route index element={<News />} />
                <Route path="addfunds" element={<AddFunds />} />
                <Route path="add-deficit-funds" element={<AddDeficitFunds />} />
                <Route path="news" element={<News />} />
                <Route path="ssn" element={<SSNDOB />} />

                <Route path="change-password" element={<ChangePassword />} />

                <Route path="my-orders" element={<MyOrders />} />
                <Route path="faq" element={<FAQpage />} />
                <Route path="cart" element={<Cart />} />
                <Route path="support" element={<Support />} />
                <Route path="refund-request/:productType/:productId" element={<RefundRequestPage />} />
              </Route>

              {/* dash end.................... */}
            </Route>
           
          </Route>
          {/* end of persist */}
        </Routes>
      </QueryClientProvider>
    </div>
  )
}

export default App
