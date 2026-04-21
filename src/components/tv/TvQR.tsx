"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type Props = {
  path: string;
  size?: number;
  className?: string;
};

export function TvQR({ path, size = 60, className = "" }: Props) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    setUrl(`${window.location.origin}${path}`);
  }, [path]);

  const box = (
    <div
      className={`bg-white rounded-lg p-1 flex items-center justify-center ${className}`}
      style={{ width: size + 8, height: size + 8 }}
    >
      {url && (
        <QRCodeSVG
          value={url}
          size={size}
          level="M"
          bgColor="#ffffff"
          fgColor="#050505"
          marginSize={0}
        />
      )}
    </div>
  );

  return box;
}
