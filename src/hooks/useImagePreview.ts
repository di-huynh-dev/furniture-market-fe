import { useState, ChangeEvent } from 'react'

type ImagePreviewHook = {
  previewImage: string | undefined
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const useImagePreview = (): ImagePreviewHook => {
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setPreviewImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return { previewImage, handleFileChange }
}

export default useImagePreview
