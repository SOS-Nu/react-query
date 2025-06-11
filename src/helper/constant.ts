export const calculatePagesCount = (total_items: number, PAGE_SIZE: number) => {
  const total_pages = total_items == 0 ? 1 : Math.ceil(total_items / PAGE_SIZE);
  return total_pages;
};
