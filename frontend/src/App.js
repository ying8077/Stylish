import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/home';
import ProductDetail from './pages/product-detail';
import ErrorPage from './pages/errorPage';
import Cart from './pages/cart';
import ThankyouPage from './pages/thankyouPage';
import SignUpPage from './pages/signUp';
import SignInPage from './pages/signIn';
import ProfilePage from './pages/profile';
import DashboardPage from './pages/dashboard';

const App = () => {
    return (
        <BrowserRouter>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products/detail" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/thanks" element={<ThankyouPage />} />
                <Route path="/signUp" element={<SignUpPage />} />
                <Route path="/signIn" element={<SignInPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin/dashboard" element={<DashboardPage />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App