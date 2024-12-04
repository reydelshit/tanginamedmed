import { useState } from 'react';

type PaginationProps<T> = {
  data: T[];
  itemsPerPage: number;
};

const usePagination = <T>({ itemsPerPage, data }: PaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  //   const [itemsPerPage, setItemsPerPage] = useState(2);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    currentItems,
    totalPages,
    currentPage,
    handlePageChange,
  };
};

export default usePagination;