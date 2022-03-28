

const CONFIG = {
  tierRadii: [30, 45]
}

const dataGroups = {
  webdev: {
    id: 'webdev',
    percentage: 0.5,
    index: 0,
    children: [
      {
        id: 'tracker',
        percentage: 0.4,
        index: 0,
        parent: 'webdev'
      },
      {
        id: 'svg',
        percentage: 0.6,
        index: 1,
        parent: 'webdev'
      }
    ]
  },
  math: {
    id: 'math',
    percentage: 0.3,
    index: 1,
    children: [
      {
        id: 'linear_algebra',
        percentage: 0.4,
        index: 0,
        parent: 'math'
      },
      {
        id: 'set_theory',
        percentage: 0.6,
        index: 1,
        parent: 'math'
      }
    ]
  },
  theory: {
    id: 'theory',
    percentage: 0.2,
    index: 2,
    children: [
      {
        id: 'fp',
        percentage: 0.8,
        index: 0,
        parent: 'theory'
      },
      {
        id: 'type_theory',
        percentage: 0.2,
        index: 1,
        parent: 'theory'
      }
    ]
  }
}



export { dataGroups }
