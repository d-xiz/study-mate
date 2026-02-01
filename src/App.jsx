import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// pages
import HomePage from "./pages/HomePage";
import CreateGroupPage from "./pages/CreateGroupPage";
import SearchPage from "./pages/SearchPage";
import NotificationPage from "./pages/NotificationPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import BecomeTutorPage from "./pages/BecomeTutorPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";

// components
import Navbar from "./components/Navbar";

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
  !!localStorage.getItem("user")
);


  return (
    <div className="app">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <SearchPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-group"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <CreateGroupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/create"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <CreateGroupPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/groups/edit/:groupId"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <CreateGroupPage />
            </ProtectedRoute>
          }
        />


        <Route
          path="/become-tutor"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <BecomeTutorPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <NotificationPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
