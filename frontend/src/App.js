import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import PageContainer from "./components/PageContainer";
import PrivateLayout from "./components/PrivateLayout";

import LoginPage from "./pages/LoginPage";
import StudentLogin from "./pages/StudentLogin";
import TeacherLogin from "./pages/TeacherLogin";
import AdminLogin from "./pages/AdminLogin";
import StudentsPage from "./pages/StudentsPage";


import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import AttendanceForm from "./pages/AttendanceForm";

// ✅ ADMIN CRUD (todos están en src/pages/)
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminStudentsPage from "./pages/AdminStudentsPage";
import AdminTeachersPage from "./pages/AdminTeachersPage";
import AdminAttendanceHistoryPage from "./pages/AdminAttendanceHistoryPage";

const RequireRole = ({ roles, children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" replace />;

  if (!roles.includes(user.role)) {
    if (user.role === "student") return <Navigate to="/student/dashboard" replace />;
    if (user.role === "teacher") return <Navigate to="/teacher/dashboard" replace />;
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ✅ Ocultar Header solo en /login (incluye /login/student, /login/teacher, /login/admin)
const LayoutWithConditionalHeader = ({ children }) => {
  const location = useLocation();
  const hideHeader = location.pathname.startsWith("/login");

  return (
    <>
      {!hideHeader && <Header />}
      {children}
    </>
  );
};

function Home() {
  return (
    <PageContainer>
      <h1 className="page-title">Sistema de Asistencia</h1>
      <p>Selecciona una opción del menú superior.</p>
    </PageContainer>
  );
}

function App() {
  return (
    <Router>
      <LayoutWithConditionalHeader>
        <Routes>
          {/* 🔓 LOGIN */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/student" element={<StudentLogin />} />
          <Route path="/login/teacher" element={<TeacherLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />

          {/* ✅ DASHBOARDS */}
          <Route
            path="/student/dashboard"
            element={
              <RequireRole roles={["student"]}>
                <PrivateLayout>
                  <StudentDashboard />
                </PrivateLayout>
              </RequireRole>
            }
          />

          <Route
            path="/teacher/dashboard"
            element={
              <RequireRole roles={["teacher"]}>
                <PrivateLayout>
                  <TeacherDashboard />
                </PrivateLayout>
              </RequireRole>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <RequireRole roles={["admin"]}>
                <PrivateLayout>
                  <AdminDashboard />
                </PrivateLayout>
              </RequireRole>
            }
          />

          {/* ✅ ADMIN CRUD */}
          <Route
            path="/admin/users"
            element={
              <RequireRole roles={["admin"]}>
                <PrivateLayout>
                  <AdminUsersPage />
                </PrivateLayout>
              </RequireRole>
            }
          />

          <Route
            path="/admin/students"
            element={
              <RequireRole roles={["admin"]}>
                <PrivateLayout>
                  <AdminStudentsPage />
                </PrivateLayout>
              </RequireRole>
            }
          />

          <Route
            path="/admin/teachers"
            element={
              <RequireRole roles={["admin"]}>
                <PrivateLayout>
                  <AdminTeachersPage />
                </PrivateLayout>
              </RequireRole>
            }
          />

          <Route
            path="/admin/attendance-history"
            element={
              <RequireRole roles={["admin"]}>
                <PrivateLayout>
                  <AdminAttendanceHistoryPage />
                </PrivateLayout>
              </RequireRole>
            }
          />

          {/* ✅ TEACHER */}
          <Route
            path="/attendance-form"
            element={
              <RequireRole roles={["teacher"]}>
                <PrivateLayout>
                  <AttendanceForm />
                </PrivateLayout>
              </RequireRole>
            }
          />
          <Route
            path="/students"
            element={
              <RequireRole roles={["teacher"]}>
                <PrivateLayout>
                  <StudentsPage />
                </PrivateLayout>
              </RequireRole>
            }
          />

          {/* HOME */}
          <Route
            path="/"
            element={
              localStorage.getItem("user") ? <Home /> : <Navigate to="/login" replace />
            }
          />

          {/* DEFAULT */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </LayoutWithConditionalHeader>
    </Router>
  );
}

export default App;
