import { Stack, StackProps } from 'aws-cdk-lib';
import {Bucket} from 'aws-cdk-lib/aws-s3'
import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as path from 'path'
import * as apGW from 'aws-cdk-lib/aws-apigateway'
import {BucketDeployment, Source} from 'aws-cdk-lib/aws-s3-deployment'
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkFinalStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const webAppBucket = new Bucket(this, 'webAppBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true
    })

    new BucketDeployment(this, 'webAppDeploy', {
      sources: [Source.asset(path.join(__dirname, '..', 'my-react', 'dist'))],
      destinationBucket: webAppBucket
    })

    const getTextLambda = new lambda.Function(this, 'simpleLambda', {
      runtime: Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('app'),
      handler: 'index.getText'
    })

    const gateWay = new apGW.LambdaRestApi(this, 'gateWay', {
      handler: getTextLambda
    })

    new cdk.CfnOutput(this, 'myBucketExport', {
      value: webAppBucket.bucketWebsiteUrl,
      exportName: 'webAppBucketName'
    })

    new cdk.CfnOutput(this, 'lambdaOut', {
      value: gateWay.url
    })

  }
}
