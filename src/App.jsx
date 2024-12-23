import { useEffect, useRef, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import init from './three/editor/index';
import { jwtDecode } from 'jwt-decode';

function App() {
  const decoded = jwtDecode(
    'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImM1MzBjMTRjLTM5ZDEtNGQyMS04MTQyLWM5NTNkMmUzYmU1MSJ9.cHmelicBaIVY3EIresAjc8Jm-ZUTV7O0vpcXlkJ4YIbTPhgo-wqFeNDdMOM-9CEeaTE7ol0P3mwPoG6iTi7v5A'
  );
  console.log('decoded', decoded);
  const [count, setCount] = useState(0);
  const containerRef = useRef(null);
  useEffect(() => {
    console.log('containerRef', containerRef.current);
    init(containerRef.current);
  }, []);
  return (
    <>
      <div className={'container'} ref={containerRef}></div>
    </>
  );
}

export default App;
