const Cross = ({ ...props }) => {
  return (
    <svg
      viewBox="0 0 28 28"
      width="28"
      height="28"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      shapeRendering="geometricPrecision"
      {...props}
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  )
}

export default Cross
