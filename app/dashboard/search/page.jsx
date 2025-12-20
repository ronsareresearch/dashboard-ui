// "use client";

// import { useState } from "react";

// export default function SearchTest() {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("healthhhhhhhhhhh.pdf");
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ------------------------------------
//   // 🔥 CALL FASTAPI SEARCH API
//   // ------------------------------------
//   const fetchSearchResults = async () => {
//     if (!searchQuery) return;

//     setLoading(true);

//     try {
//       const res = await fetch(
//         `http://localhost:4001/api/v1/attachments/search?q=${encodeURIComponent(
//           searchQuery
//         )}`
//       );

//       const data = await res.json();

//       const mapped = data.results.map((item) => ({
//         id: item.id,
//         name: item.filename || "Untitled",
//         service: item.mime_type,
//         status: "Document",
//         date: item.created_at?.slice(0, 10),
//         url: item.storage_url,
//         raw: item
//       }));

//       setFilteredUsers(mapped);
//     } catch (err) {
//       console.error("API Error:", err);
//     }

//     setLoading(false);
//   };

//   // ------------------------------------
//   // 🔎 Detect only image preview
//   // ------------------------------------
//   const isImage = (mime) => {
//     if (!mime) return false;
//     return mime.includes("image");
//   };

//   return (
//     <div className="p-2 bg-gray-800 h-screen">
//       <div className="flex h-full bg-gray-100 rounded-3xl">

//         {/* LEFT SIDE AREA (List Section) */}
//         <div className="w-[70%] p-6 flex flex-col overflow-hidden">
//           {!selectedUser && (
//             <>
//               <div className="flex items-center gap-4 mb-6">
//                 <input
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Search..."
//                   className="px-4 py-3 w-72 rounded-xl border text-gray-900"
//                 />

//                 <button
//                   onClick={fetchSearchResults}
//                   className="px-6 py-4 bg-gray-900 text-white rounded-xl text-lg font-medium hover:bg-gray-800"
//                 >
//                   Search
//                 </button>
//               </div>

//               <div className="flex-1 bg-white border rounded-3xl p-6 shadow overflow-y-auto">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                   Search Results
//                 </h2>

//                 {loading && (
//                   <p className="text-center text-gray-500 py-6">
//                     Loading...
//                   </p>
//                 )}

//                 {!loading && filteredUsers.length === 0 && (
//                   <p className="text-center text-gray-500 py-6">No results</p>
//                 )}

//                 {!loading && (
//                   <div className="space-y-3">
//                     {filteredUsers.map((u, i) => (
//                       <div
//                         key={i}
//                         onClick={() => setSelectedUser(u)}
//                         className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border hover:bg-gray-100 cursor-pointer"
//                       >
//                         <div className="flex items-center gap-4">
//                           <div className="w-11 h-11 rounded-2xl bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
//                             {u.name[0]}
//                           </div>

//                           <div>
//                             <p className="font-medium text-gray-900">
//                               {u.name}
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               {u.service}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="text-xs text-gray-500 text-right">
//                           <p>{u.date}</p>
//                           <p>{u.status}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </>
//           )}

//           {/* Back Button */}
//           {selectedUser && (
//             <button
//               onClick={() => setSelectedUser(null)}
//               className="mt-4 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800"
//             >
//               ← Back to Results
//             </button>
//           )}
//         </div>

//         {/* RIGHT SIDE PREVIEW PANEL */}
//         {selectedUser && (
//           <div className="w-[30%] bg-white border-l rounded-r-3xl p-6 shadow overflow-y-auto">
//             <h2 className="text-xl font-semibold text-gray-900 mb-3">
//               Preview
//             </h2>

//             {/* File Name */}
//             <p className="font-medium text-gray-700 mb-2">
//               {selectedUser.name}
//             </p>

//             <p className="text-xs text-gray-500 mb-4">
//               {selectedUser.service}
//             </p>

//             {/* ---------- NEW PREVIEW RULE ---------- */}
//             {isImage(selectedUser.service) ? (
//               // IMAGE → SHOW PREVIEW
//               <img
//                 src={selectedUser.url}
//                 className="w-full rounded-xl shadow"
//                 alt="preview"
//               />
//             ) : (
//               // OTHERS → ONLY DOWNLOAD BUTTON
//               <a
//                 href={selectedUser.url}
//                 download
//                 className="px-4 py-3 bg-gray-900 text-white rounded-xl block text-center"
//               >
//                 Download File
//               </a>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
