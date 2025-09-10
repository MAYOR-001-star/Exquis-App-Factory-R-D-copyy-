#!/usr/bin/env node
import 'source-map-support/register';

import { App, DefaultStackSynthesizer } from 'aws-cdk-lib';

import { SampleApiStack } from '../stacks/sample-api-stack';
import { LambdaApplicationEnum } from '../constant';

export function initLambdaAppStaging(app: App) {
	const stackName = `${LambdaApplicationEnum.STACK_NAME}-staging`;
	const region = app.node.tryGetContext('region') as string || 'us-east-1';

	new SampleApiStack(app, stackName, {
		stage: 'staging',
		stackName,
		env: {
			region,
			account: process.env.CDK_DEFAULT_ACCOUNT,
		},
		synthesizer: new DefaultStackSynthesizer({
			// Below prefix lambda code in s3 bucket e.g exquis-s3/lambda/staging
			// Deploying lambda using aws-cdk puts all resources into one s3 bucket. it is neccessory to seperate lambda-layer code, from lambda code
			// It put lambda code into a folder basically.
			bucketPrefix: 'lambda/staging/'
		}),
	});


}