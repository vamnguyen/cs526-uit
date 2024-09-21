import {
  StartOAuthFlowParams,
  StartOAuthFlowReturnType,
} from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";

import { fetchAPI } from "@/lib/fetch";

export const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.log("SecureStore set item error: ", err);
      return;
    }
  },
};

export const googleOAuth = async (
  startOAuthFlow: (
    startOAuthFlowParams?: StartOAuthFlowParams,
  ) => Promise<StartOAuthFlowReturnType>,
) => {
  try {
    const { createdSessionId, setActive, signUp, signIn } =
      await startOAuthFlow({
        redirectUrl: Linking.createURL("/(root)/(tabs)/home"),
      });

    if (createdSessionId) {
      if (setActive) {
        await setActive({ session: createdSessionId });

        if (signUp?.createdUserId) {
          await fetchAPI("/(api)/user", {
            method: "POST",
            body: JSON.stringify({
              firstName: signUp.firstName,
              lastName: signUp.lastName,
              email: signUp.emailAddress,
              clerkId: signUp.createdUserId,
            }),
          });
        } else if (signIn?.createdSessionId) {
          await fetchAPI("/(api)/user", {
            method: "POST",
            body: JSON.stringify({
              firstName: signIn.userData.firstName,
              lastName: signIn.userData.lastName,
              email: signUp?.emailAddress,
              clerkId: signUp?.createdUserId,
            }),
          });
        }

        return {
          success: true,
          code: "success",
          message: "You have successfully signed in with Google",
        };
      }
    }

    return {
      success: false,
      message: "An error occurred while signing in with Google",
    };
  } catch (err: any) {
    console.error(err);
    return {
      success: false,
      code: err.code,
      message: err?.errors[0]?.longMessage,
    };
  }
};
