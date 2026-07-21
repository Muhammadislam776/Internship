import React, { useState } from 'react';
import { 
  AcUnit, AccessAlarm, AccessTime, Accessibility, 
  AccountBalance, AccountBox, AccountCircle, AccountTree,
  Add, AddAPhoto, AddAlarm, AddAlert, AddBox, AddBusiness,
  AddCall, AddCard, AddCircle, AddComment, AddHome, 
  Home, Settings, Search, Menu, Close, Info, CheckCircle, Warning
} from '@mui/icons-material';
import './Icons.css';

const Icons = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const iconList = [
    { name: 'AcUnit', component: <AcUnit /> },
    { name: 'AccessAlarm', component: <AccessAlarm /> },
    { name: 'AccessTime', component: <AccessTime /> },
    { name: 'Accessibility', component: <Accessibility /> },
    { name: 'AccountBalance', component: <AccountBalance /> },
    { name: 'AccountBox', component: <AccountBox /> },
    { name: 'AccountCircle', component: <AccountCircle /> },
    { name: 'AccountTree', component: <AccountTree /> },
    { name: 'Add', component: <Add /> },
    { name: 'AddAPhoto', component: <AddAPhoto /> },
    { name: 'AddAlarm', component: <AddAlarm /> },
    { name: 'AddAlert', component: <AddAlert /> },
    { name: 'AddBox', component: <AddBox /> },
    { name: 'AddBusiness', component: <AddBusiness /> },
    { name: 'AddCall', component: <AddCall /> },
    { name: 'AddCard', component: <AddCard /> },
    { name: 'AddCircle', component: <AddCircle /> },
    { name: 'AddComment', component: <AddComment /> },
    { name: 'AddHome', component: <AddHome /> },
    { name: 'Home', component: <Home /> },
    { name: 'Settings', component: <Settings /> },
    { name: 'Search', component: <Search /> },
    { name: 'Menu', component: <Menu /> },
    { name: 'Close', component: <Close /> },
    { name: 'Info', component: <Info /> },
    { name: 'CheckCircle', component: <CheckCircle /> },
    { name: 'Warning', component: <Warning /> }
  ];

  const filteredIcons = iconList.filter(icon => 
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-content">
      <div className="icons-header">
        <h1>Material Icons</h1>
        <p>Ready-to-use React Material Icons from the official website.</p>
        <div className="icons-install-code">
          <code>npm install @mui/icons-material @mui/material @emotion/styled @emotion/react</code>
        </div>
      </div>
      
      <div className="icons-container chart-card">
        <div className="icons-sidebar">
          <h3>Filter the style</h3>
          <label className="radio-label">
            <input type="radio" name="style" defaultChecked /> Filled
          </label>
          <label className="radio-label">
            <input type="radio" name="style" /> Outlined
          </label>
          <label className="radio-label">
            <input type="radio" name="style" /> Rounded
          </label>
          <label className="radio-label">
            <input type="radio" name="style" /> Two tone
          </label>
          <label className="radio-label">
            <input type="radio" name="style" /> Sharp
          </label>
        </div>
        
        <div className="icons-main">
          <div className="icons-search">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Search icons..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <p className="results-count">{filteredIcons.length} matching results</p>
          
          <div className="icons-grid">
            {filteredIcons.map((icon, index) => (
              <div className="icon-item" key={index}>
                <div className="icon-wrapper">
                  {icon.component}
                </div>
                <span className="icon-name">{icon.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Icons;
