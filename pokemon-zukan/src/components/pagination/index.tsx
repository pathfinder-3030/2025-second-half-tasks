import Link from "next/link";
import { PaginationInfo } from "@/types/pokemon";

type Props = {
  pagination: PaginationInfo;
};

export function Pagination({ pagination }: Props) {
  const { currentPage, totalPages, hasPrevious, hasNext } = pagination;

  return (
    <div className='flex items-center justify-center gap-4 mt-8'>
      {hasPrevious ? (
        <Link
          href={`/?page=${currentPage - 1}`}
          className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
        >
          ← 前へ
        </Link>
      ) : (
        <span className='px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed'>
          ← 前へ
        </span>
      )}

      <span className='text-gray-700'>
        {currentPage} / {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={`/?page=${currentPage + 1}`}
          className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
        >
          次へ →
        </Link>
      ) : (
        <span className='px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed'>
          次へ →
        </span>
      )}
    </div>
  );
}
