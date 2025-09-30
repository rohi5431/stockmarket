import React from "react";

export function Card({ children }) {
  return (
    <div className="bg-gray-800 rounded-md p-4 shadow-md">
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div className="text-white">{children}</div>;
}

export function CardHeader({ className, ...props }) {
  return (
    <div className={`mb-3 ${className}`} {...props} />
  )
}

export function CardTitle({ className, ...props }) {
  return (
    <h3 className={`text-lg font-semibold ${className}`} {...props} />
  )
}

export function CardContents({ className, ...props }) {
  return (
    <div className={`space-y-2 ${className}`} {...props} />
  )
}


export const TraderBox = ({ children, className }) => {
  return (
    <div className={`rounded-2xl border border-gray-800 shadow-md relative ${className}`}>
      {children}
    </div>
  );
};

// Inner body wrapper
export const TraderBody = ({ children, className }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};