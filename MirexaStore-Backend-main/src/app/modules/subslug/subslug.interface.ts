import { Types } from 'mongoose';

export interface TSubSlug {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  parentSlug: Types.ObjectId;
  innerSubSlugs?: string[];
  createdBy?: Types.ObjectId;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}