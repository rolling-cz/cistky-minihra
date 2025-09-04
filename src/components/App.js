import React from 'react';
import '../styles/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import GameContainer from "./GameContainer";
import LanguageSwitch from "./LanguageSwitch";

function App() {
  return (
    <div className="App">
      <LanguageSwitch />
      <GameContainer />
    </div>
  );
}

export default App;
