const LoadingButton = () => {
  return (
    <>
      <p>Đang xử lý</p>
      <span className="loading loading-sm loading-spinner text-warning"></span>
      <span className="loading loading-md loading-spinner text-success"></span>
      <span className="loading loading-lg loading-spinner text-white"></span>
    </>
  )
}

export default LoadingButton
