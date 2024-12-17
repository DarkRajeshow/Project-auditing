import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import { Toaster } from 'sonner';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import BasicInfoForm from './components/pages/project/new/BasicInfo';
import EstimationInfo from './components/pages/project/new/EstimationInfo';
import Protected from './components/special/Protected';
import Project from './components/pages/project/Project';
import SiteProgress from './components/pages/project/new/SiteProgress';
import UnitTable from './components/pages/project/new/UnitTable';

function App() {

  return (
    <main className='bg-zinc-200 h-screen text-zinc-200'>
      <Router>
        <Toaster richColors position="top-center" theme='dark' />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:id" element={<Protected Component={Project} />} />
          <Route path="/projects/:id/basic-info" element={<Protected Component={BasicInfoForm} />} />
          <Route path="/projects/:id/estimation-info" element={<Protected Component={EstimationInfo} />} />
          <Route path="/projects/:id/site-progress" element={<Protected Component={SiteProgress} />} />
          <Route path="/projects/:id/units" element={<Protected Component={UnitTable} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;