import { Authenticator, useTheme, View } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import Image from "next/image";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
      userPoolClientId:
        process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
    },
  },
});

const components = {
  Header() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Image
          src="https://s3-inventorym.s3.eu-central-1.amazonaws.com/logo.png"
          alt="inventory-logo"
          width={50}
          height={50}
          className="rounded-md object-cover"
        />
      </View>
    );
  },
};

const AuthProvider = ({ children }: any) => {
  return (
    <div className="mt-5">
      <Authenticator hideSignUp={true}>
        {({ user }: any) =>
          user ? <div>{children}</div> : <h1>Please Sign In Below:</h1>
        }
      </Authenticator>
    </div>
  );
};

export default AuthProvider;
