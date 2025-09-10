#!/usr/bin/env node
import 'source-map-support/register';

import { App, DefaultStackSynthesizer } from 'aws-cdk-lib';

import { LambdaLayerStack } from '../stacks/lambda-layer-stack';

export function initLambdaLayer(app: App) {
	const stackName = 'sample-lambda-layer';

	const region = app.node.tryGetContext('region') as string || 'us-east-1';

	new LambdaLayerStack(app, stackName, {
		stackName,
		env: {
			region,
			account: process.env.CDK_DEFAULT_ACCOUNT
		},
		synthesizer: new DefaultStackSynthesizer({
			// Below prefix lambda layer code in s3 bucket e.g exquis-s3/layer
			// Deploying lambda using aws-cdk puts all resources into one s3 bucket. it is neccessory to seperate lambda-layer code, from lambda code
			// It put layer code into a folder basically.
			bucketPrefix: 'layer/'
		}),
	});

}