export default ({ config }) => {
    return {
      ...config,
      name: "Greenly",
      slug: "Greenly",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./img/Logo.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./img/Logo.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      assetBundlePatterns: [
        "**/*"
      ],
      ios: {
        supportsTablet: true,
        infoPlist: {
          NSCameraUsageDescription: "This app uses the camera to take profile pictures.",
          NSPhotoLibraryUsageDescription: "This app accesses the photo library for profile pictures."
        },
        bundleIdentifier: "com.vigu.Greenly"
      },
      android: {
        jsEngine: "hermes",
        adaptiveIcon: {
          foregroundImage: "./img/Logo.png",
          backgroundColor: "#FFFFFF"
        },
        permissions: [
          "CAMERA",
          "READ_EXTERNAL_STORAGE",
          "WRITE_EXTERNAL_STORAGE",
          "INTERNET",
          "NOTIFICATIONS"
        ],
        package: "com.vigu.Greenly",
        networkSecurityConfig: "./network_security_config.xml"
      },
      web: {
        favicon: "./img/LogoGood.png"
      },
      plugins: [
        "expo-secure-store",
        "expo-build-properties",
        "expo-font"
      ],
      extra: {
        eas: {
          projectId: "c5467638-511f-433c-8bee-54a646947a68"
        }
      },
      "expo-build-properties": {
        "android": {
          "networkSecurityConfig": "./network_security_config.xml"
        }
      }
    };
  };