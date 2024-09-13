import React from 'react';
import DiagramInterface from './components/DiagramInterface'; 
import Mysql from './components/Mysql';

const App: React.FC = () => {
  return (
    <div>
      <DiagramInterface />
      <Mysql/>
    </div>
  );
};

export default App;
