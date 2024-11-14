import { useEffect, useState } from 'react';
import AnimatedCursor from 'react-animated-cursor';
import Header from './components/header';
import NavigationMenu from './components/navigationMenu';
import Sidebar from './components/sidebar';
import About from './pages/about';

function App() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <AnimatedCursor innerSize={15}
        outerSize={15} innerStyle={{
          backgroundColor: '#EC4443'
        }}
        outerStyle={{
          backgroundColor: '#ec434375'
        }}
        outerScale={5} innerScale={0.7}
        clickables={[
          'a',
          'input[type="text"]',
          'input[type="email"]',
          'input[type="number"]',
          'input[type="submit"]',
          'input[type="image"]',
          'label[for]',
          'select',
          'textarea',
          'button',
          '.link',
          '.hamburger-react'
        ]} showSystemCursor={false} />
      <Sidebar isOpen={isOpen} />
      <Header setOpen={setOpen} isOpen={isOpen} />
      <NavigationMenu isOpen={isOpen} />
      <About isOpen={isOpen} />
    </>
  );
}

export default App;
