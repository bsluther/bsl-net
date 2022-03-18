module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      width: {
        144: '36rem',
        192: '48rem'
      },
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
            600: '#666565',
            700: '#595858',
            800: '#424242',
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
        'container': '5rem auto',
        'mainHeader': '2rem 1fr',
        'mobileNav': '1fr 3rem',
        'mobileLayout': '2rem 1fr 4rem 3rem',
        'bottomBar': '1fr 4rem'
      },
      gridTemplateColumns: {
        mainLarge: '500px auto'
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
