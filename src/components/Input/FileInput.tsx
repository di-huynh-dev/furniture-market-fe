import { useState } from 'react'

type FileInputProps = {
  title: string
  subLabel?: string
  note?: string
}

const FileInput: React.FC<FileInputProps> = ({ title, subLabel, note }) => {
  const [files, setFiles] = useState<FileList | null>(null)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files)
  }
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text-alt font-bold">{title}</span>
        <span className="label-text-alt">{subLabel}</span>
      </div>
      <input
        type="file"
        className="file-input file-input-bordered w-full max-w-xs"
        multiple
        onChange={handleFileChange}
      />
      <div className="grid grid-cols-4 gap-x-20 ">
        {files &&
          Array.from(files).map((file, index) => (
            <div key={index} className="label">
              <p className="label-text-alt">
                {file.name}, {file.size} bytes
              </p>
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-[150px] h-[150px] object-contain ml-2"
              />
            </div>
          ))}
      </div>
      <div className="label">
        <span className="label-text-alt text-primary">{note}</span>
      </div>
    </label>
  )
}

export default FileInput
