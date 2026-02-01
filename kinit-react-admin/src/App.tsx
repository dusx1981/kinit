import { useRoutes } from 'react-router-dom'
import { routes } from './router'
import './styles/index.less'

function App() {
  const element = useRoutes(routes)
  return element
}

export default App
