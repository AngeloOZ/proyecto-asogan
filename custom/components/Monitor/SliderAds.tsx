import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper';

export function SliderAds() {
    const progressCircle = useRef(null);
    const progressContent = useRef(null);

    return (
        <>
            <Swiper
                direction='vertical'
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                loop
                modules={[Autoplay, Pagination]}
                className="mySwiper"
            >
                <SwiperSlide>
                    <img 
                        src="https://agroscopio.com/wp-content/uploads/2020/11/ASOGANSD.png"
                        style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <img 
                        src="https://elproductor.com/wp-content/uploads/2019/04/ganado.jpg"
                        style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <img 
                        src="https://aprobal.com/wp-content/uploads/2020/06/Junio_-11-768x768.jpg"
                        style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                </SwiperSlide>
            </Swiper>
        </>
    );
}
