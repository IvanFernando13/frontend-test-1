"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Banner from "@/components/Banner";

export default function IdeasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [size, setSize] = useState(Number(searchParams.get("size")) || 10);
  const [sort, setSort] = useState(searchParams.get("sort") || "-published_at");
  
  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("size", size.toString());
    params.set("sort", sort);
    router.replace(`?${params.toString()}`, { scroll: false });
    
    fetchData(page, size, sort);
  }, [page, size, sort]);

  const fetchData = async (p: number, s: number, order: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/ideas?page[number]=${p}&page[size]=${s}&append[]=small_image&append[]=medium_image&sort=${order}`
      );
      const json = await res.json();
      
      if (json && json.data) {
        setData(json.data);
        setMeta(json.meta);
      } else {
        setData([]);
      }
    } catch (error) {
      setData([]);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <main className="min-h-screen bg-white pb-20">
      <Header />
      <Banner />

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 mt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 text-[#4a4a4a]">
          <p className="text-sm font-medium mb-4 sm:mb-0">
            Showing {meta ? `${meta.from} - ${meta.to} of ${meta.total}` : "0 - 0 of 0"}
          </p>
          <div className="flex flex-wrap items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center space-x-3">
              <label className="text-sm">Show per page:</label>
              <div className="relative">
                <select
                  className="appearance-none border border-gray-300 rounded-full pl-4 pr-10 py-1.5 text-sm bg-white focus:outline-none min-w-[80px]"
                  value={size}
                  onChange={(e) => {
                    setSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <label className="text-sm">Sort by:</label>
              <div className="relative">
                <select
                  className="appearance-none border border-gray-300 rounded-full pl-4 pr-10 py-1.5 text-sm bg-white focus:outline-none min-w-[120px]"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="-published_at">Newest</option>
                  <option value="published_at">Oldest</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
             <div className="col-span-full py-20 text-center text-gray-400 text-sm">Loading ideas...</div>
          ) : data.length === 0 ? (
             <div className="col-span-full py-20 text-center text-gray-400 text-sm">No ideas found.</div>
          ) : (
            data?.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] transition-shadow duration-300">
                <div className="relative aspect-[4/3] w-full bg-gray-100">
                  <img
                    src={item.medium_image?.[0]?.url || 'https://via.placeholder.com/400x300'}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <p className="text-[11px] font-semibold text-gray-400 tracking-wide mb-2 uppercase">
                    {formatDate(item.published_at)}
                  </p>
                  <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-3">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))
          )}
        </div>

        {meta && meta.last_page > 1 && (
          <div className="flex justify-center items-center mt-16 space-x-1 text-sm font-medium text-gray-600">
            <button
               disabled={page === 1}
               onClick={() => setPage(1)}
               className="p-2 hover:text-[#ff6600] disabled:opacity-30 transition-colors"
            >
              &laquo;
            </button>
            <button
               disabled={page === 1}
               onClick={() => setPage(page - 1)}
               className="p-2 hover:text-[#ff6600] disabled:opacity-30 transition-colors mr-2"
            >
              &lsaquo;
            </button>
            
            {[...Array(meta.last_page)].map((_, i) => {
              const pageNum = i + 1;
              if (pageNum < page - 2 || pageNum > page + 2) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${
                    page === pageNum 
                      ? 'bg-[#ff6600] text-white font-bold shadow-sm shadow-[#ff6600]/30' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
               disabled={page === meta.last_page}
               onClick={() => setPage(page + 1)}
               className="p-2 hover:text-[#ff6600] disabled:opacity-30 transition-colors ml-2"
            >
              &rsaquo;
            </button>
            <button
               disabled={page === meta.last_page}
               onClick={() => setPage(meta.last_page)}
               className="p-2 hover:text-[#ff6600] disabled:opacity-30 transition-colors"
            >
              &raquo;
            </button>
          </div>
        )}
      </div>
    </main>
  );
}