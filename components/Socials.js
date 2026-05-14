// links
import Link from 'next/link';

// icons
import {
  RiTwitterLine,
  RiInstagramLine,
  RiFacebookLine,
  RiDiscordLine,
  RiTelegramLine,
  RiPinterestLine,
} from 'react-icons/ri';

const Socials = () => {
  return (
    <div className='flex items-center gap-x-5 text-lg'>
      <Link href={'https://example.com'} className='hover:text-accent transition-all duration-300'>
        <RiTwitterLine />
      </Link>
      <Link href={''} className='hover:text-accent transition-all duration-300'>
        <RiFacebookLine />
      </Link>
      <Link href={'https://example.com'} className='hover:text-accent transition-all duration-300'>
        <RiInstagramLine />
      </Link>
      <Link href={''} className='hover:text-accent transition-all duration-300'>
        <RiDiscordLine />
      </Link>
      <Link href={''} className='hover:text-accent transition-all duration-300'>
        <RiTelegramLine />
      </Link>
      <Link href={''} className='hover:text-accent transition-all duration-300'>
        <RiPinterestLine />
      </Link>
    </div>
  );
};

export default Socials;
