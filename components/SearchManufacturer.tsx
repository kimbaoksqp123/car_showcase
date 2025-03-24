"use client";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from '@headlessui/react';
import { SearchManuFacturerProps } from '@/types';
import { manufacturers } from '@/constants';
import Image from 'next/image';
import { useState, Fragment } from 'react';

export const SearchManufacturer = ({ manufacturer, setManuFacturer }: SearchManuFacturerProps) => {
  const [query, setQuery] = useState('')
  const filteredManufacturers =
    query === ""
      ? manufacturers
      : manufacturers.filter((item) =>
        item
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.toLowerCase().replace(/\s+/g, ""))
      );
  return (
    <div className="search-manufacturer">
      <Combobox value={manufacturer} onChange={setManuFacturer}>
        <div className="relative w-full">
          <ComboboxButton className="absolute top-[14px]">
            <Image src="/car-logo.svg" width={20} height={20} className="ml-4" alt="car logo" />
          </ComboboxButton>
          <ComboboxInput
            className="search-manufacturer__input"
            placeholder="Volkswagen"
            displayValue={(manufacturer: string) => manufacturer}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <ComboboxOptions
              className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              static
            >
              {filteredManufacturers.length === 0 && query !== "" ? (
                <ComboboxOption value={query} className="search-manufacturer__option">
                  Create "{query}"
                </ComboboxOption>
              ) : (
                filteredManufacturers.map((item) => (
                  <ComboboxOption
                    key={item}
                    value={item}
                    className="relative search-manufacturer__option data-[focus]:bg-primary-blue data-[focus]:text-white text-gray-900"
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                          {item}
                        </span>

                        {/* Hiển thị dấu ✔ nếu option được chọn */}
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-purple data-[focus]:text-white">
                            ✔
                          </span>
                        )}
                      </>
                    )}
                  </ComboboxOption>
                ))
              )}
            </ComboboxOptions>

          </Transition>
        </div>
      </Combobox>
    </div>
  )
}