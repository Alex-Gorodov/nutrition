import { getAuth } from "firebase/auth";

export function checkAuthMethod(): Promise<string> {
  const auth = getAuth();

  return new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User ID:", user.uid);

        const provider = user.providerData[0]; // Берём первого провайдера
        if (provider) {
          switch (provider.providerId) {
            case "password":
              console.log("User signed in with Email/Password.");
              resolve("password");
              break;
            case "google.com":
              console.log("User signed in with Google.");
              resolve("Google");
              break;
            default:
              console.log("User signed in with another provider:", provider.providerId);
              resolve("another");
              break;
          }
        } else {
          resolve("unknown provider");
        }
      } else {
        console.log("No user is signed in.");
        resolve("no user");
      }
    });
  });
}
