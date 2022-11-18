import {
  // Aws,
  // Duration,
  Stack,
  StackProps,
  aws_apigateway as apigateway,
  aws_lambda as lambda,
} from 'aws-cdk-lib';
// import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class PrismaLambdaApp2Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const helloLambda = new lambda.DockerImageFunction(this, 'helloImageFunction', {
      code: lambda.DockerImageCode.fromImageAsset('packages/hello-world'),
    });

    const fastapiLambda = new lambda.DockerImageFunction(this, 'fastapiImageFunction', {
      code: lambda.DockerImageCode.fromImageAsset('assets/fastapi-app'),
    });

    const lambdaApi = new apigateway.LambdaRestApi(this, 'helloApi', {
      handler: helloLambda,
      proxy: false,
    });
    const fastapiIntegration = new apigateway.LambdaIntegration(fastapiLambda);
    lambdaApi.root.addMethod('GET', fastapiIntegration);
    const docsPath = lambdaApi.root.addResource('docs');
    docsPath.addMethod('GET', fastapiIntegration);
    const openapiPath = lambdaApi.root.addResource('openapi.json');
    openapiPath.addMethod('GET', fastapiIntegration);

    const helloPath = lambdaApi.root.addResource('hello');
    helloPath.addMethod('GET', new apigateway.LambdaIntegration(helloLambda));
    const helloPath2 = lambdaApi.root.addResource('hello2');
    helloPath2.addMethod('GET');
  }
}
