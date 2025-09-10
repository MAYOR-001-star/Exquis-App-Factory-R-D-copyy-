import { Construct } from 'constructs';
import { RemovalPolicy } from 'aws-cdk-lib';
import { LogGroup, LogGroupProps, RetentionDays } from 'aws-cdk-lib/aws-logs';

import { IBaseConstructProps } from '../types';

export interface ILogGroupConstructProps extends IBaseConstructProps<LogGroupProps> { }

export class CloudWatchLogGroupConstruct extends Construct {
	readonly logGroup: LogGroup;
	constructor(scope: Construct, id: string, props: ILogGroupConstructProps) {
		super(scope, id);
		this.logGroup = new LogGroup(this, id, {
			...props.options,
			removalPolicy: props.options?.removalPolicy || RemovalPolicy.DESTROY,
			retention: props.options?.retention || RetentionDays.INFINITE,
		});
	}
}
