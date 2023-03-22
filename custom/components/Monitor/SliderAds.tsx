
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
import { Autoplay, Pagination } from 'swiper';

import { imagenes } from '@prisma/client';

import { Box, Typography } from '@mui/material';

export function SliderAds({ banners }: { banners: imagenes[] }) {
    if (banners.length === 0) {
        return (
            <Box
                component='div'
                width='100%'
                height='100%'
                display='grid'
                style={{ placeContent: 'center', backgroundColor: '#fff' }}
            >
                <Typography variant='subtitle1' >Sin Publicidad</Typography>
            </Box>)
    };
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
