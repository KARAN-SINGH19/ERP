import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as MdIcons from 'react-icons/md';

export const getSidebarData = (role) => {
  const sidebarData = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <AiIcons.AiFillHome />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
    },
    {
      title: 'Recruiters',
      icon: <IoIcons.IoMdPeople />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: 'Add Recruiter',
          path: '/addUser',
          icon: <IoIcons.IoIosPersonAdd />,
          cName: 'sub-nav'
        },
        {
          title: 'View Recruiters',
          path: '/viewUsers',
          icon: <IoIcons.IoIosPeople />
        }
      ]
    },
    {
      title: 'Clients',
      icon: <IoIcons.IoMdPeople />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: 'Add Clients',
          path: '/addClient',
          icon: <IoIcons.IoIosPersonAdd />
        },
        {
          title: 'View Clients',
          path: '/viewClients',
          icon: <IoIcons.IoIosPeople />
        }
      ]
    },
    {
      title: 'Positions',
      icon: <IoIcons.IoMdBriefcase />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: 'Add Positions',
          path: '/addPosition',
          icon: <IoIcons.IoMdBriefcase />
        },
        {
          title: 'View Positions',
          path: '/viewPositions',
          icon: <FaIcons.FaEye />
        },
      ]
    },
    {
      title: 'Candidates',
      icon: <IoIcons.IoMdPeople />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: 'Add Candidate',
          path: '/addCandidates',
          icon: <IoIcons.IoIosPersonAdd />
        },
        {
          title: 'View Candidates',
          path: '/viewCandidates',
          icon: <IoIcons.IoIosPeople />
        },
      ]
    },
    {
      title: 'Hirings',
      icon: <FaIcons.FaUsers />,
      iconClosed: <MdIcons.MdArrowDropDown />,
      iconOpened: <MdIcons.MdArrowDropUp />,
      subNav: [
        {
          title: 'Add Hiring',
          path: '/addHiring',
          icon: <FaIcons.FaUserPlus />
        },
        {
          title: 'View Hiring',
          path: '/viewHiring',
          icon: <FaIcons.FaEye />
        }
      ]
    }
  ];

  if (role !== 'admin') {
    return sidebarData.filter(item => item.title !== 'Recruiters');
  }

  return sidebarData;
};
