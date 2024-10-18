const { Stack } = require('aws-cdk-lib')
const { Construct } = require('constructs')
const cdk = require('aws-cdk-lib')

const apigw = require('aws-cdk-lib/aws-apigateway')
const s3 = require('aws-cdk-lib/aws-s3')
const aws_iam = require("aws-cdk-lib/aws-iam")

class CdkS3ApiStack extends Stack {
   /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  
   // Define public parameter for IAM Role that will be assumed by API GW to make calls to S3 APi's
  apiGatewayRole;

  constructor(scope, id, props){
    super(scope, id, props);
    // Define API GW with Rest API. 
    // Endpoint is defined as EDGE. 
    const restApi = new apigw.RestApi(this, 's3Api', {
      restApiName: "s3Api", 
      description: "Rest API for accessing S3 bucket and its object", 
      endpointConfiguration: {
        types:[ apigw.EndpointType.EDGE]
      }, 
      // 
      binaryMediaTypes: ["application/octet-stream", "image/png"]
    });

    //Define S3 Bucket for API GW
    const s3ApiBucket = new s3.Bucket(this, 's3ApiBucket', {
      bucketName: 's3-api-bucket',
     // publicReadAccess: true, 
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const bucketRootResource = restApi.root.addResource('s3-api-bucket');

    this.apiGatewayRole = aws_iam.Role.fromRoleName(this, 'apiGatewayRole', 'APIGatewayS3ProxyPolicy');

    const listBucketApiIntegration = new apigw.AwsIntegration({
      service:"s3", 
      region:"us-east-1", 
      path: s3ApiBucket.bucketName, 
      integrationHttpMethod: "GET", 
      options: {
        credentialsRole:this.apiGatewayRole, 
        passthroughBehavior: apigw.PassthroughBehavior.WHEN_NO_TEMPLATES,
        requestParameters: {'integration.request.path.bucket': 'method.request.path.folder'},
        integrationResponses: [
          {
            statusCode: '200', 
            responseParameters: { 
              'method.response.header.Date': 'integration.response.header.Date',
              'method.response.header.Content-Length': 'integration.response.header.Content-Length', 
              'method.response.header.Content-Type': 'integration.response.header.Content-Type'
            }
          }
        ]
      }
    });

    bucketRootResource.addMethod('GET', listBucketApiIntegration, 
      { 
        authorizationType: apigw.AuthorizationType.IAM, 
        requestParameters: {
          'method.request.path.folder': true
        }, 
        methodResponses: [
          {
            statusCode: '200', 
            responseParameters: 
              {
                'method.response.header.Content-Type': true,
                'method.response.header.Date': true, 
                'method.response.header.Content-Length': true
              }
          }
        ]
      }
    );

    const bucketItemResource = bucketRootResource.addResource("{item}");

    const getBucketItemApiIntegration = new apigw.AwsIntegration({
      service: "s3", 
      region:'us-east-1', 
      path: s3ApiBucket.bucketName+'/{object}',
      integrationHttpMethod: "GET", 
      options: {
        credentialsRole: this.apiGatewayRole, 
        passthroughBehavior: apigw.PassthroughBehavior.WHEN_NO_TEMPLATES, 
        requestParameters: {
          'integration.request.path.bucket': 'method.request.path.folder', 
          'integration.request.path.object': 'method.request.path.item',
          'integration.request.header.Accept': 'method.request.header.Accept'
        }, 
        integrationResponses: [          
            {
              statusCode: '200', 
              responseParameters: { 
                'method.response.header.Date': 'integration.response.header.Date',
                'method.response.header.Content-Length': 'integration.response.header.Content-Length', 
                'method.response.header.Content-Type': 'integration.response.header.Content-Type'
              }

          }
        ]
      }
    });

    bucketItemResource.addMethod('GET', getBucketItemApiIntegration, 
      { 
        authorizationType: apigw.AuthorizationType.IAM, 
        requestParameters: {
          'method.request.path.folder': true,
          'method.request.path.item': true, 
          'method.request.header.Accept': true
        }, 
        methodResponses: [
          {
            statusCode: '200', 
            responseParameters: 
              {
                'method.response.header.Content-Type': true,
                'method.response.header.Date': true, 
                'method.response.header.Content-Length': true
              }
          }
        ]
      }
    );

    const putBucketItemApiIntegration = new apigw.AwsIntegration({
      service: "s3", 
      region:'us-east-1', 
      path: s3ApiBucket.bucketName+'/{object}',
      integrationHttpMethod: "PUT", 
      options: {
        credentialsRole: this.apiGatewayRole, 
        passthroughBehavior: apigw.PassthroughBehavior.WHEN_NO_TEMPLATES, 
        requestParameters: {
          'integration.request.path.bucket': 'method.request.path.folder', 
          'integration.request.path.object': 'method.request.path.item',
          'integration.request.header.Accept': 'method.request.header.Accept'
        }, 
        integrationResponses: [          
            {
              statusCode: '200', 
              responseParameters: { 
                'method.response.header.Date': 'integration.response.header.Date',
                'method.response.header.Content-Length': 'integration.response.header.Content-Length', 
                'method.response.header.Content-Type': 'integration.response.header.Content-Type'
              }

          }
        ]
      }
    });

    bucketItemResource.addMethod('PUT', putBucketItemApiIntegration, 
      { 
        authorizationType: apigw.AuthorizationType.IAM, 
        requestParameters: {
          'method.request.path.folder': true,
          'method.request.path.item': true, 
          'method.request.header.Accept': true,
          'method.request.header.Content-Type': true
        }, 
        methodResponses: [
          {
            statusCode: '200', 
            responseParameters: 
              {
                'method.response.header.Content-Type': true,
                'method.response.header.Date': true, 
                'method.response.header.Content-Length': true
              }
          }
        ]
      }
    );

  }
}

module.exports = { CdkS3ApiStack }