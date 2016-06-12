#Tesselbox

##Share files over a LAN from a USB drive using the Tessel 2

_slides for presentation at refresh austin are at [this repo]()_

##Setup

- Clone the project and navigate to its root directory.
- Plug your T2 into a power source and wait for it to boot up. Maybe drink some water while you're waiting?
- Run `npm run launch` from  the root directory to turn on the Tessel's access point capabilities.

##Dev
- After following the Setup instructions...
- Run `npm run t2` to load the `webserver.js` file into the T2's RAM and ready it for testing. You should be able to visit [http://192.168.1.101:8080](http://192.168.1.101:8080) in your browser.
- When you're ready to deploy, `npm run deploy` to get your code onto your T2.
