import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/public/HeroSection';
import FeaturedGameSection from './components/public/FeaturedGameSection';
import ServicesSection from './components/public/ServicesSection';
import PortfolioSection from './components/public/PortfolioSection';
import AboutSection from './components/public/AboutSection';
import TeamCaptainSection from './components/public/TeamCaptainSection';
import ClientEstimator from './components/public/ClientEstimator';
import Footer from './components/public/Footer';
import WhatsAppWidget from './components/public/WhatsAppWidget';

import TicTacToeGamePage from './components/public/TicTacToeGamePage';
import PrivacyPolicyPage from './components/public/PrivacyPolicyPage';
import EmployeeLoginModal from './components/auth/EmployeeLoginModal';
import AdminDashboard from './components/admin/AdminDashboard';
import { PORTFOLIO_PROJECTS } from './data/creativeData';

const checkPathIsAdmin = (pathStr, hashStr) => {
  const p = (pathStr || '').toLowerCase();
  const h = (hashStr || '').toLowerCase();
  return p.includes('/admin') || h.includes('admin');
};

const checkPathIsFeat = (pathStr, hashStr) => {
  const p = (pathStr || '').toLowerCase();
  const h = (hashStr || '').toLowerCase();
  return p.includes('/feat') || p.includes('/tictactoe') || p.includes('/tic-tac-toe') || p.includes('/apps') || p.includes('/developer') || h.includes('feat') || h.includes('tictactoe');
};

const checkPathIsPrivacy = (pathStr, hashStr) => {
  const p = (pathStr || '').toLowerCase();
  const h = (hashStr || '').toLowerCase();
  return p.includes('privacy');
};

const getInitialViewMode = () => {
  if (typeof window === 'undefined') return 'public';
  const path = window.location.pathname;
  const hash = window.location.hash;
  if (checkPathIsAdmin(path, hash)) return 'admin';
  if (checkPathIsFeat(path, hash)) return 'tictactoe';
  if (checkPathIsPrivacy(path, hash)) return 'privacy-policy';
  return 'public';
};

export default function App() {
  const [viewMode, setViewMode] = useState(getInitialViewMode); // 'public' | 'admin' | 'tictactoe' | 'privacy-policy'
  const [userRole, setUserRole] = useState('Admin / Executive');
  const [estimatorOpen, setEstimatorOpen] = useState(false);
  const [estimatorService, setEstimatorService] = useState('graphic-design');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Dynamic Portfolio Projects State (Supports YouTube, Vimeo, Behance embeds added via Admin Panel)
  const [projectsList, setProjectsList] = useState(PORTFOLIO_PROJECTS);

  // URL Path & Hash Listener for /admin, /feat, /tictactoe and /privacy-policy routes
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      
      if (checkPathIsAdmin(path, hash)) {
        setViewMode('admin');
        setLoginModalOpen(true);
      } else if (checkPathIsFeat(path, hash)) {
        setViewMode('tictactoe');
        // Force URL bar rewrite from /tictactoe to /feat
        if (window.location.pathname !== '/feat') {
          window.history.replaceState(null, '', '/feat');
        }
      } else if (checkPathIsPrivacy(path, hash)) {
        setViewMode('privacy-policy');
      } else {
        setViewMode('public');
      }
    };

    checkRoute();

    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  // Update URL Bar when switching viewMode
  useEffect(() => {
    if (viewMode === 'admin') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState(null, '', '/admin');
      }
    } else if (viewMode === 'tictactoe') {
      if (window.location.pathname !== '/feat') {
        window.history.pushState(null, '', '/feat');
      }
    } else if (viewMode === 'privacy-policy') {
      if (window.location.pathname !== '/privacy-policy') {
        window.history.pushState(null, '', '/privacy-policy');
      }
    } else {
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
    }
  }, [viewMode]);

  const handleOpenEstimatorWithService = (serviceId) => {
    setEstimatorService(serviceId);
    setEstimatorOpen(true);
  };

  const handleAddProject = (newProject) => {
    setProjectsList((prev) => [newProject, ...prev]);
  };

  const handleDeleteProject = (id) => {
    setProjectsList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSignOutAdmin = () => {
    setViewMode('public');
    window.history.pushState(null, '', '/');
  };

  const handleOpenPrivacyPolicy = () => {
    setViewMode('privacy-policy');
    window.history.pushState(null, '', '/privacy-policy');
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black relative">
      
      {/* Sticky Glassmorphism Header Navbar (Hidden on dedicated /feat & /privacy-policy pages) */}
      {viewMode !== 'tictactoe' && viewMode !== 'privacy-policy' && (
        <Navbar 
          viewMode={viewMode}
          onToggleViewMode={() => {
            if (viewMode === 'public') {
              setViewMode('admin');
              setLoginModalOpen(true);
            } else {
              setViewMode('public');
              window.history.pushState(null, '', '/');
            }
          }}
          userRole={userRole}
          setUserRole={setUserRole}
          onOpenEstimator={() => setEstimatorOpen(true)}
          onOpenGamePage={() => {
            setViewMode('tictactoe');
            window.history.pushState(null, '', '/feat');
          }}
          onSignOut={handleSignOutAdmin}
        />
      )}

      {/* Main Views Router */}
      {viewMode === 'public' ? (
        <main className="space-y-0">
          <HeroSection 
            onExplorePortfolio={() => {
              const el = document.getElementById('portfolio');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenEstimator={() => setEstimatorOpen(true)}
          />

          <FeaturedGameSection 
            onOpenGameDetails={() => {
              setViewMode('tictactoe');
              window.history.pushState(null, '', '/feat');
            }}
          />

          <ServicesSection 
            onSelectService={handleOpenEstimatorWithService}
            onOpenEstimator={() => setEstimatorOpen(true)}
          />

          <PortfolioSection projects={projectsList} />

          <AboutSection onOpenEstimator={() => setEstimatorOpen(true)} />

          <TeamCaptainSection />

          <Footer 
            onOpenEstimator={() => setEstimatorOpen(true)} 
            onOpenPrivacyPolicy={handleOpenPrivacyPolicy}
          />
        </main>
      ) : viewMode === 'tictactoe' ? (
        <TicTacToeGamePage 
          onBackToHome={() => {
            setViewMode('public');
            window.history.pushState(null, '', '/');
          }}
          onOpenEstimator={() => setEstimatorOpen(true)}
        />
      ) : viewMode === 'privacy-policy' ? (
        <PrivacyPolicyPage 
          onBackToHome={() => {
            setViewMode('public');
            window.history.pushState(null, '', '/');
          }}
          onOpenEstimator={() => setEstimatorOpen(true)}
          onOpenPrivacyPolicy={handleOpenPrivacyPolicy}
        />
      ) : (
        <AdminDashboard 
          userRole={userRole}
          projects={projectsList}
          onAddProject={handleAddProject}
          onDeleteProject={handleDeleteProject}
          onSwitchToPublic={() => {
            setViewMode('public');
            window.history.pushState(null, '', '/');
          }}
        />
      )}

      {/* Interactive Project Cost Estimator Modal */}
      <ClientEstimator 
        isOpen={estimatorOpen}
        onClose={() => setEstimatorOpen(false)}
        initialServiceId={estimatorService}
      />

      {/* Employee & Admin Login Modal */}
      <EmployeeLoginModal 
        isOpen={loginModalOpen}
        onClose={() => {
          setLoginModalOpen(false);
          if (viewMode === 'admin') {
            setViewMode('public');
            window.history.pushState(null, '', '/');
          }
        }}
        onSuccess={(role) => {
          setUserRole(role);
          setViewMode('admin');
          setLoginModalOpen(false);
        }}
      />

      {/* Always-On-Display WhatsApp Live Chat Widget */}
      <WhatsAppWidget />

    </div>
  );
}
