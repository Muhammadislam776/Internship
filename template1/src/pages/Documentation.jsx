import React, { useState } from 'react';
import './Documentation.css';
import { docData } from './DocumentationData';

const Documentation = () => {
  const [activeTab, setActiveTab] = useState('welcome');

  return (
    <div className="doc-container">
      {/* Doc Sidebar */}
      <div className="doc-sidebar">
        <ul className="doc-nav">
          <li className={activeTab === 'welcome' ? 'active' : ''} onClick={() => setActiveTab('welcome')}>Welcome</li>
          <li className={activeTab === 'prerequisites' ? 'active' : ''} onClick={() => setActiveTab('prerequisites')}>Prerequisites</li>
          <li className={activeTab === 'getting-started' ? 'active' : ''} onClick={() => setActiveTab('getting-started')}>Getting Started</li>
          <li className={activeTab === 'installation' ? 'active' : ''} onClick={() => setActiveTab('installation')}>Installation</li>
          <li className="has-child">
            <span>Authentication</span>
            <i className="ri-arrow-right-s-line"></i>
          </li>
          <li className={activeTab === 'api' ? 'active' : ''} onClick={() => setActiveTab('api')}>Axios API Calls</li>
          <li className={activeTab === 'localization' ? 'active' : ''} onClick={() => setActiveTab('localization')}>Localization</li>
          <li className={activeTab === 'file-structure' ? 'active' : ''} onClick={() => setActiveTab('file-structure')}>File Structure</li>
          <li className={activeTab === 'routing' ? 'active' : ''} onClick={() => setActiveTab('routing')}>Routing</li>
        </ul>
        
        <div className="doc-powered-by">
          <i className="ri-book-3-line"></i> Powered by GitBook
        </div>
      </div>

      {/* Doc Content */}
      <div className="doc-content-area">
        <div className="doc-content-inner">
          <div className="doc-header">
            <h1>{docData[activeTab].title}</h1>
            <div className="doc-actions">
              <button className="doc-btn"><i className="ri-file-copy-line"></i> Copy <i className="ri-arrow-down-s-line"></i></button>
              <button className="doc-btn icon-only"><i className="ri-list-check"></i></button>
            </div>
          </div>
          
          <p className="doc-subtitle">{docData[activeTab].subtitle}</p>
          
          {docData[activeTab].sections.map((section, idx) => (
            <div className="doc-section" key={idx}>
              <h2>{section.heading}</h2>
              {section.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Documentation;
