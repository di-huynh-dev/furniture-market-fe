const LoadingButton = () => {
  return (
    <>
      <p>Đang xử lý</p>
      <span className="loading loading-sm loading-spinner text-primary"></span>
      <span className="loading loading-md loading-spinner text-secondary"></span>
      <span className="loading loading-lg loading-spinner text-accent"></span>
    </>
  )
}

export default LoadingButton
