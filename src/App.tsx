import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Wizard from './wizard/Wizard'
import DeploymentWizard from './wizard/DeploymentWizard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Wizard />} />
        <Route path="/deployment" element={<DeploymentWizard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
