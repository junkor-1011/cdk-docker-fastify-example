import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { PrismaLambdaAppStack } from '../lib/prisma-lambda-app-stack';
import { PrismaLambdaApp2Stack } from '../lib/prisma-lambda-app2-stack';

test('snapshot test', () => {
  const app = new cdk.App();
  const stack = new PrismaLambdaAppStack(app, 'TestStack');
  const template = Template.fromStack(stack).toJSON();

  expect(template).toMatchSnapshot();
});
test('snapshot test2', () => {
  const app = new cdk.App();
  const stack = new PrismaLambdaApp2Stack(app, 'TestStack');
  const template = Template.fromStack(stack).toJSON();

  expect(template).toMatchSnapshot();
});
