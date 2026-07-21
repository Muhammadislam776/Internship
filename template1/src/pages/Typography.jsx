import React from 'react';

const Typography = () => {
  return (
    <div className="dashboard-content">
      <div className="chart-card" style={{ padding: '30px' }}>
        <h3 className="chart-title" style={{ marginBottom: '30px' }}>Typography</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          
          {/* Headings */}
          <div>
            <h4 style={{ color: 'var(--primary-color)', marginBottom: '20px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Headings</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>h1. Heading</span>
                <h1 style={{ margin: 0, fontSize: '36px', fontWeight: '700' }}>Heading 1</h1>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>h2. Heading</span>
                <h2 style={{ margin: 0, fontSize: '30px', fontWeight: '700' }}>Heading 2</h2>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>h3. Heading</span>
                <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Heading 3</h3>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>h4. Heading</span>
                <h4 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Heading 4</h4>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>h5. Heading</span>
                <h5 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Heading 5</h5>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>h6. Heading</span>
                <h6 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Heading 6</h6>
              </div>
            </div>
          </div>

          {/* Body Text & Colors */}
          <div>
            <h4 style={{ color: 'var(--primary-color)', marginBottom: '20px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Body Text</h4>
            <div style={{ marginBottom: '30px' }}>
              <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--text-main)', marginBottom: '15px' }}>
                <strong>Standard Paragraph:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p style={{ fontSize: '13px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
                <strong>Muted Paragraph:</strong> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
              </p>
            </div>

            <h4 style={{ color: 'var(--primary-color)', marginBottom: '20px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Text Colors</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <p style={{ margin: 0, color: 'var(--primary-color)', fontWeight: '500' }}>This is primary text color (.text-primary)</p>
              <p style={{ margin: 0, color: 'var(--success)', fontWeight: '500' }}>This is success text color (.text-success)</p>
              <p style={{ margin: 0, color: 'var(--warning)', fontWeight: '500' }}>This is warning text color (.text-warning)</p>
              <p style={{ margin: 0, color: 'var(--danger)', fontWeight: '500' }}>This is danger text color (.text-danger)</p>
              <p style={{ margin: 0, color: 'var(--info)', fontWeight: '500' }}>This is info text color (.text-info)</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Typography;
