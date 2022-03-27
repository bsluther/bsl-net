import { atom } from 'jotai'

const bslnetNavAtom = atom({
  links: ['tracker', 'gainzville', 'about'],
  activeLink: 'tracker'
})

export { bslnetNavAtom }