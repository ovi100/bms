import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import './Navigation.css';

const MENU_LIST = [
  {
    name: 'Dashboard',
    icon: HomeIcon,
    url: '/',
    children: []
  },
  {
    name: 'Users',
    icon: PeopleAltIcon,
    children: [
      { name: 'Add User', url: 'add-user' },
      { name: 'User List', url: 'user-list' },
    ]
  },
  {
    name: 'Bill',
    icon: ContentPasteIcon,
    children: [
      { name: 'New Bill', url: '/add' },
      { name: 'Bill List', url: '/bills' }
    ]
  },
  {
    name: 'Chart Report',
    icon: BarChartIcon,
    url: 'chart-report',
    children: []
  },
  {
    name: 'Invoice',
    icon: AssignmentIcon,
    url: 'invoice',
    children: []
  }
];

const CustomMenuItem = ({ menuItem }) => {
  const [collapse, setCollapse] = useState(false);

  const handleClick = () => {
    setCollapse(!collapse);
  };

  return (
    <>
      {
        menuItem.children.length > 0 ?
          <List>
            <ListItemButton onClick={handleClick}>
              <ListItemIcon>
                <menuItem.icon />
              </ListItemIcon>
              <ListItemText primary={menuItem.name} />
              {collapse ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={collapse} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {menuItem.children.map(menuChild => (
                  <ListItemButton key={menuChild.name} sx={{ pl: 5 }}>
                    <Link to={menuChild.url} className="child-link">
                      {menuChild.name}
                    </Link>
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </List>
          :
          <List>
            <ListItemButton onClick={handleClick}>
              <ListItemIcon>
                <menuItem.icon />
              </ListItemIcon>
              <Link to={menuItem.url} className="parent-link">
                {menuItem.name}
              </Link>
            </ListItemButton>
          </List>
      }
    </>
  );
}

const MenuList = () => {

  return (
    <>
      <List>
        {MENU_LIST.map(item => (
          <CustomMenuItem key={item.name} menuItem={item} />
        )
        )}
      </List>
    </>
  )
}

export default MenuList
