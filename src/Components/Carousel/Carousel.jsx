import React, { Children, useEffect, useRef, useState } from 'react'
import style from './Carousel.module.css'

const Carousel = ({ children }) => {

    const carouselRef = useRef();
    const carouselButtonLRef = useRef();
    const carouselButtonRRef = useRef();

    const [carouselPos, setCarouselPos] = useState(1);

    useEffect(() => {
        carouselButtonLRef.current.style.opacity = '1';
        carouselButtonLRef.current.style.pointerEvents = 'all';
        if (carouselPos <= 1) {
            carouselButtonLRef.current.style.opacity = '.2'
            carouselButtonLRef.current.style.pointerEvents = 'none';
        }

        carouselButtonRRef.current.style.opacity = '1';
        carouselButtonRRef.current.style.pointerEvents = 'all';
        if (carouselPos >= Children.count(children)) {
            carouselButtonRRef.current.style.opacity = '.2'
            carouselButtonRRef.current.style.pointerEvents = 'none';
        }
    }, [carouselPos])

    const handleLeft = (e) => {
        const carousel = e.target.nextElementSibling;
        carousel.scrollBy({
            left: -100
        })
        const currPos = carouselPos;
        if (currPos <= 1) return
        setCarouselPos(currPos - 1)
    }

    const handleRight = (e) => {
        const carousel = e.target.previousElementSibling;
        carousel.scrollBy({
            left: 100
        })
        const currPos = carouselPos;
        if (currPos >= Children.count(children)) return
        setCarouselPos(currPos + 1)
    }

    return (
        <>
            <div className={`${style.carouselButtonWrapper}`}>
                <span className={`${style.carouselButtonL}`} onClick={handleLeft} ref={carouselButtonLRef}>{`<`}</span>
                <div className={`${style.carouselContainer}`} ref={carouselRef}>
                    {children}
                </div>
                <span className={`${style.carouselButtonR}`} onClick={handleRight} ref={carouselButtonRRef}>{`>`}</span>
            </div>
        </>
    );
};

export default Carousel;