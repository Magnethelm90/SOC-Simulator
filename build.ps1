npm run build
npx cap sync android
cd android
.\gradlew assembleDebug
cd ..
Copy-Item .\android\app\build\outputs\apk\debug\app-debug.apk -Destination .\soc-simulator.apk -Force
