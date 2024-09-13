import React from 'react';
import DiagramInterface from './components/DiagramInterface'; 
import Mysql from './DB/Mysql';
import Sqlserver from './DB/Sqlserver';
import PostgreSQL from './DB/Postgre';

const App: React.FC = () => {
  return (
    <div>
      <DiagramInterface />
      <PostgreSQL/>
    </div>
  );
};

export default App;
