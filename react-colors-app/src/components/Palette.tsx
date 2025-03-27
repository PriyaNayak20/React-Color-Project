import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { SketchPicker } from 'react-color'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import {
  setPalette,
  updatePaletteColors,
  setColorFormat,
} from '../store/paletteSlice'
import { palette } from '../MyPalette'

const del = <i className="fa-sharp fa-solid fa-trash"></i>
const paletteIcon = <i className="fa-solid fa-palette"></i>

function Palette() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch()
  const { palettes, colorFormat } = useSelector(
    (state: RootState) => state.palette
  )

  const initialPalette = palette.find((pal) => pal.name === id)
  const myPalette = palettes[id || ''] || initialPalette

  const [toggleColorPicker, setToggleColorPicker] = React.useState(false)
  const [colorPickerColor, setColorPickerColor] = React.useState('#fff')
  const [currentColor, setCurrentColor] = React.useState('')

  useEffect(() => {
    if (id && initialPalette) {
      const savedPalette = localStorage.getItem(`myPalette-${id}`)
      if (savedPalette) {
        dispatch(setPalette({ id, palette: JSON.parse(savedPalette) }))
      } else {
        dispatch(setPalette({ id, palette: initialPalette }))
      }
    }
  }, [id, initialPalette, dispatch])

  useEffect(() => {
    if (id && myPalette) {
      localStorage.setItem(`myPalette-${id}`, JSON.stringify(myPalette))
    }
  }, [myPalette, id])

  const toggleToRgb = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setColorFormat(e.target.value as 'hex' | 'rgb'))
  }

  const convertToRGB = (hex: string): string => {
    hex = hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgb(${r}, ${g}, ${b})`
  }

  const handleColorChange = (color: any) => {
    setColorPickerColor(color.hex)
  }

  const handleFullColorClick = (color: string) => {
    setCurrentColor(color)
    setTimeout(() => {
      setCurrentColor('')
    }, 1300)
  }

  const createColor = () => {
    if (!colorPickerColor || !id) return

    const newColors = [...myPalette.colors]
    if (newColors.length < 20) {
      newColors.push(colorPickerColor)
      dispatch(updatePaletteColors({ id, colors: newColors }))
    } else {
      alert('You can only add 20 colors to a palette')
    }
  }

  const handleCopyToClipboard = (e: React.MouseEvent<HTMLDivElement>) => {
    const text = e.currentTarget.innerText
    navigator.clipboard.writeText(text)
  }

  const deleteColor = (index: number) => {
    if (!id) return
    const newColors = [...myPalette.colors]
    newColors.splice(index, 1)
    dispatch(updatePaletteColors({ id, colors: newColors }))
  }

  if (!myPalette) return null

  return (
    <PaletteStyled>
      <div className="header-items">
        <div className="link-con">
          <Link to={'/'}>&larr;&nbsp; Back</Link>
        </div>
        <div className="select-type">
          <select value={colorFormat} onChange={toggleToRgb}>
            <option value="hex">HEX</option>
            <option value="rgb">RGB</option>
          </select>
        </div>
        <div className="right">
          <button
            onClick={() => setToggleColorPicker(!toggleColorPicker)}
            className="btn-icon"
          >
            {paletteIcon}
            <span>Add Color</span>
          </button>
        </div>
      </div>
      {toggleColorPicker && (
        <div className="color-picker-con">
          <div className="color-picker">
            <SketchPicker
              color={colorPickerColor}
              onChange={handleColorChange}
              width="400px"
            />
            <button className="btn-icon" onClick={createColor}>
              <i className="fa-solid fa-plus"></i>
              <span>Add Color</span>
            </button>
          </div>
          <div
            onClick={() => setToggleColorPicker(!toggleColorPicker)}
            className="color-picker-overlay"
          ></div>
        </div>
      )}
      <div className="colors">
        {myPalette.colors.map((color, index) => (
          <div
            key={index}
            style={{ background: color }}
            className="full-color"
            onClick={(e) => {
              handleCopyToClipboard(e)
              handleFullColorClick(e.currentTarget.style.backgroundColor)
            }}
          >
            <h4>{colorFormat === 'hex' ? color : convertToRGB(color)}</h4>
            <button className="btn-icon" onClick={() => deleteColor(index)}>
              {del}
            </button>
          </div>
        ))}
      </div>
      {currentColor && (
        <div
          className="current-color"
          style={{ backgroundColor: currentColor }}
        >
          <div className="text">
            <h3>Copied!</h3>
          </div>
        </div>
      )}
    </PaletteStyled>
  )
}

const PaletteStyled = styled.div`
  position: relative;
  z-index: 5;
  width: 100%;
  .btn-icon {
    outline: none;
    cursor: pointer;
    font-size: 1.5rem;
    border: none;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: 7px;
    color: white;
    background: #a855f7;
    transition: all 0.3s ease-in-out;
    gap: 0.5rem;
    &:hover {
      background: #0d0b33;
    }
    i {
      font-size: 1.2rem;
    }
    span {
      font-size: 1rem;
      font-weight: 500;
    }
  }
  .header-items {
    height: 6vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    background-color: #fff;
    .link-con {
      a {
        text-decoration: none;
        font-family: inherit;
        font-size: inherit;
        color: #000;
        font-weight: 500;
        width: 50%;
      }
    }
    select {
      font-family: inherit;
      font-size: inherit;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 5px;
      outline: none;
      color: #fff;
      background-color: #000;
      cursor: pointer;
    }
    .right {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      button:last-child {
        background-color: red;
      }
    }
  }
  .current-color {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(0);
    transition: all 0.3s ease-in-out;
    animation: show 0.3s ease-in-out forwards;
    .text {
      background: rgba(255, 255, 255, 0.26);
      padding: 2rem 6rem;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.09);
      h3 {
        text-align: center;
        font-size: 5rem;
        color: white;
        font-weight: 700;
        text-transform: uppercase;
        text-shadow: 3px 5px 7px rgba(0, 0, 0, 0.1);
      }
    }
    @keyframes show {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
  }
  .colors {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    width: 100%;
    min-height: 94vh;
    .full-color {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      h4 {
        font-size: 1.2rem;
        color: #fff;
        text-transform: uppercase;
        font-weight: 700;
        text-shadow: 3px 3px 1px rgba(0, 0, 0, 0.2);
        pointer-events: none;
      }
      button {
        position: absolute;
        right: 0;
        bottom: 0px;
        border-bottom-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        padding: 0.3rem 0.4rem;
        font-size: 1.1rem;
        color: #fff;
        background: transparent;
        filter: drop-shadow(0 3px 0.3rem rgba(0, 0, 0, 0.4));
      }
    }
  }

  .color-picker-con {
    .sketch-picker {
      box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.5) !important;
    }
    .color-picker {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 11;
      button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.5);
      }
    }

    .color-picker-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 1;
    }
  }
`

export default Palette
