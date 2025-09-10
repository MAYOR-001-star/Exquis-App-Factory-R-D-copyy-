import { Construct } from 'constructs';

import { IBaseConstructProps } from '../types';
import { Topic, TopicProps } from 'aws-cdk-lib/aws-sns';

export interface ISnsConstructProps extends IBaseConstructProps<TopicProps> { }

export class SnsConstruct extends Construct {
	readonly topic: Topic;
	constructor(scope: Construct, id: string, props: ISnsConstructProps) {
		super(scope, id);
		this.topic = new Topic(this, id, { ...props.options });
	}
}
