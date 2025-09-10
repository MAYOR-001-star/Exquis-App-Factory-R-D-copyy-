import { BillingMode, GlobalSecondaryIndexProps, Table, TableProps } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { IBaseConstructProps } from 'cdk/types';

export interface IDynamoDBConstructProps extends IBaseConstructProps<{
	tableOptions?: TableProps;
	globalSecondaryIndexes?: GlobalSecondaryIndexProps[];
}> { }

export class DynamoDBConstruct extends Construct {
	readonly table: Table;
	constructor(scope: Construct, id: string, props: IDynamoDBConstructProps) {
		super(scope, id);

		this.table = new Table(this, id, {
			...props.options?.tableOptions,
			deletionProtection: props.stage === 'production',
			billingMode: props.options?.tableOptions?.billingMode || BillingMode.PAY_PER_REQUEST,
			// removalPolicy: props.stage === 'production' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY
		});

		if (props.options?.globalSecondaryIndexes?.length) {
			props.options.globalSecondaryIndexes.forEach(globalIndex => {
				this.table.addGlobalSecondaryIndex(globalIndex);
			});
		}
	}
}
