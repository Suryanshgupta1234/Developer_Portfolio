import { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const ParticlesBackground = () => {
  const init = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="hero-particles"
      init={init}
      className="absolute inset-0 pointer-events-none"
      options={{
        fpsLimit: 60,
        particles: {
          number: { value: 60, density: { enable: true, value_area: 900 } },
          color: { value: ['#2563eb', '#06b6d4', '#7c3aed'] },
          opacity: {
            value: 0.3,
            random: true,
            animation: { enable: true, speed: 0.5, minimumValue: 0.05, sync: false },
          },
          size: {
            value: 2,
            random: true,
            animation: { enable: true, speed: 2, minimumValue: 0.5, sync: false },
          },
          links: {
            enable: true,
            distance: 120,
            color: '#2563eb',
            opacity: 0.1,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.6,
            direction: 'none',
            random: true,
            outMode: 'bounce',
          },
        },
        interactivity: {
          detectsOn: 'canvas',
          events: {
            onHover: { enable: true, mode: 'grab' },
            onClick: { enable: true, mode: 'push' },
          },
          modes: {
            grab: { distance: 140, links: { opacity: 0.3 } },
            push: { quantity: 2 },
          },
        },
        detectRetina: true,
        background: { color: 'transparent' },
      }}
    />
  );
};

export default ParticlesBackground;
