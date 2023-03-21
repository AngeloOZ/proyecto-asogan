import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper';

import { imagenes } from '@prisma/client';

export function SliderAds({ banners }: { banners: imagenes[] }) {

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
                {
                    banners.map((banner, index) => (
                        <SwiperSlide key={banner.id_imagen}>
                            <img
                                src={banner.ruta}
                                alt={banner.ruta}
                                style={{ objectFit: "fill", objectPosition: "center" }}
                            />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </>
    );
}
