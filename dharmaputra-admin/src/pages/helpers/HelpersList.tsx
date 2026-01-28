// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getAllHelpersAPI, rejectHelperAPI } from "../../api/helpers.api";
// import Badge from "../../components/ui/Badge";
// import Button from "../../components/ui/Button";

// type Helper = {
//   _id?: string;
//   id?: string;
//   name: string;
//   phone: string;
//   status: "Approved" | "Pending" | "Rejected";
// };

// export default function HelpersList() {
//   const [helpers, setHelpers] = useState<Helper[]>([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const loadHelpers = async () => {
//     try {
//       setLoading(true);
//       const data = await getAllHelpersAPI();
//       setHelpers(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Failed to load helpers", err);
//       setHelpers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadHelpers();
//   }, []);

//   const deleteHelper = async (id: string) => {
//     const confirm = window.confirm(
//       "Are you sure you want to delete (disable) this helper?"
//     );
//     if (!confirm) return;

//     try {
//       await rejectHelperAPI(id); // soft delete (disable)
//       loadHelpers();
//     } catch (err) {
//       console.error("Failed to delete helper", err);
//       alert("Failed to delete helper");
//     }
//   };

//   if (loading) return <p className="text-slate-500">Loading helpers...</p>;

//   return (
//     <div className="bg-white rounded-xl shadow-sm p-6">
//       <h2 className="text-xl font-semibold mb-4">Helpers</h2>

//       {helpers.length === 0 ? (
//         <p className="text-slate-500">No helpers found</p>
//       ) : (
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b text-left text-slate-600">
//               <th className="py-2">Name</th>
//               <th>Phone</th>
//               <th>Status</th>
//               <th className="text-right">Delete</th>
//             </tr>
//           </thead>

//           <tbody>
//             {helpers.map((h) => {
//               const helperId = h._id || h.id!;
//               return (
//                 <tr key={helperId} className="border-b last:border-0">
//                   <td
//                     className="py-3 font-medium cursor-pointer text-blue-600 hover:underline"
//                     onClick={() => navigate(`/admin/helpers/${helperId}`)}
//                   >
//                     {h.name}
//                   </td>

//                   <td>{h.phone}</td>

//                   <td>
//                     <Badge
//                       label={h.status}
//                       color={
//                         h.status === "Approved"
//                           ? "green"
//                           : h.status === "Pending"
//                           ? "yellow"
//                           : "red"
//                       }
//                     />
//                   </td>

//                   <td className="text-right">
//                     <Button
//                       variant="danger"
//                       onClick={() => deleteHelper(helperId)}
//                     >
//                       Delete
//                     </Button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllHelpersAPI, rejectHelperAPI } from "../../api/helpers.api";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

type Helper = {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  status: "Approved" | "Pending" | "Rejected";
};

const ITEMS_PER_PAGE = 10;

export default function HelpersList() {
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const loadHelpers = async () => {
    try {
      setLoading(true);
      const data = await getAllHelpersAPI();
      setHelpers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load helpers", err);
      setHelpers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHelpers();
  }, []);

  /* 🔍 SEARCH FILTER */
  const filteredHelpers = useMemo(() => {
    const q = search.toLowerCase().trim();
    return helpers.filter(
      (h) =>
        h.name.toLowerCase().includes(q) || h.phone.toLowerCase().includes(q)
    );
  }, [helpers, search]);

  /* 📄 PAGINATION */
  const totalPages = Math.ceil(filteredHelpers.length / ITEMS_PER_PAGE);

  const paginatedHelpers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredHelpers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredHelpers, page]);

  /* 🔁 RESET PAGE WHEN SEARCH CHANGES */
  useEffect(() => {
    setPage(1);
  }, [search]);

  const deleteHelper = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete (disable) this helper?"
    );
    if (!confirm) return;

    try {
      await rejectHelperAPI(id);
      loadHelpers();
    } catch (err) {
      console.error("Failed to delete helper", err);
      alert("Failed to delete helper");
    }
  };

  if (loading) return <p className="text-slate-500">Loading helpers...</p>;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Helpers</h2>

        {/* 🔍 SEARCH */}
        <input
          type="text"
          placeholder="Search by name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm w-64"
        />
      </div>

      {/* TABLE */}
      {paginatedHelpers.length === 0 ? (
        <p className="text-slate-500">No helpers found</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-600">
              <th className="py-2">Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th className="text-right">Delete</th>
            </tr>
          </thead>

          <tbody>
            {paginatedHelpers.map((h) => {
              const helperId = h._id || h.id!;
              return (
                <tr key={helperId} className="border-b last:border-0">
                  <td
                    className="py-3 font-medium cursor-pointer text-blue-600 hover:underline"
                    onClick={() => navigate(helperId)}
                  >
                    {h.name}
                  </td>

                  <td>{h.phone}</td>

                  <td>
                    <Badge
                      label={h.status}
                      color={
                        h.status === "Approved"
                          ? "green"
                          : h.status === "Pending"
                          ? "yellow"
                          : "red"
                      }
                    />
                  </td>

                  <td className="text-right">
                    <Button
                      variant="danger"
                      onClick={() => deleteHelper(helperId)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* 📄 PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 pt-4">
          <Button onClick={() => page < totalPages && setPage((p) => p + 1)}>
            Prev
          </Button>

          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>

          <Button onClick={() => page < totalPages && setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
