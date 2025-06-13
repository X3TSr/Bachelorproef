import React from 'react'
import style from './Overlay.module.css'

const Overlay = ({
    overlayHandler = () => { },
    children
}) => {
    return (
        <section className={`${style.sectionOverlay}`}>
            <span className={`${style.closeBtn}`} onClick={() => { overlayHandler(false) }}>&#10006;</span>
            <div className={`${style.content}`}>
                {children}
            </div>
        </section>
    );
};

export default Overlay;