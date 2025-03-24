import { fetchCars } from "@/utils";
import { HomeProps } from "@/types";
import { fuels, yearsOfProduction } from "@/constants";
import { CarCard, ShowMore, SearchBar, CustomFilter, Hero } from "@/components";

export default async function Home({ searchParams }: HomeProps) {
  // Properly handle searchParams by awaiting and type casting
  const params = await Promise.resolve({
    manufacturer: String(searchParams?.manufacturer || ""),
    year: Number(searchParams?.year || 2022),
    fuel: String(searchParams?.fuel || ""),
    model: String(searchParams?.model || ""),
  });

  const allCars = await fetchCars(params);

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;

  return (
    <main className='overflow-hidden'>
      <Hero />

      <div className='mt-12 padding-x padding-y max-width' id='discover'>
        <div className='home__text-container'>
          <h1 className='text-4xl font-extrabold'>Car Catalogue</h1>
          <p>Explore out cars you might like</p>
        </div>

        <div className='home__filters'>
          <SearchBar />

          <div className='home__filter-container'>
            <CustomFilter title='fuel' options={fuels} />
            <CustomFilter title='year' options={yearsOfProduction} />
          </div>
        </div>

        {!isDataEmpty ? (
          <section>
            <div className='home__cars-wrapper'>
              {allCars?.map((car, index) => (
                <CarCard key={index} car={car} />
              ))}
            </div>

            <ShowMore
              pageNumber={1}
              isNext={false}
            />
          </section>
        ) : (
          <div className='home__error-container'>
            <h2 className='text-black text-xl font-bold'>Oops, no results</h2>
            <p>{allCars?.message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
