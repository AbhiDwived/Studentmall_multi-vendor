import { Types } from 'mongoose';

export interface TBrand {
	name: string;
	slug: string;
	logo?: string;
	description?: string;
	status?: 'active' | 'inactive';
	createdBy?: Types.ObjectId;
	updatedBy?: Types.ObjectId;
}