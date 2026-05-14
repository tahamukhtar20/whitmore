// import swiper react components
import { Swiper, SwiperSlide } from 'swiper/react';

// import swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

// icons
import {
  RxGear,
  RxPerson,
  RxRocket,
  RxArrowTopRight,
} from 'react-icons/rx';
import {
  FaNetworkWired,
  FaBrain,
} from 'react-icons/fa';

// import required modules
import { FreeMode, Pagination } from 'swiper';

// service data
export const serviceData = [
  {
    icon: <RxGear />,
    title: 'Tech',
    description: 'We integrate AI-driven insights and data analytics. Empowering us to navigate markets with unprecedented precision and success.',
  },
  {
    icon: <FaNetworkWired />,
    title: 'Network',
    description: 'Our network benefits our customers, partners and team by providing access to greater opportunities.',
  },
  {
    icon: <RxPerson />,
    title: 'People',
    description: 'Customers are at the center of everything we do.',
  },
  {
    icon: <FaBrain />,
    title: 'Analytics',
    description: 'We observe and anticipate, account for changing expectations and offer technology-enabled, value-creating experiences.',
  },
  {
    icon: <RxRocket />,
    title: 'Team Work',
    description: 'Seamless teamwork is the driving force behind our success to adaptation to market trends.',
  },
];

const ServiceSlider = () => {
  return (
    <Swiper
      breakpoints={{
        320: {
          slidesPerView: 1,
          spaceBetween: 15,
        },

        640: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
      }}
      freeMode={true}
      pagination={{
        clickable: true,
      }}
      modules={[FreeMode, Pagination]}
      className='h-[240px] sm:h-[340px]'
    >
      {serviceData.map((item, index) => {
        return (
          <SwiperSlide key={index}>
            <div className='bg-[rgba(65,47,123,0.15)] h-max rounded-lg px-6 py-8 flex sm:flex-col gap-x-6 sm:gap-x-0 group cursor-pointer hover:bg-[rgba(89,65,169,0.15)] transition-all duration-300'>
              {/* icon */}
              <div className='text-4xl text-accent mb-4'>{item.icon}</div>
              {/* title & desc */}
              <div className='mb-8'>
                <div className='mb-2 text-lg'>{item.title}</div>
                <p className='max-w-[350px] leading-normal'>
                  {item.description}
                </p>
              </div>
              {/* arrow */}
              <div className='text-3xl'>
                <RxArrowTopRight className='group-hover:rotate-45 group-hover:text-accent transition-all duration-300' />
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default ServiceSlider;
