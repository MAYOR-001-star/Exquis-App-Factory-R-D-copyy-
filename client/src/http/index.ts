import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import { IBaseApiResponse, IBaseErrorObject } from "../interface/base.interface";


export async function sendHttpRequest<TResponse = any, TBody extends Record<string, any> = any>(
	options: Required<Pick<AxiosRequestConfig<TBody>, 'url'>> & Omit<AxiosRequestConfig<TBody>, 'url'> & { ignoreInterceptor?: boolean }
) {
	try {
		options.ignoreInterceptor = options?.ignoreInterceptor || false;
		if (!options?.ignoreInterceptor) {
			return getAxiosInstance()(options) as unknown as IBaseApiResponse<TResponse>;
		}
		const response = await axios(options);
		return response.data as unknown as IBaseApiResponse<TResponse>;
	} catch (error) {
		const errorObject = !options?.ignoreInterceptor ? error : error?.response?.data;
		const message = errorObject?.message || errorObject || error?.message || 'Http call errored out!';
		throw { ...errorObject, message };
	}
}


export function getAxiosInstance() {
	// cancel previous http request https://www.youtube.com/watch?v=cIwpavIhI84
	let jwtToken: string | null = null;
	const baseURL = 'http://localhost:3033/api';
	const instance = axios.create({ baseURL });

	function getLocalToken() {
		if (!jwtToken) {
			jwtToken = localStorage.getItem("token");
		}
		return jwtToken;
	}

	instance.interceptors.response.use(
		({ data }) => {
			return { ...data };
		},
		(error: AxiosError<{ error: IBaseErrorObject }>) => {
			let errorObject: IBaseErrorObject;
			const originalRequest = error.config as any;

			if (
				error.response &&
				error.response?.status > 399 &&
				error.response?.status < 600
			) {
				errorObject = error?.response?.data?.error;
			} else {
				const newError = (error as any).error as AxiosError || error;
				const errorResponse = newError?.response! as any;

				errorObject = {
					statusCode: newError?.response?.status || 500,
					message:
						newError?.response?.statusText! ||
						errorResponse?.message ||
						error.message,
					path: errorResponse?.path,
					method: errorResponse?.method as Method,
					timestamp: errorResponse?.timestamp,
				};
			}

			if (error.response?.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true;
			}
			console.log("TCL: error", errorObject);
			return Promise.reject({ ...errorObject });
		}
	);

	instance.interceptors.request.use(
		(config) => {
			if (!window.navigator.onLine) {
				return Promise.reject({
					error: {
						response: {
							message: "No internet connection!",
							path: config.url,
							method: config.method,
							timestamp: new Date().toISOString(),
						},
					},
				});
			}
			const token = getLocalToken();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error) => {
			return Promise.reject({ error });
		}
	);
	return instance;

}
