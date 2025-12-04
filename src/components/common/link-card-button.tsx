"use client";

import * as React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkCardButtonProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
}

export default function LinkCardButton({
  href,
  icon: Icon,
  title,
  description,
  className,
  iconClassName,
  onClick,
}: LinkCardButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl sm:rounded-2xl bg-background p-4 sm:p-6 shadow-lg border transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer block",
        className
      )}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={cn(
            "flex h-12 w-12 sm:h-14 sm:w-14 md:h-15 md:w-15 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-primary text-primary-foreground shadow-md group-hover:scale-110 transition-transform",
            iconClassName
          )}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div>
          <h3 className="font-bold text-base sm:text-lg md:text-xl mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{description}</p>
        </div>
      </div>
      {/* Decorative element */}
      <div className="absolute -right-3 -top-3 sm:-right-4 sm:-top-4 h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />
    </Link>
  );
}
