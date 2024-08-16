import './App.css';
import Login from './Screens/Login';
import Home from './Screens/Home';
import AddUser from './Screens/AddUser';
import ViewUsers from './Screens/ViewUsers';
import UpdateUser from './Screens/UpdateUser';
import AddCandidates from './Screens/AddCandidates';
import ViewCandidates from './Screens/ViewCandidates';
import UpdateCandidate from './Screens/UpdateCandidate';
import AddClients from './Screens/AddClients';
import ViewClients from './Screens/ViewClients';
import UpdateClient from './Screens/UpdateClient';
import AddPositions from './Screens/AddPositions';
import ViewPositions from './Screens/ViewPositions';
import UpdatePosition from './Screens/UpdatePosition';
import AddHiring from './Screens/AddHiring';
import ViewHiring from './Screens/ViewHiring';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/dashboard" element={<Home />} />
          <Route exact path="/addUser" element={<AddUser />} />
          <Route exact path="/viewUsers" element={<ViewUsers />} />
          <Route exact path="/updateUser/:id" element={<UpdateUser />} />
          <Route exact path="/addCandidates" element={<AddCandidates />} />
          <Route exact path="/viewCandidates" element={<ViewCandidates />} />
          <Route exact path="/updateCandidates/:id" element={<UpdateCandidate />} />
          <Route exact path="/addClient" element={<AddClients />} />
          <Route exact path="/viewClients" element={<ViewClients />} />
          <Route exact path="/updateClient/:id" element={<UpdateClient />} />
          <Route exact path="/addPosition" element={<AddPositions />} />
          <Route exact path="/viewPositions" element={<ViewPositions />} />
          <Route exact path="/updatePosition/:id" element={<UpdatePosition />} />
          <Route exact path="/addHiring" element={<AddHiring />} />
          <Route exact path="/viewHiring" element={<ViewHiring />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
