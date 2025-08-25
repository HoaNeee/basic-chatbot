import React from "react";
import { Button } from "./ui/button";
import Spinner from "./ui/spinner";

const ButtonLoading = ({
  loading,
  className,
  children,
  onClick,
  type,
}: {
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}) => {
  return (
    <Button
      disabled={loading}
      className={`relative flex items-center justify-center ${className}`}
      type={type || "button"}
      onClick={onClick}
    >
      <span
        className={`${
          loading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
      >
        {children}
      </span>
      <div
        className={`absolute inset-0 ${
          loading ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300 w-full h-full flex items-center justify-center`}
      >
        <Spinner />
      </div>
    </Button>
  );
};

export default ButtonLoading;
