import { Method } from "axios";

export interface IBaseApiResponse<TEntity> {
	success: boolean;
	message: string;
	data: TEntity;
}

export interface IBaseErrorObject {
	message: string;
	method?: Method;
	path?: string;
	statusCode?: number;
	timestamp?: string;
}