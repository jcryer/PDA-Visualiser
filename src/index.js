import React from 'react';
import ReactDOM from 'react-dom';
import Graph from './Graph';
import { ReactFlowProvider } from "react-flow-renderer";

ReactDOM.render(
  
  <ReactFlowProvider>
  <Graph /></ReactFlowProvider>,
  document.getElementById('root')
);