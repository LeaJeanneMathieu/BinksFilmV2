"use client";

type FilterButtonProps = {
  onClick?: () => void;
};

export default function FilterButton({ onClick }: FilterButtonProps) {
  return (
    <button type="button" className="btn-filter" onClick={onClick}>
      FILTRER +
    </button>
  );
}
