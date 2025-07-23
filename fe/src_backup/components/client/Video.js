import React from "react";

const Video = () => {
  return (
    <div>
      <main className="relative flex-1  bg-black">
        <video
          className="w-full h-full object-cover"
          src="https://vod.freecaster.com/louisvuitton/9ed0c865-3ad4-44fd-af9a-66ef94c66350/WNf8Z5PnBUYUAABkCR4tATXp_9.mp4"
          autoPlay
          muted
          loop
          playsInline
        ></video>

        {/* Overlay content */}
        <div className="absolute  inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <span className="uppercase text-xs font-semibold tracking-widest mb-2 select-none">
            DÀNH CHO NAM
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal mb-3 select-none">
            Ngày của Cha
          </h2>
          <button
            className="underline text-white text-base font-normal cursor-pointer select-none"
            aria-label="Khám phá thêm"
          >
            Khám phá thêm
          </button>
        </div>

        {/* Controls */}
      </main>
    </div>
  );
};

export default Video;
