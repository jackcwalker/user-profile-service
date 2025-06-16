import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class UserProfileServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const table = new dynamodb.Table(this, 'UserProfilesTable', {
      tableName: 'UserProfiles',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Remove on `cdk destroy` (only appropriate for dev)
    });

    // Helper to create Lambda function
    const createLambda = (name: string) =>
      new NodejsFunction(this, `${name}Function`, {
        entry: path.join(__dirname, `../src/handlers/${name}/index.ts`),
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        environment: {
          TABLE_NAME: table.tableName!,
        },
        bundling: {
          externalModules: [],
        },
      });

    const getProfile = createLambda('getProfile');
    const getAllProfiles = createLambda('getAllProfiles');
    const updateProfile = createLambda('updateProfile');
    const createProfile = createLambda('createProfile');

    // Grant access to table
    table.grantReadData(getProfile);
    table.grantReadData(getAllProfiles);
    table.grantReadWriteData(updateProfile);
    table.grantWriteData(createProfile);

    // API Gateway
    const api = new apigateway.RestApi(this, 'UserProfileApi', {
      restApiName: 'User Profile Service',
      deployOptions: {
        stageName: 'dev',
      },
    });

    const profiles = api.root.addResource('profiles');
    profiles.addMethod('POST', new apigateway.LambdaIntegration(createProfile));
    profiles.addMethod('GET', new apigateway.LambdaIntegration(getAllProfiles));

    const profileById = profiles.addResource('{id}');
    profileById.addMethod('GET', new apigateway.LambdaIntegration(getProfile));
    profileById.addMethod('PUT', new apigateway.LambdaIntegration(updateProfile));
  }
}
