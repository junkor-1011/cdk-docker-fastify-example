import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { PrismaLambdaAppStack } from '../lib/prisma-lambda-app-stack';

test('snapshot test', () => {
  const app = new cdk.App();
  const stack = new PrismaLambdaAppStack(app, 'TestStack');
  const template = Template.fromStack(stack).toJSON();

  expect(template).toMatchSnapshot();
});
