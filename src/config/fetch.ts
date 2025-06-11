import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "./key";
import { calculatePagesCount } from "../helper/constant";
export const PAGE_SIZE = 2;

export const useFetchUser = (currentPage: number) => {
  const queryInfor = useQuery({
    // queryKey: ["fetchUsers", currentPage],
    queryKey: QUERY_KEY.getUserPaginate(currentPage),
    queryFn: async (): Promise<any> =>
      fetch(
        `http://localhost:8000/users?_page=${currentPage}&_limit=${PAGE_SIZE}`
      ).then(async (res) => {
        const total_items = +(res.headers.get("X-Total-Count") ?? 0);

        const totalPages = calculatePagesCount(total_items, PAGE_SIZE);
        const d = await res.json();
        return {
          total_items,
          totalPages,
          data: d,
        };
      }),
    placeholderData: keepPreviousData,
  });
  return {
    ...queryInfor,
    data: queryInfor?.data?.data ?? [],
    count: queryInfor?.data?.total_items ?? 0,
    totalPages: queryInfor?.data?.totalPages ?? 1,
  };
};
