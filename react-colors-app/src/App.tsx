import styled from 'styled-components'
import bg from './components/bg.png'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Palette from './components/Palette'
import Palettes from './components/Palettes'

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
