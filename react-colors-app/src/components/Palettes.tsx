import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { setPalettesList } from '../store/paletteSlice'
import { palette } from '../MyPalette'

interface ColorPalette {
  name: string
  createdAt: number
  colors: string[]
}

const del = <i className="fas fa-trash-alt"></i>

const getPaletteFromLocalStorage = (key: string): ColorPalette | null => {
  const savedPalette = localStorage.getItem(key)
  return savedPalette ? JSON.parse(savedPalette) : null
}

const savePaletteToLocalStorage = (palette: ColorPalette) => {
  const key = `myPalette-${palette.name}`
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(palette))
  }
}

function Palettes() {
  const dispatch = useDispatch()
  const { palettesList } = useSelector((state: RootState) => state.palette)

  useEffect(() => {
    palette.forEach(savePaletteToLocalStorage)
  }, [])

  useEffect(() => {
    const palettes: ColorPalette[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('myPalette-')) {
        const savedPalette = getPaletteFromLocalStorage(key)
        if (savedPalette) {
          palettes.push(savedPalette)
        }
      }
    }
    palettes.sort((a, b) => a.createdAt - b.createdAt)
    dispatch(setPalettesList(palettes))
  }, [dispatch])

  const deletePaletteHandler = (paletteName: string) => {
    localStorage.removeItem(`myPalette-${paletteName}`)
    const updatedPalettes = palettesList.filter(
      (pal) => pal.name !== paletteName
    )
    dispatch(setPalettesList(updatedPalettes))
  }

  return (
    <PalettesStyled>
      <div className="add-palette">
        <Link to="/create-palette" className="create-palette-btn">
          Create New Palette
        </Link>
      </div>
      <div className="palettes">
        {palettesList.map((pal) => (
          <Link to={`/palette/${pal.name}`} key={pal.name}>
            <div className="palette">
              {pal.colors.map((col, i) => (
                <div
                  key={i}
                  className="color"
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
            <p>{pal.name}</p>
            <div className="palette-container">
              <button
                className="btn-icon"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  deletePaletteHandler(pal.name)
                }}
              >
                {del}
              </button>
            </div>
          </Link>
        ))}
      </div>
    </PalettesStyled>
  )
}

const PalettesStyled = styled.div`
  position: relative;
  z-index: 5;
  .add-palette {
    padding: 4rem 18rem 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    @media screen and (max-width: 1670px) {
      padding: 4rem 10rem 2rem;
    }
    @media screen and (max-width: 970px) {
      padding: 4rem 5rem 2rem;
    }
    @media screen and (max-width: 600px) {
      padding: 2rem 2rem 1.5rem;
    }

    .create-palette-btn {
      text-decoration: none;
      padding: 1rem 2rem;
      background: #7263f3;
      color: white;
      border-radius: 7px;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

      &:hover {
        background: #5a4ed1;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }
    }
  }

  .palettes {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    grid-gap: 25px;
    padding: 2rem 18rem;
    transition: all 0.3s ease;
    @media screen and (max-width: 1432px) {
      padding: 2rem 10rem;
    }
    @media screen and (max-width: 1164px) {
      padding: 2rem 5rem;
    }
    @media screen and (max-width: 600px) {
      padding: 1rem 2rem;
    }
    a {
      text-decoration: none;
      display: inline-block;
      padding: 1rem;
      background-color: white;
      border-radius: 7px;
      box-shadow: 1px 3px 20px rgba(0, 0, 0, 0.2);
    }
    p {
      font-size: 1.5rem;
      padding-top: 0.5rem;
      display: inline-block;
      background: linear-gradient(
        90deg,
        rgb(12, 210, 108) 20%,
        #f56692 50%,
        #6fcf97 60%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .palette {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      width: 100%;
      height: 250px;
      .color {
        width: 100%;
        height: 100%;
      }
    }
    .btn-icon {
      background: none;
      border: none;
      color: #ff4d4d;
      font-size: 1.3rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: right;
      justify-content: flex-end;
      margin-left: auto;

      &:hover {
        color: #d93636;
        transform: scale(1.1);
      }

      &:focus {
        outline: none;
      }
    }
  }
`
export default Palettes
