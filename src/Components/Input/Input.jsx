import { Link } from 'react-router-dom'
import * as modules from '../../general-js/scripts'
import style from './Input.module.css'

function InputText({
  htmlFor = '',
  type = 'text',
  content = '',
  editable = false,
  ref,
  min = 0,
  max = 0,
  step = 1,
  onKeyDown = () => { },
  onchange = () => { },
  editOnClick = () => { },
}) {
  return (
    <div className={`${style.parent}`}>
      <div className={`${style.container}`}>
        <label htmlFor={htmlFor} className={`${style.label}`}>{modules.textCasingModule.toTitleCase(htmlFor)}</label >
        <input
          type={type}
          name={htmlFor}
          id={htmlFor}
          className={`${style.input}`}
          onKeyDown={onKeyDown}
          onChange={(e) => onchange(e.target.value)}
          value={content}
          ref={ref}
          min={min}
          max={max}
          step={step}
        />
      </div>
      <span className={`material-symbols-outlined ${style.edit} ${editable ? '' : style.hidden}`} onClick={editOnClick}>edit</span>
    </div>
  )
}

export default InputText
