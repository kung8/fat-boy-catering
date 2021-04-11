import './App.scss';
import routes from './routes';
import Navigation from './components/Navigation';
import { useState } from 'react';

function App() {
  const [isTransparent, updateIsTransparent] = useState(false);

  const checkHeight = (element) => {
    let elementHeight = document.querySelector(element).getBoundingClientRect().bottom;
    let navHeight = document.querySelector('.navigation').getBoundingClientRect().bottom;
    let bool = elementHeight > navHeight;
    updateIsTransparent(bool);
  }

  return (
    <div className="main col align-ctr">
      <Navigation isTransparent={isTransparent} />
      {routes({ checkHeight })}
    </div>
  )
}

export default App;
