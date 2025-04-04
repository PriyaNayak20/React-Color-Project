import React from 'react'
import { useLocation, Link, useParams } from 'react-router-dom'
import styled from 'styled-components'

const ShadesPage = () => {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const { shades } = location.state || { shades: [] }

  return (
    <ShadesPageStyled>
      <div className="header">
        <Link to={`/palette/${id}`}>← Back</Link>
        <h1>Shades</h1>
      </div>
      <div className="shades-container">
        {shades.map((shade: string, index: number) => (
          <div
            key={index}
            className="shade"
            style={{ backgroundColor: shade }}
            onClick={() => navigator.clipboard.writeText(shade)}
          >
            <p>{shade}</p>
          </div>
        ))}
      </div>
    </ShadesPageStyled>
  )
}

const ShadesPageStyled = styled.div`
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    a {
      text-decoration: none;
      color: #000;
      font-weight: bold;
    }
    h1 {
      font-size: 1.5rem;
    }
  }
  .shades-container {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    padding: 1rem;
  }
  .shade {
    width: 700px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.3s ease;
    color: #fff;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);

    &:hover {
      transform: scale(1.05);
    }
  }
`

export default ShadesPage
