"use client";
import Link from 'next/link'
import Image from 'next/image'
import CustomButton from './CustomButton'
import UserProfile from './UserProfile'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Kiểm tra xem có token và user info trong localStorage không
    const accessToken = localStorage.getItem('accessToken');
    const userInfo = localStorage.getItem('userInfo');
    
    if (accessToken && userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  return (
    <header className='w-full absolute z-10'>
      <nav className='max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4'>
        <Link href="/" className='flex justify-center items-center'>
          <Image src="/logo.svg" alt="Car Hub Logo" width={118} height={18} className='object-contain' />
        </Link>

        <div className='flex-1 flex justify-center items-center'>
          <CustomButton
            title="Register Vehicle"
            btnType="button"
            containerStyles="text-primary-blue rounded-full bg-white min-w-[130px] mr-2"
            handleClick={() => router.push('/vehicle-registration')}
          />

          {user ? (
            <UserProfile user={user} />
          ) : (
            <>
              <CustomButton
                title="Sign In"
                btnType="button"
                containerStyles="text-primary-blue rounded-full bg-white min-w-[130px] mr-2"
                handleClick={() => router.push('/signin')}
              />

              <CustomButton
                title="Sign Up"
                btnType="button"
                containerStyles="text-primary-blue rounded-full bg-white min-w-[130px]"
                handleClick={() => router.push('/signup')}
              />
            </>
          )}
        </div>

      </nav>

    </header>
  )
}

export default Navbar