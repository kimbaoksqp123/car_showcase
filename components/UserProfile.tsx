import { Fragment } from 'react'
import { Menu,MenuButton, MenuItems, Transition, MenuItem } from '@headlessui/react'
import Image from 'next/image'

interface UserProfileProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="inline-flex w-full justify-center items-center">
        <Image
          src="/avt.jpg"
          alt="User Avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-500">
              {user.email}
            </p>
          </div>
          <div className="py-1">
            <MenuItem>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } group flex w-full items-center px-4 py-2 text-sm`}
                  onClick={() => {
                    // Logout logic will be implemented later
                    console.log('Logout clicked');
                  }}
                >
                  Logout
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
} 