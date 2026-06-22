import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import TicketDetailPage from './pages/TicketDetailPage';
import PostTicketPage from './pages/PostTicketPage';
import SubscribePage from './pages/SubscribePage';
import LoginPage from './pages/LoginPage';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/"            element={<HomePage />} />
                    <Route path="/tickets/:id" element={<TicketDetailPage />} />
                    <Route path="/post"        element={<PostTicketPage />} />
                    <Route path="/subscribe"   element={<SubscribePage />} />
                    <Route path="/login"       element={<LoginPage />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;