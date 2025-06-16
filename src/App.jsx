import './App.css'
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';


export function App() {
  const { t } = useTranslation();

  return (
    <>
      <Home/>
    </>
  )
}


