// work slider data

export const workSlider = {
    slides: [
        {
            images: [
                {
                    title: 'title',
                    path: '/Ardent.png',
                    link: "https://example.com"
                },
                {
                    title: 'Quarry',
                    path: '/Quarry.png',
                    link: "/underConstruction"
                },
                {
                    title: 'title',
                    path: '/Brightline.png',
                    // link: "https://www.google.com"
                },
                {
                    title: 'title',
                    path: '/Code1.png',
                    // link: "https://www.google.com"
                },
            ],
        },
    ],
};

// import swiper react components
import {Swiper, SwiperSlide} from 'swiper/react';

// import swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

// import required modules
import {Pagination} from 'swiper';
// next image
import Image from 'next/image';

import {motion} from "framer-motion"
import {useState} from "react";


const WorkSlider = () => {
    const [clicked, setClicked] = useState(false);
    const bounceVariants = {
        initial: {scale: 1},
        animate: {
            scale: [1, 0.88, 10],
            transition: {
                duration: 0.8,
                ease: [0.6, -0.05, 0.01, 0.99],
            },
        },
    };

    const transitionVariants = {
        initial: {
            x: '0%',
            width: '0%',
        },
        animate: {
            x: '100%',
            width: '100%'
        },
        exit: {
            x: ['0', '100%'],
            width: ['0%', '100%'],
        },
    }
    const handleItemClick = (link) => {
        setClicked(true);
        setTimeout(() => {
            window.open(link, '_blank');
        }, 1800)
        setTimeout(() => {
            setClicked(false);
        }, 2000)
    };

    return (
        <>
            {clicked &&
                <motion.div
                    className='fixed top-0 bottom-0 right-full w-screen h-screen z-30 bg-[#005555]'
                    variants={transitionVariants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    transition={{delay: 0.2, duration: 0.6, ease: 'easeInOut'}}
                ></motion.div>}
            <Swiper
                spaceBetween={10}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
                className='h-[280px] sm:h-[480px]'
            >
                {workSlider.slides.map((slide, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <div className='grid grid-cols-2 grid-rows-2 gap-4 cursor-pointer'>
                                {slide.images.map((image, index) => {
                                    return (
                                        <div key={index} className="w-full h-full flex justify-center">
                                            <motion.div
                                                className='relative rounded-lg overflow-hidden flex items-center justify-center group z-50'
                                                variants={bounceVariants}
                                                initial='initial'
                                                whileTap='animate'
                                                onClick={() => handleItemClick(image.link)}
                                            >
                                                <div
                                                    className='flex items-center justify-center relative overflow-hidden group rounded-md'>
                                                    {/* image */}
                                                    <Image src={image.path} width={500} height={300} alt=''/>
                                                </div>
                                            </motion.div>
                                        </div>
                                    );
                                })}
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </>
    );
};

export default WorkSlider;
