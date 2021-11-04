export interface Quote {
  id: string;
  author: string; // TODO: relation o2m
  text: string;
  source?: string;
  tags?: string[]; // TODO: relation m2m
  isDeleted?: boolean;
  createdBy?: string; // TODO: relation o2m
  createdAt?: number;
  updatedAt?: number;
}
