

const Skeleton = ({classname=""}) => {
  return (
    <div className={`relative overflow-hidden bg-white/10 rounded ${classname}`}><div className="absolute inset-0 shimmer"/></div>
  )
}

export default Skeleton