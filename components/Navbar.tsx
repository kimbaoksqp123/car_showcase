"use client";
import Link from 'next/link'
import Image from 'next/image'
import CustomButton from './CustomButton'
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  return (
    <header className='w-full absolute z-10'>
      <nav className='max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4'>
        <Link href="/" className='flex justify-center items-center'>
          <Image src="/logo.svg" alt="Car Hub Logo" width={118} height={18} className='object-contain' />
        </Link>

        <div className='flex-1 flex justify-center items-center'>
          <CustomButton
            title="Sign In"
            btnType="button"
            containerStyles="text-primary-blue rounded-full bg-white min-w-[130px]"
            handleClick={() => router.push('/signin')}
          />

          <CustomButton
            title="Sign Up"
            btnType="button"
            containerStyles="text-primary-blue rounded-full bg-white min-w-[130px]"
            handleClick={() => router.push('/signup')}
          />
        </div>

      </nav>

    </header>
  )
}

export default Navbar