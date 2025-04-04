import React from 'react'
import styled from 'styled-components'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  color: string
}

export const SortableColor: React.FC<Props> = ({ color }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: color })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <ColorBoxStyled
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="color-box" style={{ backgroundColor: color }}>
        <h4>{color}</h4>
      </div>
    </ColorBoxStyled>
  )
}

const ColorBoxStyled = styled.div`
  touch-action: none;
  width: 100%;
  aspect-ratio: 1;

  .color-box {
    width: 100%;
    height: 100%;
    cursor: move;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 8px;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.02);
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
