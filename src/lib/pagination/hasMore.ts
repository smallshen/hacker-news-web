export function hasMore(total: number, page: number, pageSize: number) {
    return page * pageSize < total
}
