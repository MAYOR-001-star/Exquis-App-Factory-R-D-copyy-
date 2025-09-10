import { Construct } from 'constructs';

import { IBaseConstructProps } from 'cdk/types';
import { Architecture, LayerVersion, LayerVersionProps, Runtime } from 'aws-cdk-lib/aws-lambda';

export interface ILambdaLayerConstructProps extends IBaseConstructProps<Partial<LayerVersionProps>> {
}

export class LambdaLayerConstruct extends Construct {
	readonly layer: LayerVersion;
	constructor(scope: Construct, id: string, props: ILambdaLayerConstructProps) {
		super(scope, id);
		this.layer = new LayerVersion(this, id, {
			...props.options,
			compatibleArchitectures: [Architecture.ARM_64],
			compatibleRuntimes: [Runtime.NODEJS_20_X, Runtime.NODEJS_22_X],
			description: props.options?.description || 'Lambda layer for in Nodejs, nestjs, serverless-express'
		} as LayerVersionProps);
	}
}
