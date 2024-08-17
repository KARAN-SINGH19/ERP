import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Brush, LabelList
} from 'recharts';
import { FaUserTie, FaClipboardList, FaUsers } from 'react-icons/fa';

const DashboardCard = ({ title, count, icon, onClick }) => (
  <Card className="dashboard-card" onClick={onClick}>
    <Card.Body className="d-flex align-items-center">
      <div className="dashboard-card-icon">{icon}</div>
      <div className="dashboard-card-content">
        <Card.Title>{title}</Card.Title>
        <Card.Text>{count}</Card.Text>
      </div>
    </Card.Body>
  </Card>
);

const Home = () => {
  const [recruitersCount, setRecruitersCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [candidatesCount, setCandidatesCount] = useState(0);
  const [positionsData, setPositionsData] = useState([]);
  const [hiredCount, setHiredCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [activePositionCount, setActivePositionCount] = useState(0);
  const [activePositions, setActivePositions] = useState([]);
  const [closedPositions, setClosedPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        recruitersResponse,
        clientsResponse,
        candidatesResponse,
        positionsResponse,
        hiringStatusResponse,
        activePositionsResponse,
        closedPositionsResponse
      ] = await Promise.all([
        axios.get('http://82.112.236.55:5000/api/v1/countUsers'),
        axios.get('http://82.112.236.55:5000/api/v1/countClients'),
        axios.get('http://82.112.236.55:5000/api/v1/countCandidates'),
        axios.get('http://82.112.236.55:5000/api/v1/countPositionsByClient'),
        axios.get('http://82.112.236.55:5000/api/v1/countHiringStatus'),
        axios.get('http://82.112.236.55:5000/api/v1/displayActivePosition'),
        axios.get('http://82.112.236.55:5000/api/v1/displayClosePosition')
      ]);

      setRecruitersCount(recruitersResponse.data.count);
      setClientsCount(clientsResponse.data.count);
      setCandidatesCount(candidatesResponse.data.count);
      setPositionsData(positionsResponse.data.counts);
      setHiredCount(hiringStatusResponse.data.hiredCount);
      setRejectedCount(hiringStatusResponse.data.rejectedCount);
      setActivePositionCount(activePositionsResponse.data.positions.length);
      setActivePositions(activePositionsResponse.data.positions);
      setClosedPositions(closedPositionsResponse.data.positions);
    } catch (error) {
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  const positionsChartData = positionsData.map(item => ({
    name: item.clientName || item._id,
    count: item.count
  }));

  return (
    <div>
      <Sidebar />
      <div className="home-container">
        <Container className="dashboard-container">
          <h1 className="dashboard-title">Dashboard</h1>
          <Row className="justify-content-center">
            <Col sm={12} md={6} lg={3}>
              <DashboardCard
                title="Clients"
                count={clientsCount}
                icon={<FaUsers size={40} />}
                onClick={() => handleCardClick('/viewClients')}
              />
            </Col>
            <Col sm={12} md={6} lg={3}>
              <DashboardCard
                title="Positions"
                count={activePositionCount}
                icon={<FaClipboardList size={40} />}
                onClick={() => handleCardClick('/viewPositions')}
              />
            </Col>
            <Col sm={12} md={6} lg={3}>
              <DashboardCard
                title="Candidates"
                count={candidatesCount}
                icon={<FaUserTie size={40} />}
                onClick={() => handleCardClick('/viewCandidates')}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <h2 className="chart-title">Active Positions</h2>
              <ul className="active-positions-list">
                {activePositions.map((position, index) => (
                  <li key={index} className="active-position-item">
                    {position.position} -- {position.client.company}
                  </li>
                ))}
              </ul>
            </Col>
            <Col lg={6}>
              <h2 className="chart-title">Closed Positions</h2>
              <ul className="active-positions-list">
                {closedPositions.map((position, index) => (
                  <li key={index} className="active-position-item">
                    {position.position} -- {position.client.company}
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <h2 className="chart-title">Positions by Client</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={positionsChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="name" tick={{ fill: '#8884d8' }} />
                  <YAxis tick={{ fill: '#8884d8' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'lightgrey', borderColor: '#ccc', color: "black" }}
                    itemStyle={{ color: '#8884d8' }}
                    formatter={(value, name) => [`${value}`, name === 'count' ? 'Positions' : name]}
                  />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#8884d8"
                    barSize={30}
                    isAnimationActive={true}
                    animationDuration={500}
                  >
                    <LabelList dataKey="count" position="top" style={{ fill: '#8884d8' }} />
                  </Bar>
                  <Brush dataKey="name" height={30} stroke="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;
