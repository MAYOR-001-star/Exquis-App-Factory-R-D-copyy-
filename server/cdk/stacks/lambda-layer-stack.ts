import { Code } from "aws-cdk-lib/aws-lambda";
import { App, CfnOutput, Stack, StackProps } from "aws-cdk-lib";

import { IBaseConstructProps } from "../types";
import { LambdaLayerConstruct } from "../constructs/lambda-layer-construct";

export interface IProp extends StackProps, Omit<IBaseConstructProps, 'stackName'> { }

export class LambdaLayerStack extends Stack {
	constructor(scope: App, id: string, props: IProp) {
		super(scope, id, props);

		// Lambda layer from ARN Setup
		const lambdaLayerConstruct = new LambdaLayerConstruct(this, 'lambdaLayer', {
			options: {
				layerVersionName: 'sample-layer',
				code:Code.fromAsset('./dist-layer')
			}
		});

		new CfnOutput(this, 'lambdaLayerCfnOutput', {
			value: lambdaLayerConstruct.layer.layerVersionArn
		});
	}
}
