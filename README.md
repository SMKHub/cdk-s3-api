# Build AWS API Gateway Rest API using AWS Service Integration with S3 Buckets 

We will build an API to List objects in S3 bucket, Download Ojbect file from S3 bucket and Upload Object file into S3 bucket using direct service integration from API Gateway. 

This is built using AWS CDK to provision our infrastructure, and JavaScript as the programming language.

Services Build as part of this Stack are 

**Rest API Gateway**
Rest API Gw with EDGE optimised endpoint and supporting Binary media types. The binary payload can be, for example, a JPEG file, a GZip file, or an XML file. Since we are integrating with S3 we need to define this parameter in API defination. 

**S3 Bucket**
S3 bucket with which API GW will be integrated through proxy service integration. 

**IAM Role**
For API GW to integrate with S3 we are using already created IAM Role with sample name "APIGatewayS3ProxyPolicy"

**AWS Service Integration**
Define AWS Service integration and add methods. 

**Endpoint**
Following API operations will be allowed through deployed API Gw endpoint 

* GET: /{bucketName} to list objects in a bucket
* GET: /{bucketName}/{fileName} to get/download a given file
* PUT: /{bucketName}/{fileName} to upload a file to the specified bucket.



## Useful commands

* `npm run test`         perform the jest unit tests
* `npx cdk deploy`       deploy this stack to your default AWS account/region
* `npx cdk diff`         compare deployed stack with current state
* `npx cdk synth`        emits the synthesized CloudFormation template
