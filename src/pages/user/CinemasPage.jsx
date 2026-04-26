import { useState, useEffect } from 'react';
import { Building2, MapPin, ChevronDown, ChevronRight } from 'lucide-react';
import cinemaApi from '../../api/cinemaApi';
import Loading from '../../components/common/Loading';
import { toArray } from '../../api/utils';

function CinemaChainCard({ chain }) {
  const [open, setOpen] = useState(false);
  const complexes = chain.cumRapVMs || [];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 hover:bg-gray-800/50 transition-colors"
      >
        <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
          {chain.logo ? (
            <img src={chain.logo} alt={chain.tenHeThongRap} className="w-full h-full object-contain p-1"
              onError={e => { e.target.style.display = 'none'; }} />
          ) : (
            <Building2 size={24} className="text-gray-600" />
          )}
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-bold text-white text-lg">{chain.tenHeThongRap}</h3>
          <p className="text-gray-400 text-sm mt-0.5">{complexes.length} cụm rạp</p>
        </div>
        <ChevronDown size={18} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && complexes.length > 0 && (
        <div className="border-t border-gray-800 divide-y divide-gray-800/50">
          {complexes.map(c => (
            <div key={c.maCumRap} className="flex items-start gap-4 p-4 hover:bg-gray-800/30 transition-colors">
              <div className="w-12 h-12 bg-gray-800 rounded-xl overflow-hidden shrink-0">
                {c.hinhAnh ? (
                  <img src={c.hinhAnh} alt={c.tenCumRap} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 size={20} className="text-gray-600" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-white">{c.tenCumRap}</p>
                {c.diaChi && (
                  <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                    <MapPin size={10} className="text-red-400" />{c.diaChi}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {open && complexes.length === 0 && (
        <div className="border-t border-gray-800 p-4 text-center text-gray-500 text-sm">
          Không có thông tin cụm rạp
        </div>
      )}
    </div>
  );
}

export default function CinemasPage() {
  const [chains, setChains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cinemaApi.layThongTinHeThongRap()
      .then(res => setChains(toArray(res)))
      .catch(() => setChains([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Building2 size={24} className="text-red-500" />
        <h1 className="text-2xl font-bold text-white">Hệ thống rạp chiếu</h1>
        {!loading && <span className="text-gray-500 text-sm">({chains.length} hệ thống)</span>}
      </div>

      {loading ? <Loading /> : chains.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Không có dữ liệu rạp chiếu</div>
      ) : (
        <div className="space-y-4">
          {chains.map(chain => (
            <CinemaChainCard key={chain.maHeThongRap} chain={chain} />
          ))}
        </div>
      )}
    </div>
  );
}
