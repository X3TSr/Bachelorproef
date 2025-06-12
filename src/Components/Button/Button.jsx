import { Children, forwardRef } from 'react';
import style from './Button.module.css'

import * as modules from '../../general-js/scripts'

const Button = forwardRef(({
    width = '100%',
    height = 'unset',
    type = 'primary',
    text = 'Button',
    classN,
    onclick = () => { },
    fontSize = 'p',
}, ref
) => {

    const checkFontSize = () => {
        switch (fontSize) {
            case 'h1':
                return <h1>{text}</h1>
            case 'h2':
                return <h2>{text}</h2>
            case 'h3':
                return <h3>{text}</h3>
            case 'h4':
                return <h4>{text}</h4>
            case 'p':
                return <p>{text}</p>

            default:
                break;
        }
    }

    return (
        <>
            <button
                style={{ width: `${width}`, height: `${height}` }}
                className={`${style.button} ${classN} ${style[`btnType${modules.textCasingModule.toSentenceCase(type)}`]}`}
                onClick={onclick}
                ref={ref}
            >
                {
                    checkFontSize()
                }
            </button >
        </>
    )
})

export default Button
