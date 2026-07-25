import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Experience from '../components/sections/Experience';
import Achievements from '../components/sections/Achievements';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects preview />
      <Experience />
      <Achievements />
    </>
  );
}
