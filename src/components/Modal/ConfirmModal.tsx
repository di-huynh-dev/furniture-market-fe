import React from 'react'

type ConfirmModalProps = {
  onClick: () => void
  content: string
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ onClick, content }) => {
  return (
    <dialog id="confirm_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Xác nhận</h3>
        <p className="py-4">{content}</p>
        <div className="modal-action">
          <form method="dialog" className="flex gap-2">
            <button className="btn btn-primary text-white" onClick={onClick}>
              Xác nhận
            </button>
            <button className="btn">Đóng</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default ConfirmModal
