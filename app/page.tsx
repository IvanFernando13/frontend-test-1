"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Banner from "@/components/Banner";

export default function IdeasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State inisial diambil dari URL atau default
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [size, setSize] = useState(Number(searchParams.get("size")) || 10);
  const [sort, setSort] = useState(searchParams.get("sort") || "-published_at");
  
  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Update URL parameters saat state berubah
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
      setData(json.data);
      setMeta(json.meta);
    } catch (error) {
      console.error("Failed to fetch ideas", error);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <Banner />

      <div className="container mx-auto px-6 mt-10">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <p className="text-sm text-gray-600 mb-4 md:mb-0">
            Showing {meta ? `${meta.from} - ${meta.to} of ${meta.total}` : "..."}
          </p>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Show per page:</label>
              <select
                className="border rounded px-3 py-1 text-sm bg-white"
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(1); // Reset page saat merubah size
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                className="border rounded px-3 py-1 text-sm bg-white"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="-published_at">Newest</option>
                <option value="published_at">Oldest</option>
              </select>
            </div>
          </div>
        </div>

        {/* List Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
             <p className="col-span-full text-center">Loading...</p>
          ) : (
            data.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div className="relative aspect-[4/3] w-full bg-gray-200">
                  {/* Lazy loading diaktifkan */}
                  <img
                    src={item.medium_image?.[0]?.url || 'https://via.placeholder.com/300'}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <p className="text-xs text-gray-400 mb-2 uppercase">{formatDate(item.published_at)}</p>
                  {/* Title clamp maksimal 3 baris */}
                  <h3 className="text-md font-semibold text-gray-800 line-clamp-3">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {meta && (
          <div className="flex justify-center mt-12 space-x-2">
            <button
               disabled={page === 1}
               onClick={() => setPage(page - 1)}
               className="p-2 disabled:opacity-50"
            >
              &laquo;
            </button>
            {/* Simple pagination display for demo */}
            {[...Array(meta.last_page)].map((_, i) => {
              const pageNum = i + 1;
              // Membatasi tombol yang tampil agar tidak terlalu panjang
              if (pageNum < page - 2 || pageNum > page + 2) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 rounded ${page === pageNum ? 'bg-[#ff6600] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
               disabled={page === meta.last_page}
               onClick={() => setPage(page + 1)}
               className="p-2 disabled:opacity-50"
            >
              &raquo;
            </button>
          </div>
        )}
      </div>
    </main>
  );
}