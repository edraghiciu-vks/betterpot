import { Search } from '../components/Search/Search';
import { Crates } from '../components/Crates/Crates';

const SearchPage = () => {
  return (
    <div class="page-container h-full">
      <Search />
      <Crates />
    </div>
  );
}

export default SearchPage