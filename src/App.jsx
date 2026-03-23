import React from 'react';

const App = () => {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        color: '#fff',
        backgroundColor: '#04080f',
        minHeight: '100vh',
        padding: '20px'
      }}
    >
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ margin: 0 }}>betai</h1>
        <p style={{ marginTop: 4, opacity: 0.8 }}>
          MVP de predicción de resultados deportivos
        </p>
      </header>

      <main style={{ maxWidth: 800, margin: '0 auto' }}>
        <section>
          <h2>Estado</h2>
          <p>
            Bienvenido a Betai. Este es un esqueleto para arrancar el MVP. Sustituye
            con tus componentes y lógica de negocio.
          </p>
        </section>
      </main>
    </div>
  );
};

export default App;
