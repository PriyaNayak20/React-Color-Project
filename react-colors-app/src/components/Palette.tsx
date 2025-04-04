import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { useNavigate } from 'react-router-dom'
import { setPalette, setColorFormat, setLevel } from '../store/paletteSlice'
import { palette } from '../MyPalette'
import chroma from 'chroma-js'

const moreColorBtn = <i className="fa-regular fa-square-caret-down fa-beat"></i>

function Palette() {
  const { id = '' } = useParams<{ id: string }>()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { palettes, colorFormat, level } = useSelector(
    (state: RootState) => state.palette
  )

  const [currentColor, setCurrentColor] = React.useState('')
  const currentPalette = id ? palettes[id] : null

  useEffect(() => {
    if (id) {
      const savedPalette = localStorage.getItem(`myPalette-${id}`)
      if (savedPalette) {
        const parsedPalette = JSON.parse(savedPalette)
        dispatch(setPalette({ id, palette: parsedPalette }))
      } else {
        const initialPalette = palette.find((pal) => pal.name === id)
        if (initialPalette) {
          dispatch(setPalette({ id, palette: initialPalette }))
        } else {
          navigate('/')
        }
      }
    }
  }, [id, dispatch, navigate])

  const toggleToRgb = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setColorFormat(e.target.value as 'hex' | 'rgb'))
  }

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLevel(Number(e.target.value)))
  }

  const getColorShade = (color: string): string => {
    try {
      const chromaColor = chroma(color)
      const hsl = chromaColor.hsl()
      const lightness = ((1000 - level) / 1000) * 100
      return chroma.hsl(hsl[0], hsl[1], lightness / 100).hex()
    } catch (e) {
      return color
    }
  }

  const convertToRGB = (hex: string): string => {
    hex = hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgb(${r}, ${g}, ${b})`
  }

  const handleFullColorClick = (color: string) => {
    setCurrentColor(color)
    setTimeout(() => {
      setCurrentColor('')
    }, 1300)
  }

  const handleCopyToClipboard = (e: React.MouseEvent<HTMLDivElement>) => {
    const text = e.currentTarget.innerText
    navigator.clipboard.writeText(text)
  }

  const moreColor = (index: number) => {
    if (!id || !currentPalette) return
    const selectedColor = currentPalette.colors[index]
    const generatedShades = chroma
      .scale([selectedColor, '#ffffff'])
      .mode('lab')
      .colors(6)

    navigate(`/shades/${id}`, { state: { shades: generatedShades } })
  }

  if (!currentPalette) return null

  return (
    <PaletteStyled>
      <div className="header-items">
        <div className="link-con">
          <Link to={'/'}>&larr;&nbsp; Back</Link>
          <div className="level-slider">
            <span>Level: {level}</span>
            <input
              type="range"
              min="100"
              max="900"
              step="100"
              value={level}
              onChange={handleLevelChange}
            />
          </div>
        </div>
        <div className="select-type">
          <select value={colorFormat} onChange={toggleToRgb}>
            <option value="hex">HEX</option>
            <option value="rgb">RGB</option>
          </select>
        </div>
      </div>
      <div className="colors">
        {currentPalette.colors.map((color: string, index: number) => {
          const shadedColor = getColorShade(color)
          return (
            <div
              key={index}
              style={{ background: shadedColor }}
              className="full-color"
              onClick={(e) => {
                handleCopyToClipboard(e)
                handleFullColorClick(shadedColor)
              }}
            >
              <h4>
                {colorFormat === 'hex'
                  ? shadedColor
                  : convertToRGB(shadedColor)}
              </h4>
              <button
                className="btn-icon"
                onClick={(e) => {
                  e.stopPropagation()
                  moreColor(index)
                }}
              >
                {moreColorBtn}
              </button>
            </div>
          )
        })}
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
      display: flex;
      align-items: center;
      gap: 2rem;

      .level-slider {
        display: flex;
        align-items: center;
        gap: 1rem;

        span {
          font-weight: 500;
        }

        input[type='range'] {
          width: 200px;
          height: 8px;
          -webkit-appearance: none;
          background: #ddd;
          border-radius: 5px;
          outline: none;

          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            background: #a855f7;
            border-radius: 50%;
            cursor: pointer;
          }

          &::-moz-range-thumb {
            width: 18px;
            height: 18px;
            background: #a855f7;
            border-radius: 50%;
            cursor: pointer;
            border: none;
          }
        }
      }
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
    z-index: 999;
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
        bottom: 0;
        border-bottom-left-radius: 7px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        padding: 0.8rem;
        font-size: 1.3rem;
        color: #fff;
        background: transparent;
        cursor: pointer;
        z-index: 10;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        outline: none;
        &:hover {
          background: transparent;
          transform: scale(1.1);
        }
        i {
          font-size: 1.2rem;
          color: white;
        }
      }
    }
  }
`

export default Palette
