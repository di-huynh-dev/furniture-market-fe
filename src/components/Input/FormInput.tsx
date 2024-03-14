import React, { ChangeEvent, InputHTMLAttributes } from 'react'

type FormInputProps = {
  name: string
  label: string
  type: string
  defaultValue?: string
  size?: string
  placeholder?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  value?: string
} & InputHTMLAttributes<HTMLInputElement>

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type,
  defaultValue,
  size = 'input-base',
  placeholder,
  onChange,
  value,
  ...rest
}) => {
  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        <span className="label-text capitalize text-sm">{label}</span>
      </label>
      <input
        value={value}
        type={type}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={`input input-bordered ${size} text-sm`}
        onChange={onChange}
        {...rest}
      />
    </div>
  )
}

export default FormInput
