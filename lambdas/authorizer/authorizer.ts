import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from "aws-lambda";
const jwt = require("jsonwebtoken");

export const handler = async (event: APIGatewayTokenAuthorizerEvent) => {
  try {
    const token = event.authorizationToken.split(" ")[1];

    const payload = jwt.verify(token, process.env.SECRET_KEY, {
      algorithms: ["HS256"],
    });

    const principalId: string = payload.sub || "user";

    return generatePolicy(principalId, "Allow", event.methodArn);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Token validation failed:", error.message);
      throw new Error("Unauthorized");
    }
  }
};

function generatePolicy(principalId: string, effect: "Allow" | "Deny", resource: string): APIGatewayAuthorizerResult {
  return {
    principalId: principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
}
