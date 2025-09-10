import { Construct } from 'constructs';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Rule, RuleProps } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

import { IBaseConstructProps } from 'cdk/types';

export interface IEventBridgeConstructProps extends IBaseConstructProps<{
	readonly targetFunctions: Function[];
	readonly eventBridgeOptions: Omit<RuleProps, 'targets'>;
}> { }

export class EventBridgeConstruct extends Construct {
	readonly eventSchedule: Rule;
	constructor(scope: Construct, id: string, props: IEventBridgeConstructProps) {
		super(scope, id);
		this.eventSchedule = new Rule(this, id, {
			...props.options?.eventBridgeOptions,
			// targets: props.options?.targetFunctions?.length ? props.options?.targetFunctions.map(targetFuntion => new LambdaFunction(targetFuntion)) : []
		});
		if (props.options?.targetFunctions.length) {
			props.options.targetFunctions.forEach(targetFuntion => {
				this.eventSchedule.addTarget(new LambdaFunction(targetFuntion));
			})
		}
		this.eventSchedule.applyRemovalPolicy(RemovalPolicy.DESTROY);
	}
}
