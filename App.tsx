import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './src/context/ThemeContext';
import { PassagesProvider } from './src/context/PassagesContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { QuizScreen } from './src/screens/QuizScreen';
import { EditScreen } from './src/screens/EditScreen';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <PassagesProvider>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/quiz/:passageId" element={<QuizScreen />} />
            <Route path="/edit" element={<EditScreen />} />
            <Route path="/edit/:passageId" element={<EditScreen />} />
          </Routes>
        </PassagesProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
