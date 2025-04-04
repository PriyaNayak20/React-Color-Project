import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableColor } from './SortableColor'
import { ChromePicker } from 'react-color'
import chroma from 'chroma-js'
import slugify from 'react-slugify'

const generateRandomColors = (count: number = 19): string[] => {
  const colors: string[] = []
  while (colors.length < count) {
    const color = chroma.random().hex()
    if (chroma.valid(color)) {
      colors.push(color)
    }
  }
  return colors
}

const CreatePalette: React.FC = () => {
  const navigate = useNavigate()
  const [colors, setColors] = useState<string[]>(generateRandomColors())
  const [currentColor, setCurrentColor] = useState<string>('#000000')
  const [paletteName, setPaletteName] = useState<string>('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      setColors((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleAddColor = () => {
    if (colors.length >= 20) {
      alert('Maximum 20 colors allowed!')
      return
    }
    setColors([...colors, currentColor])
  }

  const handleSavePalette = () => {
    if (!paletteName.trim()) {
      alert('Please enter a palette name')
      return
    }

    const newPalette = {
      name: slugify(paletteName),
      createdAt: new Date().getTime(),
      colors: colors,
    }

    localStorage.setItem(
      `myPalette-${newPalette.name}`,
      JSON.stringify(newPalette)
    )
    navigate('/')
  }

  return (
    <CreatePaletteStyled>
      <header>
        <div className="left-section">
          <Link to="/" className="back-btn">
            ← Go Back
          </Link>
          <input
            type="text"
            placeholder="Palette Name"
            value={paletteName}
            onChange={(e) => setPaletteName(e.target.value)}
            className="palette-name-input"
          />
        </div>
        <button className="save-btn" onClick={handleSavePalette}>
          Save Palette
        </button>
      </header>

      <main>
        <aside className="color-picker">
          <h3>Add New Color</h3>
          <ChromePicker
            color={currentColor}
            onChange={(color) => setCurrentColor(color.hex)}
          />
          <button onClick={handleAddColor} className="add-color-btn">
            Add Color
          </button>
        </aside>

        <section className="colors-container">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={colors} strategy={rectSortingStrategy}>
              <div className="colors-grid">
                {colors.map((color) => (
                  <SortableColor key={color} color={color} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>
      </main>
    </CreatePaletteStyled>
  )
}

const CreatePaletteStyled = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f9f9f9;

  header {
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    height: 70px;

    .left-section {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .back-btn {
      color: #333;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      &:hover {
        background: #f0f0f0;
      }
    }

    .palette-name-input {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 1rem;
      width: 250px;
      &:focus {
        outline: none;
        border-color: #7263f3;
      }
    }

    .save-btn {
      padding: 0.5rem 1.5rem;
      border-radius: 5px;
      cursor: pointer;
      background: #7263f3;
      color: white;
      border: none;
      font-size: 1rem;
      &:hover {
        background: #5a4ed1;
      }
    }
  }

  main {
    flex: 1;
    display: flex;
    height: calc(100vh - 70px);

    .color-picker {
      width: 320px;
      padding: 2rem;
      background: white;
      border-right: 1px solid #eee;
      height: 100%;
      display: flex;
      flex-direction: column;

      h3 {
        margin-bottom: 1.5rem;
        font-size: 1.2rem;
        color: #333;
      }

      .chrome-picker {
        width: 100% !important;
        margin-bottom: 1.5rem;
      }

      .add-color-btn {
        width: 100%;
        margin-top: 1rem;
        padding: 1rem;
        background: #7263f3;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        &:hover {
          background: #5a4ed1;
        }
      }
    }

    .colors-container {
      flex: 1;
      padding: 1.5rem;
      display: flex;
      align-items: flex-start;

      .colors-grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
        align-items: start;
      }
    }
  }
`

export default CreatePalette
