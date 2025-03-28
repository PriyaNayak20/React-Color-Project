import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ColorPalette {
  name: string
  createdAt: number
  colors: string[]
}

interface PaletteState {
  palettes: { [key: string]: ColorPalette }
  colorFormat: 'hex' | 'rgb'
  palettesList: ColorPalette[]
  level: number
}

const initialState: PaletteState = {
  palettes: {},
  colorFormat: 'hex',
  palettesList: [],
  level: 500
}

const paletteSlice = createSlice({
  name: 'palette',
  initialState,
  reducers: {
    setPalette: (
      state,
      action: PayloadAction<{ id: string; palette: ColorPalette }>
    ) => {
      state.palettes[action.payload.id] = action.payload.palette
    },
    updatePaletteColors: (
      state,
      action: PayloadAction<{ id: string; colors: string[] }>
    ) => {
      if (state.palettes[action.payload.id]) {
        state.palettes[action.payload.id].colors = action.payload.colors
      }
    },
    setColorFormat: (state, action: PayloadAction<'hex' | 'rgb'>) => {
      state.colorFormat = action.payload
    },
    setPalettesList: (state, action: PayloadAction<ColorPalette[]>) => {
      state.palettesList = action.payload
    },
    addPalette: (state, action: PayloadAction<ColorPalette>) => {
      state.palettesList.push(action.payload)
      state.palettes[action.payload.name] = action.payload
    },
    setLevel: (state, action: PayloadAction<number>) => {
      state.level = action.payload
    }
  },
})

export const {
  setPalette,
  updatePaletteColors,
  setColorFormat,
  setPalettesList,
  addPalette,
  setLevel,
} = paletteSlice.actions
export default paletteSlice.reducer
