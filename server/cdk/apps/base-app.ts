import { App } from "aws-cdk-lib";

const app = new App();

const whichApp = app.node.tryGetContext('which') as string || null;
if (whichApp === 'layer') {
	require('./lambda-layer-app').initLambdaLayer(app);
} else if (whichApp === 'api-staging') {
	require('./sample-app-staging').initLambdaAppStaging(app);
} else if (whichApp === 'api-production') {
	require('./sample-app-production').initLambdaAppProduction(app);
} else {
	throw new Error('Kindly provide which app to synth/bootstrap/deply!');
}