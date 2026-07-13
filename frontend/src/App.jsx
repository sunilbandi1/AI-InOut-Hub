import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterVisitor from "./pages/RegisterVisitor";
import VisitorList from "./pages/VisitorList";
import UserManagement from "./pages/UserManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import OrganizationSignup from "./pages/OrganizationSignup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<OrganizationSignup />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/register-visitor" element={<ProtectedRoute><RegisterVisitor /></ProtectedRoute>} />
        <Route path="/visitors" element={<ProtectedRoute><VisitorList /></ProtectedRoute>} />
        <Route
          path="/user-management"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <UserManagement />
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;