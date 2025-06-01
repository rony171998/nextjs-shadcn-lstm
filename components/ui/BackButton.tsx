// components/ui/BackButton.tsx
'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-transparent px-0"
    >
      <ArrowLeft className="h-4 w-4 mr-1" />
      Volver
    </Button>
  );
}