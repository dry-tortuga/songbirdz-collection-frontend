# SongBirdz Front-End

This project contains the front-end application for the SongBirdz NFT collection.

You can find the back-end contract and server [here](https://github.com/dry-tortuga/songbirdz-collection-backend).

# ReactJS (Application)

The `./src` folder contains all logic related to the front-end application for the NFT collection.

The pages for the application are:

- `/` -> The home page.

- `/about` -> An about page describing the project.

- `/collection` -> A listing page for all birds in the NFT collection.

- `/collection/:id` -> Details page for an individual bird in the NFT collection.

The application requires an active connection to a web3 wallet in order to view and interact with the NFT. It currently supports only MetaMask and Coinbase Wallet.

## Requirements

Make sure that you have already completed the [setup](https://github.com/dry-tortuga/songbirdz-collection-backend/tree/main#setup) steps for the back-end server and NFT contract.

## Setup

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/) (Node.js version >= 16.18.0 required)

2. Clone this repository

3. Navigate into the project directory

	```bash
	$ cd songbirdz-collection-frontend
	```

4. Install the requirements

	```bash
	$ npm install
	```

5. Make a copy of the example environment variables file

	On Linux systems: 
	```bash
	$ cp .env.example .env.development
	```
	On Windows:
	```powershell
	$ copy .env.example .env.development
	```

6. Start the application on your local machine at https://localhost:3000

	```bash
	$ npm run start
	```

You should now be able to view the front-end application at https://localhost:3000!

The page will reload when you make changes.

You may also see any lint errors in the console.

## Deploying to Testnet

- [x] Ensure `.env.staging` file includes the appropriate values
- [x] Build the distribution files for staging via `npm run build:staging`
- [x] Commit the distribution files in `./static-staging` to git
- [x] Deploy the front-end application to gcloud/aws/azure/etc.
- [x] Serve the distribution files via steps here: https://create-react-app.dev/docs/deployment/
- [x] Navigate to https://songbirdz.cc and verify that the application is working!

## Deploying to Production

- [x] Ensure `.env.production` file includes the appropriate values
- [x] Build the distribution files for production via `npm run build:production`
- [x] Deploy the front-end application to gcloud/aws/azure/etc.
- [x] Serve the distribution files via steps here: https://create-react-app.dev/docs/deployment/
- [x] Navigate to https://songbirdz.cc and verify that the application is working!
- [x] Verify that SSL certificate is up-to-date

## NPM Commands

### `npm run build:staging`

Builds the app for the staging environment to the `static-staging` folder.

It correctly bundles React in production mode, optimizes the build for the best performance, and pulls in settings via the `.env.staging` file. The build is minified and the filenames include the hashes.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run build:production`

Builds the app for the production environment to the `static-production` folder.

It correctly bundles React in production mode, optimizes the build for the best performance, and pulls in settings via the `.env.production` file. The build is minified and the filenames include the hashes.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run test`

**NOTE: there is no test code for the front-end application as of now.**

### `npm run eject`

**NOTE: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## How to Use Create React App

1. [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started).

2. [Code Splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

3. [Analyzing the Bundle Size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

4. [Making a Progressive Web App](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

5. [Advanced Configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

6. [Deployment](https://facebook.github.io/create-react-app/docs/deployment)
