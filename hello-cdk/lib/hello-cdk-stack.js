const cdk = require('aws-cdk-lib');
const { Stack, StackProps } = require('aws-cdk-lib');
const { Bucket } = require('aws-cdk-lib/aws-s3');

class HelloCdkStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const existingBucketName = 'react-image-upload-ivsir';
    const existingBucket = Bucket.fromBucketName(this, 'ExistingBucket', existingBucketName);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'HelloCdkQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });
  }
}

module.exports = { HelloCdkStack }
