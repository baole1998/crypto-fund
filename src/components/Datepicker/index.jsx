import { TextValidator } from "react-material-ui-form-validator"
export default function Datepicker({
  type,
  label,
  sx,
  validators,
  errorMessages,
  value,
  onChange,
  name,
  placeholder,
  defaultValue,
}) {
  return (
    <TextValidator
      sx={sx}
      name={name}
      variant="filled"
      size="small"
      label={label}
      type="date"
      validators={validators}
      errorMessages={errorMessages}
      onChange={onChange}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
    />
  )
}
