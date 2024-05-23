import React from 'react'

type FormInputProps = {
  type: string
  label: string
  prop: string
  placeholder?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any
  errorMessage?: string | undefined
}

const FormInput: React.FC<FormInputProps> = ({ type, label, placeholder, errorMessage, prop, register }) => {
  return (
    <div className="form-control">
      <label htmlFor={label} className="label">
        <span className="label-text capitalize text-sm">{label}</span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={`input input-bordered text-sm input-base`}
        {...register(prop)}
      />
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </div>
  )
}

export default FormInput
