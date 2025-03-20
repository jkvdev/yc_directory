// "use client";

import React from "react";

const Ping = () => {
  return (
    <div className="relative">
      {/* Position ping */}
      <div className="absolute -left-4 top-1">
        {/* Size it */}
        <span className="flex size-[11px]">
          {/* Background ping animation */}
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
          {/* Static ping */}
          <span className="relative inline-flex size-[11px] rounded-full bg-primary"></span>
        </span>
      </div>
    </div>
  );
};
export default Ping;
