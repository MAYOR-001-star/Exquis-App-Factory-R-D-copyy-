import { StageType } from "../constant";

export interface IBaseConstructProps<TOptions extends Record<string, any> = any> {
	readonly stage?: StageType;
	readonly appName?: string;
	readonly options?: TOptions;
	readonly stackName?: string;
}