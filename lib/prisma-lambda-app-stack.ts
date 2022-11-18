import {
  // Aws,
  // Duration,
  Stack,
  StackProps,
  aws_apigateway as apigateway,
  aws_lambda as lambda,
} from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

const environmentForPrisma = {
  DATABASE_URL: 'postgres://dummy:5443/mydb',
};
const commandHooksForPrisma = {
  beforeInstall(inputDir: string, outputDir: string): string[] {
    return [``];
  },
  beforeBundling(inputDir: string, outputDir: string): string[] {
    return [``];
  },
  afterBundling(inputDir: string, outputDir: string): string[] {
    return [
      `cd ${inputDir}/packages/fastify-app && pnpm prisma generate`,
      `cp ${inputDir}/node_modules/.pnpm/prisma@4.6.1/node_modules/prisma/libquery_engine-rhel-openssl-1.0.x.so.node ${outputDir}`,
      `cp ${inputDir}/packages/fastify-app/prisma/schema.prisma ${outputDir}`,
    ];
  },
};

export class PrismaLambdaAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fastifyAppLambda = new NodejsFunction(this, 'FastifyAppLambda', {
      entry: 'packages/fastify-app/lambda.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      bundling: {
        sourceMap: true,
        minify: true,
        commandHooks: commandHooksForPrisma,
      },
      environment: {
        ...environmentForPrisma,
        STAGE: 'PRODUCTION',
      },
    });

    const helloLambda = new lambda.DockerImageFunction(this, 'helloImageFunction', {
      code: lambda.DockerImageCode.fromImageAsset('packages/hello-world'),
    });

    const lambdaApi = new apigateway.LambdaRestApi(this, 'fastifyAppApi', {
      handler: fastifyAppLambda,
      proxy: false,
    });
    lambdaApi.root.addMethod('GET', new apigateway.LambdaIntegration(helloLambda));
    const userPath = lambdaApi.root.addResource('user');
    userPath.addMethod('GET');
    userPath.addMethod('POST');
    const userIdPath = userPath.addResource('{id}');
    userIdPath.addMethod('GET');
    userIdPath.addMethod('PUT');
    userIdPath.addMethod('PATCH');
    userIdPath.addMethod('DELETE');
  }
}
