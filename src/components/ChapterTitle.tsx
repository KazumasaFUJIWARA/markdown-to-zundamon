import React from "react";

interface Props {
  title: string;
  fontFamily: string;
  position: "top-right" | "top-left";
}

export const ChapterTitle: React.FC<Props> = ({
  title,
  fontFamily,
  position,
}) => {
  const isRight = position === "top-right";

  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        ...(isRight ? { right: 60 } : { left: 60 }),
        padding: "12px 28px",
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        borderRadius: 12,
        maxWidth: "40%",
      }}
    >
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          lineHeight: 1.4,
          color: "#fff",
          fontFamily: `'${fontFamily}', sans-serif`,
          textAlign: isRight ? "right" : "left",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </div>
    </div>
  );
};
