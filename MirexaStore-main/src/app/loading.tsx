"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm">
      <div className="loader" />

      <style jsx>{`
        .loader {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: inline-block;
          border-top: 4px solid #ea580c;
          border-right: 4px solid transparent;
          animation: rotation 1s linear infinite;
          position: relative;
        }

        .loader::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border-bottom: 4px solid #ea580c;
          border-left: 4px solid transparent;
        }

        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
