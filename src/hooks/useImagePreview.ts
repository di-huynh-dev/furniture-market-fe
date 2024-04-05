import { useState, ChangeEvent } from 'react'

type ImagePreviewHook = {
  previewImages: string[] | undefined
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const useImagePreview = (): ImagePreviewHook => {
  const [previewImages, setPreviewImages] = useState<string[] | undefined>(undefined)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      const imagesDataUrls: string[] = []

      files.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            imagesDataUrls.push(event.target.result as string)
            if (imagesDataUrls.length === files.length) {
              setPreviewImages(imagesDataUrls)
            }
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  return { previewImages, handleFileChange }
}

export default useImagePreview
