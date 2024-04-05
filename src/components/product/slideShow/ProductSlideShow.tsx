'use client';
import React, { useState } from 'react';
import { SwiperSlide, Swiper } from 'swiper/react';
import { Swiper as SwiperObject } from 'swiper';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

import './slideshow.css';
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';
import Image from 'next/image';
import { ProductImage } from '../product-image/ProductImage';

interface Props {
    images: string[];
    title: string;
    className?: string;
}

export const ProductSlideShow = ({images, title, className}: Props) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();
  return (
    <div className={className}>
        <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        } as React.CSSProperties}
        spaceBetween={10}
        navigation={true}
        autoplay={{
            delay: 5500,
        }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2"
        >
        {
            images.map(image=> (
                <SwiperSlide key={image}>
                    <ProductImage 
                        src={image} 
                        alt={title} 
                        width={1024} 
                        height={800}
                        className="rounded-lg object-fill"
                    />
                </SwiperSlide>
            ))
        }
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {
            images.map(image=> (
                <SwiperSlide key={image}>
                    <ProductImage 
                        src={image} 
                        alt={title} 
                        width={300} 
                        height={300}
                        className='object-fill'
                    />
                </SwiperSlide>
            ))
        }
      </Swiper>
    </div>
  )
}
