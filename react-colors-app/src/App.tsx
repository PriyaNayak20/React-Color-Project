import styled from 'styled-components'
import bg from './bg.png'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Palettes from './components/Palettes'
import Palette from './components/Palette'

// Define the prop types for styled component
interface AppStyledProps {
  bg: string
}

function App() {
  return (
    <BrowserRouter>
      <AppStyled bg={bg}>
        <Routes>
          <Route path="/" element={<Palettes />} />
          <Route path="/palette/:id" element={<Palette />} />
        </Routes>
      </AppStyled>
    </BrowserRouter>
  )
}

const AppStyled = styled.div<AppStyledProps>`
  min-height: 100vh;
  background-color: slateblue;
  background-image: ${({ bg }) => `url(${bg})`};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
`

export default App
