import { Search } from "lucide-react";

function SearchBar({
  search,
  setSearch,
  sort,
  setSort,
}) {
  return (
    <div className="w-full flex flex-col md:flex-row gap-4">

      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />

        <input
          type="text"
          placeholder="Search Crop..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full h-14 bg-white rounded-xl shadow-md pl-12 pr-4 border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) =>
          setSort(e.target.value)
        }
        className="w-full md:w-56 h-14 bg-white rounded-xl shadow-md px-4 border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="default">
          Default
        </option>

        <option value="high">
          Highest Price
        </option>

        <option value="low">
          Lowest Price
        </option>

        <option value="gain">
          Highest Growth
        </option>

        <option value="loss">
          Highest Loss
        </option>
      </select>

    </div>
  );
}

export default SearchBar;