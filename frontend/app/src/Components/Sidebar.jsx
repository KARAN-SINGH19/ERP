import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { getSidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import axios from 'axios';

const Nav = styled.div`
  background: #15171c;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
`;

const LogoutButton = styled.button`
  background: red;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background: #a358df;
  }
`;

const NavIcon = styled(Link)`
  margin-left: 1rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #15171c;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  const [role, setRole] = useState('');

  const showSidebar = () => setSidebar(!sidebar);

  const navigate = useNavigate();

  useEffect(() => {
    userRole();
  }, []);

  async function userRole() {
    try {
      const token = localStorage.getItem('token');
      const userRole = await axios.get('http://localhost:4000/api/v1/userRole', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (userRole) {
        setRole(userRole.data.role);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        console.error('Internal Server Error');
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const sidebarData = getSidebarData(role);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <Nav>
          <NavIcon to='#'>
            <FaIcons.FaBars onClick={showSidebar} />
          </NavIcon>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </Nav>
        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
            <NavIcon to='#'>
              <AiIcons.AiOutlineClose onClick={showSidebar} />
            </NavIcon>
            {sidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;
