import { APIGatewayProxyCallbackV2, APIGatewayProxyEventV2, Context, Handler } from 'aws-lambda';
import { initLambdaApi } from '@exquisappfactory/backend-toolkit';

import { bootstrapApplication } from './app';


export const handler: Handler = async (event: APIGatewayProxyEventV2, context: Context, callback: APIGatewayProxyCallbackV2) => {
	context.callbackWaitsForEmptyEventLoop = false;
	const application = await bootstrapApplication();
	await application.init();
	const expressInstance = application.getHttpAdapter().getInstance();
	return await initLambdaApi({ app: expressInstance, event, context, callback });
}