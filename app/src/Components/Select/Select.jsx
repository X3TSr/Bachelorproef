import React, { createRef, forwardRef } from 'react'
import style from './Select.module.css'

import * as modules from '../../general-js/scripts'

const Select = ({
    width = '100%',
    height = 'unset',
    type = 'primary',
    options = ['select an option', 'option 1', 'option 2'],
    classN,
    onclick = () => { },
    onchange = () => { },
    required = false,
}) => {

    return (
        <>
            <select
                style={{ width: `${width}`, height: `${height}` }}
                className={`${style.button} ${classN}`}
                onClick={onclick}
                required={required}
                onChange={(e) => onchange(e.target.value)}
            >
                {
                    options.map((option, index) => {
                        return <option key={index} value={option.toLowerCase()}>{modules.textCasingModule.toSentenceCase(option)}</option>
                    })
                }
            </select >
        </>
    );
};

export default Select;