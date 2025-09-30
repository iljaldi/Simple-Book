import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './styles/design-tokens.css'
import './styles/pretendard.css'
import './index.css'
import './styles/remixicon.css'

console.log('main.tsx is loading...');
console.log('Root element:', document.getElementById("root"));

try {
  const root = createRoot(document.getElementById("root")!);
  console.log('Root created successfully');
  root.render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error in main.tsx:', error);
}

