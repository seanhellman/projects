
### Useful deploy steps
```
yarn build
docker build -t frontend .
docker tag frontend gcr.io/ubc-sea-projects/allyship-frontend
docker push gcr.io/ubc-sea-projects/allyship-frontend
kubectl delete service,deployment allyship-frontend
kubectl apply -f frontend.yaml
```


```
cloud config list account —-format “value(core.account)"   
history | grep apply 
yarn build
docker build -t frontend .
kubectl apply -f frontend.yaml
kubectl delete service,deployment allyship-frontend
docker exec -it 4d38c16dd848 /bin/sh
docker run -d -p 8020:80 frontend
docker container kill $(docker ps -q)
kubectl get pods
kubectl get services
kubectl get deployment
kubectl get 
docker rmi xxx -f
gcloud container clusters get-credentials allyship-cluster --region northamerica-northeast1-a
cloud config list account —format "value(core.account)"
```
```
yarn build
docker build -t frontend .
docker run -d -p 8020:80 frontend
docker stop xxx
docker rm -f xxx
docker ps -a
kubectl apply -f frontend.yaml

docker tag frontend gcr.io/ubc-sea-projects/allyship-frontend
docker push gcr.io/ubc-sea-projects/allyship-frontend


docker tag frontend gcr.io/ubc-sea-projects/allyship-frontend
brew cask info google-cloud-sdk
gcloud auth configure-docker 
docker push gcr.io/ubc-sea-projects/allyship-frontend
kubectl apply -f frontend.yaml
kubectl stop -f allyship-frontend
kubectl delete service,deployment frontend
kubectl delete pods allyship-frontend-65c44d549c-9g5sp

frontend:
user type in username + password -> login -> send post request to Django API

backend:
Django receive POST request -> check username + password valid
   -> valid -> generate valid token -> return JSON {type: 200, token: xxxx}
   -> invalid -> return JSON {type: 400}

frontend:
receive POST result -> check type
   -> type = 200 -> log in user, store token in redux store
   -> type = 400 -> keep user logged out, let it re-login...
click a button -> update Django API -> api/xx/xxx?token=xxx

backend:
API update request -> check token
   -> valid -> update API return {type:200}
   -> invalid -> do nothing return {type:400}
```



# allyship-network-frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify