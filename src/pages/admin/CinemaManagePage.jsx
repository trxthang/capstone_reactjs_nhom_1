import { useState, useEffect } from 'react';
import { Building2, ChevronDown, MapPin } from 'lucide-react';
import cinemaApi from '../../api/cinemaApi';
import Loading from '../../components/common/Loading';
import { toArray } from '../../api/utils';

// Trang này chỉ xem – API không cho phép tạo/xóa hệ thống rạp
function ComplexCard({ complex }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-xl">
      {complex.hinhAnh ? (
        <img src={complex.hinhAnh} alt={complex.tenCumRap} className="w-12 h-12 object-cover rounded-lg shrink-0" />
      ) : (
        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center shrink-0">
          <Building2 size={18} className="text-gray-500" />
        </div>
      )}
      <div>
        <p className="font-semibold text-white text-sm">{complex.tenCumRap}</p>
        {complex.diaChi && (
          <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
            <MapPin size={9} className="text-red-400" />{complex.diaChi}
          </p>
        )}
      </div>
    </div>
  );
}

function ChainRow({ chain }) {
  const [open, setOpen] = useState(false);
  const [complexes, setComplexes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setOpen(!open);
    if (!open && complexes.length === 0) {
      setLoading(true);
      cinemaApi.layThongTinCumRapTheoHeThong(chain.maHeThongRap)
        .then(res => setComplexes(toArray(res)))
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <button onClick={handleToggle} className="w-full flex items-center gap-4 p-5 hover:bg-gray-800/40 transition-colors">
        <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
          {chain.logo ? (
            <img src={chain.logo} alt={chain.tenHeThongRap} className="w-full h-full object-contain p-1"
              onError={e => { e.target.style.display = 'none'; }} />
          ) : (
            <Building2 size={22} className="text-gray-600" />
          )}
        </div>
        <div className="flex-1 text-left">
          <p className="font-bold text-white">{chain.tenHeThongRap}</p>
          <p className="text-gray-500 text-sm mt-0.5">Mã: {chain.maHeThongRap}</p>
        </div>
        <ChevronDown size={18} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="border-t border-gray-800 p-5">
          {loading ? (
            <Loading />
          ) : complexes.length === 0 ? (
            <p className="text-gray-500 text-sm">Không có cụm rạp</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {complexes.map(c => <ComplexCard key={c.maCumRap} complex={c} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CinemaManagePage() {
  const [chains, setChains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cinemaApi.layThongTinHeThongRap()
      .then(res => setChains(toArray(res)))
      .catch(() => setChains([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Hệ thống rạp chiếu</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {loading ? '…' : `${chains.length} hệ thống rạp`} · Nhấn để xem cụm rạp
        </p>
      </div>

      {loading ? <Loading /> : chains.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Không có dữ liệu</div>
      ) : (
        <div className="space-y-4">
          {chains.map(c => <ChainRow key={c.maHeThongRap} chain={c} />)}
        </div>
      )}
    </div>
  );
}
