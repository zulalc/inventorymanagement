import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
      userPoolClientId:
        process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
    },
  },
});

const AuthProvider = ({ children }: any) => {
  return (
    <div className="mt-5">
      <Authenticator>
        {({ user }: any) =>
          user ? <div>{children}</div> : <h1>Please Sign In Below:</h1>
        }
      </Authenticator>
    </div>
  );
};

export default AuthProvider;
