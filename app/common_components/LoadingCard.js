// components/VocabCard.js
"use client";

import React, { useState } from "react";
import Image from "next/image";
export default function LoadCard() {
  return (
    <div className="flex w-full items-center justify-center">
      <div
        className="relative w-full max-w-[360px] h-[26rem] my-8 cursor-pointer"
        style={{ perspective: "1000px" }}
      >
        <div className="relative w-full h-full transition-transform duration-500">
          {/* Front Side */}
          <div className="absolute w-full h-full flex flex-col items-center justify-center ">
            <Image
              src="/icons/loading.svg"
              alt="loading"
              width={60}
              height={60}
              className="animate-spin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
