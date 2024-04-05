'use client';
import { SwiperSlide, Swiper } from 'swiper/react';



import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

import './slideshow.css';
import { Autoplay, FreeMode, Navigation, Pagination, Thumbs } from 'swiper/modules';
import Image from 'next/image';

interface Props {
    images: string[];
    title: string;
    className?: string;
}

export const ProductMobileSlideShow = ({images, title, className}: Props) => {
  return (
    <div className={className}>
        <Swiper
        style={{
          width: '100vw',
          height: '500px'
        }}
        pagination
        autoplay={{
            delay: 3500,
        }}
        modules={[FreeMode, Thumbs, Autoplay,Pagination]}
        className="mySwiper2"
        >
        {
            images.map(image=> (
                <SwiperSlide key={image}>
                    <Image 
                        src={`/products/${image}`} 
                        alt={title} 
                        width={600} 
                        height={500}
                        className="rounded-lg object-fill"
                    />
                </SwiperSlide>
            ))
        }
      </Swiper>
    </div>
  )
}
