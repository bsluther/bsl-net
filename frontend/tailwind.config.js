module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        hermit: {
          aqua: {
            200: '#659C94',
            300: '#597571',
            400: '#597a75',
            500: '#59777A'
          },
          grey: {
            200: '#E1E1E1',
            300: '#dbdbdb',
            400: '#C7C7C7',
            500: '#AEAEAE',
            900: '#262626'
          },
          yellow: {
            400: '#ffe629',
            401: '#ffe100',
            402: '#FFF500',
            403: '#ffeb57'
          }
        }
      },
      gridTemplateRows: {
        'container': '5rem auto'
      },
      fontFamily: {
        customMono: [
          '"Source Code Pro"',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace'
        ]
      }
    },
  },
  plugins: [],
}
