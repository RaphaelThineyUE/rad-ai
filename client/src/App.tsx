import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/common/Layout";
import Home from "./pages/Home";
import PatientList from "./pages/PatientList";
import PatientDetail from "./pages/PatientDetail";
import PatientAnalytics from "./pages/PatientAnalytics";
import HowTo from "./pages/HowTo";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/patients/:id" element={<PatientDetail />} />
        <Route path="/analytics" element={<PatientAnalytics />} />
        <Route path="/how-to" element={<HowTo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
