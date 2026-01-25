import { useEffect, useState } from "react";
import { fetchSeniorsAPI } from "../../api/admin.api";
import { useNavigate } from "react-router-dom";

export default function SeniorsList() {
  const [seniors, setSeniors] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const loadSeniors = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await fetchSeniorsAPI({
        search,
        minAge: minAge ? Number(minAge) : undefined,
        maxAge: maxAge ? Number(maxAge) : undefined,
        page: pageNumber,
        limit: 10,
      });

      setSeniors(res.seniors);
      setPagination(res.pagination);
      setPage(pageNumber);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeniors(1);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Seniors</h1>

      {/* Filters */}
      <div className="flex gap-3">
        <input
          placeholder="Search name..."
          className="border px-3 py-2 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min age"
          className="border px-3 py-2 rounded-md w-24"
          value={minAge}
          onChange={(e) => setMinAge(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max age"
          className="border px-3 py-2 rounded-md w-24"
          value={maxAge}
          onChange={(e) => setMaxAge(e.target.value)}
        />
        <button
          onClick={() => loadSeniors(1)}
          className="bg-slate-900 text-white px-4 rounded-md"
        >
          Apply
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading seniors...</p>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Age</th>
                  <th className="p-3 text-left">Address</th>
                  <th className="p-3 text-left">Emergency</th>
                </tr>
              </thead>
              <tbody>
                {seniors.map((senior) => (
                  <tr
                    key={senior._id}
                    onClick={() => navigate(`/admin/seniors/${senior._id}`)}
                    className="border-t hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="p-3 font-medium">
                      {senior.firstName} {senior.lastName}
                    </td>
                    <td className="p-3">{senior.age ?? "—"}</td>
                    <td className="p-3">{senior.address ?? "—"}</td>
                    <td className="p-3">{senior.emergencyContact ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="flex justify-between items-center">
              <button
                disabled={page === 1}
                onClick={() => loadSeniors(page - 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                disabled={page === pagination.totalPages}
                onClick={() => loadSeniors(page + 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
