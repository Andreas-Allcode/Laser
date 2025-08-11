import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import CommandCenter from "./CommandCenter";

import PortfolioManagement from "./PortfolioManagement";

import AccountManagement from "./AccountManagement";

import AdminCenter from "./AdminCenter";

import AccountCenter from "./AccountCenter";

import MediaRequests from "./MediaRequests";

import ScrubManagement from "./ScrubManagement";

import BuyBackCenter from "./BuyBackCenter";

import RemitCenter from "./RemitCenter";

import ChangeLog from "./ChangeLog";

import NotificationCenter from "./NotificationCenter";

import LetterManagement from "./LetterManagement";

import DataIntegrity from "./DataIntegrity";

import StyleGuide from "./StyleGuide";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    CommandCenter: CommandCenter,
    
    PortfolioManagement: PortfolioManagement,
    
    AccountManagement: AccountManagement,
    
    AdminCenter: AdminCenter,
    
    AccountCenter: AccountCenter,
    
    MediaRequests: MediaRequests,
    
    ScrubManagement: ScrubManagement,
    
    BuyBackCenter: BuyBackCenter,
    
    RemitCenter: RemitCenter,
    
    ChangeLog: ChangeLog,
    
    NotificationCenter: NotificationCenter,
    
    LetterManagement: LetterManagement,
    
    DataIntegrity: DataIntegrity,
    
    StyleGuide: StyleGuide,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/CommandCenter" element={<CommandCenter />} />
                
                <Route path="/PortfolioManagement" element={<PortfolioManagement />} />
                
                <Route path="/AccountManagement" element={<AccountManagement />} />
                
                <Route path="/AdminCenter" element={<AdminCenter />} />
                
                <Route path="/AccountCenter" element={<AccountCenter />} />
                
                <Route path="/MediaRequests" element={<MediaRequests />} />
                
                <Route path="/ScrubManagement" element={<ScrubManagement />} />
                
                <Route path="/BuyBackCenter" element={<BuyBackCenter />} />
                
                <Route path="/RemitCenter" element={<RemitCenter />} />
                
                <Route path="/ChangeLog" element={<ChangeLog />} />
                
                <Route path="/NotificationCenter" element={<NotificationCenter />} />
                
                <Route path="/LetterManagement" element={<LetterManagement />} />
                
                <Route path="/DataIntegrity" element={<DataIntegrity />} />
                
                <Route path="/StyleGuide" element={<StyleGuide />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}