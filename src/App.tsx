import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoBanner } from './components/DemoBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { QuickSearchModal } from './components/QuickSearchModal';
import { QRCodeModal } from './components/QRCodeModal';
import { IssueDetailModal } from './components/IssueDetailModal';
import { NewFacilityModal } from './components/NewFacilityModal';
import { NewScheduleModal } from './components/NewScheduleModal';
import { NewInspectionModal } from './components/NewInspectionModal';

// Pages
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { FacilityDetailPage } from './pages/FacilityDetailPage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { TrackIssuePage } from './pages/TrackIssuePage';
import { IssuesManagementPage } from './pages/IssuesManagementPage';
import { SchedulesPage } from './pages/SchedulesPage';
import { InspectionsPage } from './pages/InspectionsPage';
import { GreenAreasPage } from './pages/GreenAreasPage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AboutPage } from './pages/AboutPage';
import { Facility, IssueReport, FacilityCategoryKey } from './types';

const MainApp: React.FC = () => {
  const { facilities, issues } = useApp();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<FacilityCategoryKey | undefined>(undefined);
  const [trackingReference, setTrackingReference] = useState<string | undefined>(undefined);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewFacilityOpen, setIsNewFacilityOpen] = useState(false);
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);
  const [isNewInspectionOpen, setIsNewInspectionOpen] = useState(false);
  const [qrFacility, setQrFacility] = useState<Facility | null>(null);
  const [detailIssue, setDetailIssue] = useState<IssueReport | null>(null);

  // Handle URL hash or params (e.g. #report?facilityId=... or #facilities)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;

      const [route, queryString] = hash.split('?');
      if (queryString) {
        const params = new URLSearchParams(queryString);
        const facId = params.get('facilityId');
        const refId = params.get('ref');

        if (facId) setSelectedFacilityId(facId);
        if (refId) setTrackingReference(refId);
      }

      if (route) {
        setCurrentTab(route);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper navigation methods
  const navigateTo = (tab: string, category?: FacilityCategoryKey) => {
    setCurrentTab(tab);
    if (category) setCategoryFilter(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenFacilityDetail = (id: string) => {
    setSelectedFacilityId(id);
    setCurrentTab('facility-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReportForFacility = (facId: string) => {
    setSelectedFacilityId(facId);
    setCurrentTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInspectFacility = (facId: string) => {
    setSelectedFacilityId(facId);
    setIsNewInspectionOpen(true);
  };

  const handleScheduleFacility = (facId: string) => {
    setSelectedFacilityId(facId);
    setIsNewScheduleOpen(true);
  };

  const handleOpenIssueDetail = (issueId: string) => {
    const found = issues.find(i => i.id === issueId);
    if (found) setDetailIssue(found);
  };

  const handleNavigateToTrack = (refNumber: string) => {
    setTrackingReference(refNumber);
    setCurrentTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf9] text-slate-800 antialiased selection:bg-emerald-200 selection:text-emerald-950">
      {/* Pilot Disclaimer Banner */}
      <DemoBanner />

      {/* Main Responsive Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={tab => navigateTo(tab)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Dynamic View Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            onSelectTab={(tab, cat) => navigateTo(tab, cat)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            onSelectFacility={handleOpenFacilityDetail}
            onSelectIssue={handleOpenIssueDetail}
            onNavigateToReport={() => navigateTo('report')}
          />
        )}

        {currentTab === 'facilities' && (
          <FacilitiesPage
            onSelectFacility={handleOpenFacilityDetail}
            onOpenQR={fac => setQrFacility(fac)}
            onOpenNewFacility={() => setIsNewFacilityOpen(true)}
            onReportForFacility={handleReportForFacility}
            onInspectFacility={handleInspectFacility}
            initialCategory={categoryFilter}
          />
        )}

        {currentTab === 'facility-detail' && selectedFacilityId && (
          <FacilityDetailPage
            facilityId={selectedFacilityId}
            onBack={() => navigateTo('facilities')}
            onSelectIssue={handleOpenIssueDetail}
            onReportForFacility={handleReportForFacility}
            onInspectFacility={handleInspectFacility}
            onOpenScheduleModal={handleScheduleFacility}
            onOpenQR={fac => setQrFacility(fac)}
          />
        )}

        {currentTab === 'report' && (
          <ReportIssuePage
            preselectedFacilityId={selectedFacilityId || undefined}
            onNavigateToTrack={handleNavigateToTrack}
            onNavigateToDashboard={() => navigateTo('dashboard')}
          />
        )}

        {currentTab === 'track' && (
          <TrackIssuePage
            initialReference={trackingReference}
            onNavigateToReport={() => navigateTo('report')}
          />
        )}

        {currentTab === 'issues' && (
          <IssuesManagementPage
            onSelectIssue={handleOpenIssueDetail}
            onNavigateToReport={() => navigateTo('report')}
          />
        )}

        {currentTab === 'schedules' && (
          <SchedulesPage
            onOpenNewScheduleModal={() => setIsNewScheduleOpen(true)}
            onSelectFacility={handleOpenFacilityDetail}
          />
        )}

        {currentTab === 'inspections' && (
          <InspectionsPage
            onOpenNewInspectionModal={() => setIsNewInspectionOpen(true)}
            onSelectFacility={handleOpenFacilityDetail}
          />
        )}

        {currentTab === 'green-areas' && (
          <GreenAreasPage
            onSelectFacility={handleOpenFacilityDetail}
            onReportForFacility={handleReportForFacility}
            onInspectFacility={handleInspectFacility}
          />
        )}

        {currentTab === 'sustainability' && (
          <SustainabilityPage
            onNavigateToReport={() => navigateTo('report')}
            onNavigateToDashboard={() => navigateTo('dashboard')}
          />
        )}

        {currentTab === 'analytics' && <AnalyticsPage />}

        {currentTab === 'about' && (
          <AboutPage
            onNavigateToReport={() => navigateTo('report')}
            onNavigateToDashboard={() => navigateTo('dashboard')}
          />
        )}
      </main>

      {/* Global Interactive Modals */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectFacility={handleOpenFacilityDetail}
        onSelectIssue={handleOpenIssueDetail}
      />

      <QRCodeModal
        facility={qrFacility}
        onClose={() => setQrFacility(null)}
        onNavigateToReport={handleReportForFacility}
      />

      <IssueDetailModal
        issue={detailIssue}
        onClose={() => setDetailIssue(null)}
      />

      <NewFacilityModal
        isOpen={isNewFacilityOpen}
        onClose={() => setIsNewFacilityOpen(false)}
        onCreated={facId => handleOpenFacilityDetail(facId)}
      />

      <NewScheduleModal
        isOpen={isNewScheduleOpen}
        onClose={() => setIsNewScheduleOpen(false)}
        preselectedFacilityId={selectedFacilityId || undefined}
      />

      <NewInspectionModal
        isOpen={isNewInspectionOpen}
        onClose={() => setIsNewInspectionOpen(false)}
        preselectedFacilityId={selectedFacilityId || undefined}
      />

      {/* Footer */}
      <Footer onSelectTab={tab => navigateTo(tab)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
