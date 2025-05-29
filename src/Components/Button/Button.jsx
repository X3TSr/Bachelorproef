import { forwardRef } from 'react';
import style from './Button.module.css'

import * as modules from '../../general-js/scripts'

const Button = forwardRef(({ type = 'primary', text = 'Button', classN, onclick = () => { } }, ref) => {

    return (
        <>
            <button className={`${style.button} ${classN} ${style[`btnType${modules.textCasingModule.toSentenceCase(type)}`]}`} onClick={onclick} ref={ref}>{text}</button >
        </>
    )
})

export default Button
