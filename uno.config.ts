import { defineConfig, presetAttributify, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
  ],
  rules: [
    ['centered-absolute', {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      margin: 'auto',
    }],
  ],
  shortcuts: [{
    'theme-color': '#86F6BB',
    'theme-bg-color': '#F9F9F9',
  }],
})
