#!/usr/bin/env node

const cdk = require('aws-cdk-lib')
const { CdkS3ApiStack } = require('../lib/cdk-s3-api-stack')

const app = new cdk.App();
new CdkS3ApiStack(app, 'CdkS3ApiStack', {
  env: {
    account: '12345678910', region: 'us-east-1' 
  }
})

