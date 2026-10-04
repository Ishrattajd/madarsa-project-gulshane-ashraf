import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LangProvider } from './i18n/index.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Programs from './pages/Programs.jsx';
import ProgramDetail from './pages/ProgramDetail.jsx';
import Gallery from './pages/Gallery.jsx';
import Events from './pages/Events.jsx';
import EventDetail from './pages/EventDetail.jsx';
import Donate from './pages/Donate.jsx';
import Contact from './pages/Contact.jsx';
import Volunteer from './pages/Volunteer.jsx';
import Admissions from './pages/Admissions.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import AdminLogin from './admin/AdminLogin.jsx';

import { PublicDataProvider } from './context/PublicDataContext.jsx';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function RequireAuth({ children }) {
  const token = localStorage.getItem('madarsa_access');
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <LangProvider>
      <PublicDataProvider>
        <BrowserRouter>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/programs" element={<PublicLayout><Programs /></PublicLayout>} />
          <Route path="/programs/:id" element={<PublicLayout><ProgramDetail /></PublicLayout>} />
          <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
          <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
          <Route path="/events/:id" element={<PublicLayout><EventDetail /></PublicLayout>} />
          <Route path="/donate" element={<PublicLayout><Donate /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/volunteer" element={<PublicLayout><Volunteer /></PublicLayout>} />
          <Route path="/admissions" element={<PublicLayout><Admissions /></PublicLayout>} />
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<RequireAuth><AdminLayout /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PublicDataProvider>
  </LangProvider>
  );
}
