import OnrampOfframp from './components/OnrampOfframp';

function App() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#D4D4D4] p-8">
      {/* 
        Container to simulate the device frame resolution.
        iPhone 14 Pro / 15 Pro resolution reference: 393 x 852 px 
      */}
      <div 
        className="relative overflow-hidden shadow-2xl"
        style={{ width: '393px', height: '852px' }}
      >
        <OnrampOfframp />
      </div>
    </div>
  );
}

export default App;
