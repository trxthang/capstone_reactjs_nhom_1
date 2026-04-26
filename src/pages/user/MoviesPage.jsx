import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import movieApi from '../../api/movieApi';
import MovieCard from '../../components/movie/MovieCard';
import Pagination from '../../components/common/Pagination';
import Loading from '../../components/common/Loading';
import { toArray } from '../../api/utils';

const PAGE_SIZE = 18;

export default function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get('page') || 1);
  const q = searchParams.get('q') || '';
  const [search, setSearch] = useState(q);

  // Lấy toàn bộ phim 1 lần, filter + phân trang client-side
  // (LayDanhSachPhimPhanTrang trả 500 không ổn định phía server)
  useEffect(() => {
    setLoading(true);
    movieApi.layDanhSachPhim()
      .then(res => setAllMovies(toArray(res)))
      .catch(() => setAllMovies([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!q) return allMovies;
    const lower = q.toLowerCase();
    return allMovies.filter(m =>
      m.tenPhim?.toLowerCase().includes(lower) ||
      m.moTa?.toLowerCase().includes(lower)
    );
  }, [allMovies, q]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: search, page: '1' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-white">
          Tất cả phim
          {!loading && <span className="text-gray-500 text-base font-normal ml-2">({filtered.length})</span>}
        </h1>
        <form onSubmit={handleSearch} className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm phim..."
            className="bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 w-64"
          />
        </form>
      </div>

      {q && (
        <p className="text-gray-400 mb-6 text-sm">
          Kết quả cho: <span className="text-white font-medium">"{q}"</span>
          <button onClick={() => { setSearch(''); setSearchParams({}); }} className="ml-2 text-gray-600 hover:text-gray-400 underline text-xs">Xoá</button>
        </p>
      )}

      {loading ? <Loading /> : (
        <>
          {paginated.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">Không tìm thấy phim nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {paginated.map(m => <MovieCard key={m.maPhim} movie={m} />)}
            </div>
          )}
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={p => setSearchParams({ q, page: String(p) })}
          />
        </>
      )}
    </div>
  );
}
