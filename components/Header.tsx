import React from "react";

const Header: React.FC = () => {
  return (
    <header className="py-6 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-200">
          KHATRI ALANKAR
        </span>
      </h1>
      <p className="mt-2 text-3xl bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-200">
        {formatDate(new Date())}
      </p>
      <p className="mt-2 text-lg text-slate-400">Jewellery Price Calculator</p>
    </header>
  );
};

export default Header;

function formatDate(d: Date) {
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}
