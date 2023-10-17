import './App.css';
import React, { useState, useEffect } from 'react';
import './styles.css';
import Header from './components/Header';
import LawyerSection from './components/LawyerSection';
import Footer from './components/Footer';
import ServiceSection from './components/ServicesSection';
import MancheteSection from './components/ManchetesSections';
import Search from './components/Search';

function App() {

  const [orientation, setOrientation] = useState('portrait');
  const [device, setDevice] = useState(window.innerWidth > 768 ? 'desktop' : 'mobile')

  useEffect(() => {

    function handleResize() {
      const isPortrait = window.matchMedia('(orientation: portrait)').matches;
      setOrientation(!!isPortrait ? 'portrait' : 'landscape')
      const width = window.innerWidth
      let device = ''; 
      
      if (width > 765) {
        device = 'desktop'

      }else
      if (width > 320) {
        device = 'mobile'

      }else {
        device = 'mini';
      }
      
      setDevice(device);
    }

    handleResize()

    // Adiciona o ouvinte de evento resize
    window.addEventListener('resize', handleResize);

    return () => {
      // Remova o ouvinte de evento ao desmontar o componente
      window.removeEventListener('resize', handleResize);
    };

  }, []);

  return (
    <div className="App">
      <Header orientation={orientation} device={device}/>
      <LawyerSection orientation={orientation} device={device}/>
      <Search orientation={orientation} device={device}/>
      <ServiceSection orientation={orientation}/>
      <MancheteSection orientation={orientation}/>
      <Footer orientation={orientation}/>
    </div>
  );
}

export default App;
