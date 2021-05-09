import './App.scss';
import routes from './routes';
import Navigation from './components/_Global/Navigation';
import { useState } from 'react';

function App() {
  const [isTransparent, updateIsTransparent] = useState(true);
  const [cartNum, updateCartNum] = useState(0);

  const checkHeight = (element) => {
    let elementHeight = document.querySelector(element).getBoundingClientRect().bottom;
    let navHeight = document.querySelector('.navigation').getBoundingClientRect().bottom;
    let bool = elementHeight > navHeight;
    updateIsTransparent(bool);
  }

  return (
    <div className="main col align-ctr">
      <Navigation isTransparent={isTransparent} cartNum={cartNum} />
      {routes({ checkHeight, updateCartNum })}
    </div>
  )
}

export default App;
