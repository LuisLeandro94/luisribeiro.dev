import { useState } from 'react';
import AnimatedCursor from 'react-animated-cursor';
import Header from './components/header';
import NavigationMenu from './components/navigationMenu';
import About from './pages/about';

function App() {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <AnimatedCursor innerSize={8}
        outerSize={35} innerStyle={{
          backgroundColor: '#EC4443'
        }}
        outerStyle={{
          backgroundColor: '#ec434375'
        }} />
      <Header setOpen={setOpen} isOpen={isOpen} />
      <NavigationMenu isOpen={isOpen} />
      <About isOpen={isOpen} />
    </>
  );
}

export default App;
