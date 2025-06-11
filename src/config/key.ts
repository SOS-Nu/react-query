export const QUERY_KEY = {
  getUserPaginate: (currentPage: number) => {
    return ["fetchUser", currentPage];
  },
  getAllUser: () => ["fetchUser"],
};
