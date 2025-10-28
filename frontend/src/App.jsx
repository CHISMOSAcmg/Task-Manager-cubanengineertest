import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="container">
        <h1 className="app-title">Task List</h1>
        <TaskList />
      </div>
    </div>
  );
}

export default App;