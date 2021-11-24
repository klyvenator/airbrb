import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import ListingsPage from './pages/listings';
import RegisterPage from './pages/register';
import LogoutPage from './pages/logout';
import LoginPage from './pages/login';
import CreateEditListing from './pages/createeditlisting';
import YourListingsPage from './pages/yourlistings';
import PublishPage from './pages/publish';
import ListingView from './pages/listingview';
import TransitionPage from './pages/transition';
import ManageBookingsPage from './pages/managebooking';

function App () {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListingsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/newlisting" element={<CreateEditListing mode="new" />} />
        <Route path="/yourlistings" element={<YourListingsPage />} />
        <Route path="/listing/:id" element={<ListingView />} />
        <Route path="/listing/edit/:id" element={<CreateEditListing mode="edit" />} />
        <Route path="/listing/publish/:id" element={<PublishPage />} />
        <Route path="/listing/unpublish/:id" element={<TransitionPage />} />
        <Route path="/listing/bookings/:id" element={<ManageBookingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
