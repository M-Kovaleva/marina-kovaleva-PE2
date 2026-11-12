import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import VenuePage from './pages/VenuePage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import styles from './App.module.css'
import AuthModal from './components/AuthModal'
import RequireLogin from './components/RequireLogin'

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/venues/:id" element={<VenuePage />} />
          <Route path="/profile"
            element={
              <RequireLogin>
                <ProfilePage />
              </RequireLogin>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <AuthModal />
    </div>
  )
}

export default App
