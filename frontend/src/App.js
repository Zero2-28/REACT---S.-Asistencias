import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import PageContainer from "./components/PageContainer";

import UsersPage from "./pages/UsersPage";
import StudentsPage from "./pages/StudentsPage";
import TeachersPage from "./pages/TeachersPage";
import AttendancePage from "./pages/AttendancePage";
import AttendanceHistoryPage from "./pages/AttendanceHistoryPage";
import AttendanceForm from "./pages/AttendanceForm";

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
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/attendance-history" element={<AttendanceHistoryPage />} />
        <Route path="/attendance-form" element={<AttendanceForm />} />
      </Routes>
    </Router>
  );
}

export default App;
