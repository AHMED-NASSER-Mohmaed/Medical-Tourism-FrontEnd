export interface Specialty {
    id: number;
    specialityId: number;
    hospitalId: number;
    status: number;
    specialtyName: string;
    specialityDesc: string;
}

export interface PaginatedSpecialtiesResponse {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    items: Specialty[];
}