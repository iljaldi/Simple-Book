import React from 'react';

const TestPage = () => {
  console.log('TestPage is rendering');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem', 
      backgroundColor: '#f0f0f0',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          color: '#333',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          🚀 Test Page Working! 🚀
        </h1>
        
        <div style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          textAlign: 'center',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}>
          ✅ React is working perfectly!
        </div>
        
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '1rem'
        }}>
          이 페이지가 보인다면 React 애플리케이션이 정상적으로 작동하고 있습니다.
        </p>
        
        <div style={{
          backgroundColor: '#2196F3',
          color: 'white',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>현재 시간:</h3>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>
            {new Date().toLocaleString('ko-KR')}
          </p>
        </div>
        
        <div style={{
          backgroundColor: '#FF9800',
          color: 'white',
          padding: '1rem',
          borderRadius: '4px'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>브라우저 정보:</h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            User Agent: {navigator.userAgent}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
