import { useEffect, useState } from 'react'


const useFontSize = () => {
  const [fontSize, setFontSize] = useState(16)

  useEffect(() => {
    const fontString = getComputedStyle(document.documentElement).fontSize
    setFontSize(parseInt(fontString.slice(0, -2)))
  }, [])

  return fontSize
}

export default useFontSize