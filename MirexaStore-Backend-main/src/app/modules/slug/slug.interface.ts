import { Types } from 'mongoose';

export interface TSlug {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  innerSlugs?: string[];
  createdBy?: Types.ObjectId;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}