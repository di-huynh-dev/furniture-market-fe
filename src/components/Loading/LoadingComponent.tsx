const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center">
      <div>
        <span className="loading loading-ring loading-xs"></span>
        <span className="loading loading-ring loading-sm"></span>
        <span className="loading loading-ring loading-md"></span>
        <span className="loading loading-ring loading-lg"></span>
      </div>
      <p>Đang lấy dữ liệu</p>
    </div>
  )
}

export default LoadingComponent
