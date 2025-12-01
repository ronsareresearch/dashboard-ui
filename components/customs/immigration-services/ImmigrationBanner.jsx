import React from "react";

const ImmigrationBanner = () => {
  return (
   <div className="p-1 border rounded-2xl">
     <div className="relative rounded-2xl overflow-hidden h-[100px] flex items-end bg-gray-200 border border-black/30">
      
      {/* Background image with 20% opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-100"
        style={{
          backgroundImage: "url('/background-img/immigration-service-bg.jpg')",
        }}
      ></div>

      {/* Text */}
      <div className="relative z-10 p-4 space-y-2 text-gray-900">
        <h1 className="font-semibold text-2xl">Immigration Services Dashboard</h1>
        <p className="text-sm">
          A streamlined dashboard to manage applications, track documents, and monitor
          immigration case progress.
        </p>
      </div>
    </div>
   </div>
  );
};

export default ImmigrationBanner;
