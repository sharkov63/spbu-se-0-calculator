# Calculator

# Usage

## Prerequisites

* No prerequisits for backend service: gradle wrapper will automatically download everything.
* For frontend, you need to download Node.js. Here is [official instructions](https://nodejs.org/en/download/package-manager).
* Then you need to install all dependencies for frontend. You can do it by
  ```bash
  cd frontend/calculator
  npm install
  ```

## Launch backend

First, launch the backend calculator service. You can do this with Gradle integration in your favorite Kotlin IDE, or with the following command:
```bash
cd backend
./gradlew bootRun
```

(On windows, use `gradlew.bat` instead.)

Now the backend service is launched on localhost and listens at port `8080`.

## Launch frontend

Next, launch the frontend:
```bash
cd frontend/calculator
npm start
```

Now you can open `localhost:3000` and use the calculator app!