export type TPaginationDto = {
  page: string | number;
  pages: string | number;
};

export async function PaginationDto({
  page,
  pages,
}: TPaginationDto): Promise<TPaginationDto> {
  return {
    page: page && typeof page === 'string' ? Number(page) : 1,
    pages: page && typeof page === 'string' ? Number(pages) : 10,
  };
}
