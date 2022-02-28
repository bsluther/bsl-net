const PlusCircleSvg = ({ handleClick, styling, fill = 'none', stroke = "currentColor", strokeWidth = 2 }) => 
  <svg
    className={`${styling}`}
    onClick={handleClick}
    fill={fill}
    stroke={stroke}
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={strokeWidth} 
      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" 
    />
  </svg>

const MinusCircleSvg = (props) => 
  <svg 
    className="w-5 h-5" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" 
    />
  </svg>

const PlusSvg = ({ strokeWidth, ...props }) =>
  <svg 
    className={`w-5 h-5`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={strokeWidth} 
      d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
    />
  </svg>

const MinusSvg = ({ onClick, styling }) =>
  <svg 
    className={`w-6 h-6 ${styling}`}
    onClick={onClick}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M20 12H4"
    />
  </svg>

const XSvg = (props) =>
<svg 
  className={`w-6 h-6`}
  fill="none" 
  stroke="currentColor" 
  viewBox="0 0 24 24" 
  xmlns="http://www.w3.org/2000/svg"
  {...props}
>
  <path 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth={2} 
    d="M6 18L18 6M6 6l12 12" 
  />
</svg>

export { PlusCircleSvg, MinusCircleSvg, PlusSvg, MinusSvg, XSvg }