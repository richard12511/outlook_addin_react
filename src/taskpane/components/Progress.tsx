import * as React from "react";
 
export interface ProgressProps {
  title: string;
  logo: string;
  message: string;
}
 
const Progress: React.FC<ProgressProps> = ({ title, logo, message }) => {
  return (
<div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
<img 
        src={logo} 
        alt={title}
        style={{
          width: '80px',
          height: '80px',
          marginBottom: '20px'
        }}
      />
<h2 style={{ 
        color: '#0078d4',
        marginBottom: '10px',
        fontSize: '18px'
      }}>
        {title}
</h2>
<p style={{
        color: '#605e5c',
        fontSize: '14px',
        maxWidth: '300px'
      }}>
        {message}
</p>
</div>
  );
};
 
export default Progress;