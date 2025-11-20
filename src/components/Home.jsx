function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🎵 SunoRooms</h1>
      <p>Listen to music together in sync</p>

      <div style={{ marginTop: '2rem' }}>
        <button
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            cursor: 'pointer',
            backgroundColor: '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
          }}
        >
          Create Room
        </button>
      </div>
    </div>
  );
}

export default Home;
