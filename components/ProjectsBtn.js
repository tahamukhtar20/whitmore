// next image
import Image from 'next/image';

// next link
import Link from 'next/link';

// icons
import { HiBookOpen } from 'react-icons/hi2';

const ProjectsBtn = () => {
  return (
    <div className='mx-auto xl:mx-0 z-10'>
      <Link
        href={'https://example.com'}
        className='relative w-[185px] h-[185px] flex justify-center items-center bg-circleStar bg-cover bg-center bg-no-repeat group'
      >
        <Image
          src={'/round.png'}
          width={145}
          height={153}
          alt=''
          className='animate-spin-slow w-full h-full max-w-[160px] max-h-[170px]'
        />
        <HiBookOpen className='absolute text-5xl group-hover:translate-x-2 transition-all duration-300' />
      </Link>
    </div>
  );
};

export default ProjectsBtn;
