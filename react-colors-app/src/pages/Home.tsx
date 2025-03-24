import React from 'react'
import { palettes } from '../data/palettes'
import '../index.css'

const Home: React.FC = () => {
  console.log('Palettes Data:', palettes)
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Color Palettes</h1>

      {/* Grid layout for palettes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {palettes.map((palette) => (
          <div
            key={palette.id}
            className="rounded-lg shadow-lg overflow-hidden"
          >
            <h2 className="text-lg font-semibold p-3">{palette.name}</h2>

            {/* Color boxes */}
            <div className="grid grid-cols-5">
              {palette.colors.map((color) => (
                <div
                  key={color}
                  className="h-20 w-full border border-black"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
