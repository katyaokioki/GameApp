import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    score: 0,
    level: 1,
  });

  return (
    <GameContext.Provider value={{ userData, setUserData }}>
      {children}
    </GameContext.Provider>
  );
};