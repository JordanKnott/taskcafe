import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from 'pages/Login';

import NormalizeStyles from './NormalizeStyles';
import BaseStyles from './BaseStyles';

const App = () => {
  return (
    <>
      <NormalizeStyles />
      <BaseStyles />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
