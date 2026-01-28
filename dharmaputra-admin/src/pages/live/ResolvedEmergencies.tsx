// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getResolvedEmergenciesAPI } from "../../api/emergency.api";

// /* ================= TYPES ================= */

// type User = {
//   _id: string;
//   phone?: string;
//   role?: string;
//   name?: string;
//   profileImage?: string;
// };

// type SeniorProfile = {
//   firstName: string;
//   lastName: string;
// };

// type Emergency = {
//   _id: string;
//   user: User;
//   seniorProfile: SeniorProfile;
//   responders: User[];
//   triggeredAt: string;
//   resolvedAt?: string;
//   status: string;
// };

// /* ================= COMPONENT ================= */

// export default function ResolvedEmergencies() {

//   const [emergencies, setEmergencies] = useState<Emergency[]>([]);
//   const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(
//     null
//   );
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchResolved();
//   }, []);

//   const fetchResolved = async () => {
//     try {
//       setLoading(true);
//       const data = await getResolvedEmergenciesAPI();

//       const normalized: Emergency[] = (data || []).map((em: any) => ({
//         ...em,
//         responders: em.responders ?? [],
//       }));

//       setEmergencies(normalized);
//     } catch (err) {
//       console.error("Failed to fetch resolved emergencies", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= RENDER ================= */

//   return (
//     <div className="p-6">
//       {/* HEADER */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Resolved Emergencies</h1>

//         <button
//           onClick={() => navigate("/admin/live-emergencies")}
//           className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-100"
//         >
//           ← Back to Live Emergencies
//         </button>
//       </div>

//       {loading ? (
//         <p className="text-slate-500">Loading resolved emergencies...</p>
//       ) : emergencies.length === 0 ? (
//         <p className="text-slate-500">No resolved emergencies found</p>
//       ) : (
//         <table className="w-full text-sm bg-white rounded-lg shadow-sm">
//           <thead>
//             <tr className="border-b text-left text-slate-600">
//               <th className="py-3 px-4">Senior</th>
//               <th>Triggered At</th>
//               <th>Resolved At</th>
//               <th>Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {emergencies.map((em) => (
//               <tr
//                 key={em._id}
//                 onClick={() => setSelectedEmergency(em)}
//                 className="border-b last:border-0 cursor-pointer hover:bg-slate-50"
//               >
//                 <td className="py-3 px-4 font-medium">
//                   {em.user?.name || "Unknown User"}
//                 </td>

//                 <td>{new Date(em.triggeredAt).toLocaleString()}</td>

//                 <td>
//                   {em.resolvedAt
//                     ? new Date(em.resolvedAt).toLocaleString()
//                     : "—"}
//                 </td>

//                 <td>
//                   <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
//                     RESOLVED
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* ================= DETAIL MODAL ================= */}

//       {selectedEmergency && (
//         <Modal onClose={() => setSelectedEmergency(null)}>
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-bold">Emergency Details</h2>
//             <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
//               RESOLVED
//             </span>
//           </div>

//           {/* Senior */}
//           <div className="flex items-center gap-4 mb-6">
//             <img
//               src={selectedEmergency.user?.profileImage || "/logo.png"}
//               className="h-20 w-20 rounded-full object-cover"
//             />
//             <div>
//               <p className="font-semibold text-lg">
//                 {em.userId?.name || "Unknown Senior"}
//               </p>
//               <p className="text-sm text-slate-500">Senior</p>
//             </div>
//           </div>

//           {/* Timing */}
//           <div className="space-y-2 text-sm mb-6">
//             <p>
//               <b>Triggered At:</b>{" "}
//               {new Date(selectedEmergency.triggeredAt).toLocaleString()}
//             </p>
//             <p>
//               <b>Resolved At:</b>{" "}
//               {selectedEmergency.resolvedAt
//                 ? new Date(selectedEmergency.resolvedAt).toLocaleString()
//                 : "—"}
//             </p>
//           </div>

//           {/* Responders */}
//           <h3 className="font-semibold mb-2">Responders</h3>

//           {selectedEmergency.responders.length === 0 ? (
//             <p className="text-slate-500 text-sm">No responders recorded</p>
//           ) : (
//             <div className="space-y-2">
//               {selectedEmergency.responders.map((responder) => (
//                 <div
//                   key={responder._id}
//                   className="flex items-center gap-3 p-2 rounded-md bg-slate-50"
//                 >
//                   <img
//                     src={responder.profileImage || "/logo.png"}
//                     className="h-10 w-10 rounded-full"
//                   />
//                   <div>
//                     <p className="font-medium">
//                       {responder.name || "Responder"}
//                     </p>
//                     <p className="text-xs text-slate-500">{responder.role}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </Modal>
//       )}
//     </div>
//   );
// }

// /* ================= MODAL ================= */

// function Modal({
//   children,
//   onClose,
// }: {
//   children: React.ReactNode;
//   onClose: () => void;
// }) {
//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-slate-500 hover:text-black"
//         >
//           ✕
//         </button>
//         {children}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResolvedEmergenciesAPI } from "../../api/emergency.api";

/* ================= TYPES ================= */

type User = {
  _id: string;
  name?: string;
  phone?: string;
  role?: string;
  profileImage?: string;
};

// type Emergency = {
//   _id: string;
//   userId?: User;
//   respondedBy?: User;
//   triggeredAt: string;
//   resolvedAt?: string;
//   status: string;
// };
type SeniorProfile = {
  firstName: string;
  lastName: string;
  profileImage?: string;
};

type Emergency = {
  _id: string;
  userId?: User;
  seniorProfile?: SeniorProfile;
  triggeredAt: string;
  resolvedAt?: string;
  status: string;
};

/* ================= COMPONENT ================= */

export default function ResolvedEmergencies() {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchResolved();
  }, []);

  const fetchResolved = async () => {
    try {
      setLoading(true);
      const data = await getResolvedEmergenciesAPI();
      setEmergencies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch resolved emergencies", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Resolved Emergencies</h1>

        <button
          onClick={() => navigate("/admin/live-emergencies")}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-100"
        >
          ← Back to Live Emergencies
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading resolved emergencies...</p>
      ) : emergencies.length === 0 ? (
        <p className="text-slate-500">No resolved emergencies found</p>
      ) : (
        <table className="w-full text-sm bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="border-b text-left text-slate-600">
              <th className="py-3 px-4">Senior</th>
              <th>Triggered At</th>
              <th>Resolved At</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {emergencies.map((em) => (
              <tr
                key={em._id}
                onClick={() => setSelectedEmergency(em)}
                className="border-b last:border-0 cursor-pointer hover:bg-slate-50"
              >
                <td className="py-3 px-4 font-medium">
                  {/* {em.userId?.name || "Unknown Senior"} */}
                  {em.seniorProfile
                    ? `${em.seniorProfile.firstName} ${em.seniorProfile.lastName}`
                    : "Unknown Senior"}
                </td>

                <td>{new Date(em.triggeredAt).toLocaleString()}</td>

                <td>
                  {em.resolvedAt
                    ? new Date(em.resolvedAt).toLocaleString()
                    : "—"}
                </td>

                <td>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                    RESOLVED
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= DETAIL MODAL ================= */}

      {selectedEmergency && (
        <Modal onClose={() => setSelectedEmergency(null)}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Emergency Details</h2>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
              RESOLVED
            </span>
          </div>

          {/* Senior Info */}
          <div className="flex items-center gap-4 mb-6">
            {/* <img
              src={selectedEmergency.userId?.profileImage || "/logo.png"}
              className="h-20 w-20 rounded-full object-cover"
            /> */}
            <img
              src={selectedEmergency.seniorProfile?.profileImage || "/logo.png"}
              className="h-20 w-20 rounded-full object-cover"
            />

            <div>
              {/* <p className="font-semibold text-lg">
                {selectedEmergency.userId?.name || "Unknown Senior"}
              </p> */}
              <p className="font-semibold text-lg">
                {selectedEmergency.seniorProfile
                  ? `${selectedEmergency.seniorProfile.firstName} ${selectedEmergency.seniorProfile.lastName}`
                  : "Unknown Senior"}
              </p>

              <p className="text-sm text-slate-500">Senior</p>
            </div>
          </div>

          {/* Timing */}
          <div className="space-y-2 text-sm">
            <p>
              <b>Phone:</b> {selectedEmergency.userId?.phone || "N/A"}
            </p>
            <p>
              <b>Triggered At:</b>{" "}
              {new Date(selectedEmergency.triggeredAt).toLocaleString()}
            </p>
            <p>
              <b>Resolved At:</b>{" "}
              {selectedEmergency.resolvedAt
                ? new Date(selectedEmergency.resolvedAt).toLocaleString()
                : "—"}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ================= MODAL ================= */

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-black"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
