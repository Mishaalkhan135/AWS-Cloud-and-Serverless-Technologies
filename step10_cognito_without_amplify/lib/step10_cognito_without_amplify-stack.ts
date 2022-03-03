import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Step10CognitoWithoutAmplifyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const userPool = new cognito.UserPool(this, "myUserPools", {
      selfSignUpEnabled: true,//user can signIn by himself
      userVerification: {
        emailSubject: "Verify your email for our awesome app!",
        emailBody:
          "Hello, Thanks for signing up to our awesome app! Your verification code is {####}",
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },
      //the user has to add these to signin
      signInAliases: {
        username: true,
        email: true,
      },
      autoVerify: { email: true },
      signInCaseSensitive: false,
      standardAttributes: {
        fullname: {
          required: true,
          mutable: true,//can be changed
        },
        email: {
          required: true,
          mutable: false,//can't be changed once done
        },
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY, //recovery settings for the email
    });

    const client = new cognito.UserPoolClient(this, "app-client", {
      userPool: userPool,
      generateSecret: true,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL],
        callbackUrls: [`http://localhost:8000/dashboard`],
        logoutUrls: [`http://localhost:8000`],
      },
    });

    const domain = userPool.addDomain("CognitoDomain", {
      cognitoDomain: {
        domainPrefix: "mishaal-app",
      },
    });

    const signInUrl = domain.signInUrl(client, {
      redirectUri: `http://localhost:8000/dashboard`, // must be a URL configured under 'callbackUrls' with the client
    });
  }
}
