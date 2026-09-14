import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { StudyKitViewer } from './components/StudyKitViewer';
import { AuthModal } from './components/AuthModal';
import { ImportModal } from './components/ImportModal';
import { Lecture, UserProfile } from './types';
import { SAMPLE_LECTURE } from './data/sampleLectures';
import { fetchLectures, createLecture, processLecture, deleteLecture, checkLectureStatus, fetchStudyMaterial } from './lib/api';
import { supabase } from './lib/supabase';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'viewer'>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([SAMPLE_LECTURE]);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Polling ref for active processing tasks
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Check Supabase Auth on load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || 'student@lectura.ai',
            full_name: data.session.user.user_metadata?.full_name || 'Enrolled Student',
          });
        }
      } catch (err) {
        console.warn('Supabase session load info:', err);
      }
    };
    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || 'student@lectura.ai',
          full_name: session.user.user_metadata?.full_name || 'Enrolled Student',
        });
      } else {
        // Keep demo user if set explicitly
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch lectures from API on startup
  useEffect(() => {
    loadLectures();
  }, [user]);

  const loadLectures = async () => {
    try {
      const serverLectures = await fetchLectures(user?.id);
      if (serverLectures && serverLectures.length > 0) {
        // Combine with sample lecture if not already present
        const hasSample = serverLectures.some((l) => l.id === SAMPLE_LECTURE.id);
        setLectures(hasSample ? serverLectures : [SAMPLE_LECTURE, ...serverLectures]);
      } else {
        setLectures([SAMPLE_LECTURE]);
      }
    } catch {
      // Offline or local fallback
      setLectures((prev) => (prev.length > 0 ? prev : [SAMPLE_LECTURE]));
    }
  };

  // Background status polling for any lecture in processing state
  useEffect(() => {
    const hasActiveJobs = lectures.some(
      (l) => l.status !== 'completed' && l.status !== 'failed'
    );

    if (hasActiveJobs) {
      if (!pollingRef.current) {
        pollingRef.current = setInterval(async () => {
          const updated = await Promise.all(
            lectures.map(async (lec) => {
              if (lec.status !== 'completed' && lec.status !== 'failed') {
                try {
                  const statusData = await checkLectureStatus(lec.id);
                  let kit = lec.study_kit;
                  if (statusData.has_material && !kit) {
                    try {
                      kit = await fetchStudyMaterial(lec.id);
                    } catch {
                      // kit still being written
                    }
                  }
                  return {
                    ...lec,
                    status: statusData.status,
                    progress_percent: statusData.progress_percent,
                    status_message: statusData.status_message,
                    study_kit: kit,
                  };
                } catch {
                  return lec;
                }
              }
              return lec;
            })
          );
          setLectures(updated);

          // Also update active lecture if currently open
          if (activeLecture) {
            const current = updated.find((l) => l.id === activeLecture.id);
            if (current) setActiveLecture(current);
          }
        }, 3000);
      }
    } else {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [lectures, activeLecture]);

  // Handle new lecture submission
  const handleCreateLecture = async (lectureData: any) => {
    const newLecture = await createLecture({
      ...lectureData,
      user_id: user?.id,
    });

    setLectures((prev) => [newLecture, ...prev]);

    // Kick off synthesis in backend
    processLecture(newLecture.id, {
      preferred_language: lectureData.preferred_language,
      difficulty: lectureData.difficulty,
      study_goal: lectureData.study_goal,
    }).catch((err) => console.error('Processing trigger error:', err));

    // Automatically navigate to dashboard to monitor progress
    setCurrentView('dashboard');
  };

  const handleDeleteLecture = async (id: string) => {
    try {
      await deleteLecture(id);
    } catch {
      // Local fallback
    }
    setLectures((prev) => prev.filter((l) => l.id !== id));
    if (activeLecture?.id === id) {
      setActiveLecture(null);
      setCurrentView('dashboard');
    }
  };

  const handleOpenLecture = (lecture: Lecture) => {
    setActiveLecture(lecture);
    setCurrentView('viewer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSample = () => {
    setActiveLecture(SAMPLE_LECTURE);
    setCurrentView('viewer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#12141D] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Global Navbar */}
      {currentView !== 'viewer' && (
        <Navbar
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenImport={() => setIsImportModalOpen(true)}
          onOpenSample={handleOpenSample}
          onOpenDashboard={() => setCurrentView('dashboard')}
          onSignOut={handleSignOut}
        />
      )}

      {/* Main Views */}
      <main className="flex-1 flex flex-col">
        {currentView === 'landing' && (
          <LandingPage
            onStartLearning={() => {
              if (user) {
                setCurrentView('dashboard');
              } else {
                setIsImportModalOpen(true);
              }
            }}
            onOpenSampleLecture={handleOpenSample}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            lectures={lectures}
            user={user}
            onOpenImport={() => setIsImportModalOpen(true)}
            onOpenLecture={handleOpenLecture}
            onDeleteLecture={handleDeleteLecture}
            onLoadSample={handleOpenSample}
          />
        )}

        {currentView === 'viewer' && activeLecture && (
          <StudyKitViewer
            lecture={activeLecture}
            onBack={() => {
              setCurrentView(user ? 'dashboard' : 'landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Global Footer (hidden in focused study kit mode to optimize screen real-estate) */}
      {currentView !== 'viewer' && <Footer />}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(authedUser) => {
          setUser(authedUser);
          setCurrentView('dashboard');
        }}
      />

      {/* 4-Step Lecture Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSubmitLecture={handleCreateLecture}
      />
    </div>
  );
}
