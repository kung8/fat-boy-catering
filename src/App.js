import './App.scss';
import routes from './routes';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
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
      <Footer />
    </div>
  )
}

export default App;
