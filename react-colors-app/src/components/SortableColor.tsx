import React from 'react'
import styled from 'styled-components'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  color: string
  onDelete: (color: string) => void
}

export const SortableColor: React.FC<Props> = ({ color, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: color })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <ColorBoxStyled>
      <div ref={setNodeRef} style={style} className="color-box">
        <div
          className="draggable-area"
          style={{ backgroundColor: color }}
          {...attributes}
          {...listeners}
        >
          <h4>{color}</h4>
        </div>
        <button
          className="delete-btn"
          onClick={() => onDelete(color)}
          type="button"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    </ColorBoxStyled>
  )
}

const ColorBoxStyled = styled.div`
  width: 100%;
  aspect-ratio: 1;

  .color-box {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 8px;
    overflow: hidden;

    .draggable-area {
      width: 100%;
      height: 100%;
      cursor: move;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.02);
      }
    }

    &:hover .delete-btn {
      opacity: 1;
    }

    .delete-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      z-index: 100;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }
    }

    h4 {
      font-size: 1.2rem;
      color: #fff;
      text-transform: uppercase;
      font-weight: 700;
      text-shadow: 3px 3px 1px rgba(0, 0, 0, 0.2);
      pointer-events: none;
    }
  }
`
