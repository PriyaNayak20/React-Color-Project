import chroma from 'chroma-js'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import slugify from 'react-slugify'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { setPalettesList, addPalette } from '../store/paletteSlice'
import { palette } from '../MyPalette'

interface ColorPalette {
  name: string
  createdAt: number
  colors: string[]
}

const getPaletteFromLocalStorage = (key: string): ColorPalette | null => {
  const savedPalette = localStorage.getItem(key)
  console.log(savedPalette, 'savedPalattes1223')
  return savedPalette ? JSON.parse(savedPalette) : null
}

const savePaletteToLocalStorage = (palette: ColorPalette) => {
  const key = `myPalette-${palette.name}`
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(palette))
  }
}

const generateRandomColors = (): string[] => {
  const colors: string[] = []
  while (colors.length < 19) {
    const color = chroma.random().hex()
    if (chroma.valid(color)) {
      colors.push(color)
    }
  }
  return colors
}

function Palettes() {
  const dispatch = useDispatch()
  const { palettesList } = useSelector((state: RootState) => state.palette)
  const [paletteName, setPaletteName] = useState('')

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

  const addPaletteHandler = () => {
    if (!paletteName.trim()) return

    const newPalette: ColorPalette = {
      name: slugify(paletteName),
      createdAt: new Date().getTime(),
      colors: generateRandomColors(),
    }

    if (getPaletteFromLocalStorage(`myPalette-${newPalette.name}`)) return

    savePaletteToLocalStorage(newPalette)
    dispatch(addPalette(newPalette))
    setPaletteName('')
  }

  return (
    <PalettesStyled>
      <div className="add-palette">
        <div className="input-control">
          <input
            required
            placeholder="Create Palette..."
            value={paletteName}
            onChange={(e) => setPaletteName(e.target.value)}
            type="text"
          />
          <button onClick={addPaletteHandler}>+</button>
        </div>
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
    padding-left: 18rem;
    padding-right: 18rem;
    padding-top: 4rem;
    padding-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    margin: 0 auto;
    transition: all 0.3s ease;
    @media screen and (max-width: 1670px) {
      width: 70%;
    }
    @media screen and (max-width: 1320px) {
      width: 90%;
    }
    @media screen and (max-width: 970px) {
      width: 100%;
      padding-left: 10rem;
      padding-right: 10rem;
    }

    @media screen and (max-width: 600px) {
      width: 100%;
      padding-left: 4rem;
      padding-right: 4rem;
      padding-top: 2rem;
      padding-bottom: 1.5rem;
    }
    input,
    button {
      font-family: inherit;
      font-size: inherit;
      outline: none;
      border: none;
    }
    .input-control {
      position: relative;
      width: 100%;
      box-shadow: 1px 4px 15px rgba(0, 0, 0, 0.12);
      input {
        width: 100%;
        padding: 0.5rem 1rem;
        border-radius: 7px;
        &::placeholder {
          color: #7263f3;
          opacity: 0.3;
        }
      }
      button {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        padding: 2px 1rem;
        cursor: pointer;
        font-size: 2rem;
        height: 100%;
        border-radius: 7px;
        background-color: #7263f3;
        color: white;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          background-color: #5a4ed1;
        }
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
  }
`
export default Palettes
