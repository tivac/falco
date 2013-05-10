## Intro ##

I made a Twitter client. Well, I've started a Twitter client. We shall see how far I take it.

## Features ##

* It auths against Twitter
* It shows some stuff in a really ugly way

## Install ##

1. `git clone git://github.com/tivac/node-webkit-chirrup.git`
2. `npm i`
3. `grunt`

## Develop ##

1. Fork, clone locally
2. `npm i`
3. `npm rm yui-configger`
4. Clone [https://github.com/tivac/yui-configger](https://github.com/tivac/yui-configger "YUI Configger") somewhere
5. `git co rethinking-everything`
6. `npm link`
7. Switch back to Tristis
8. `npm link yui-configger`
9. Create a Twitter App
10. Copy `/config/default.js` to `/config/development.js` & add your consumer key/secret
11. `grunt --help` lists available tasks
12. `grunt` will launch the app, use `grunt debug` if you want to open the developer tools.

All build steps run through Grunt. YUI Configger builds through grunt are broken right now so you'll need to run that manually. `yui-configger -r src\js -o src\js\_config.js` is all that is required.

## License ##

Tristis uses the MIT license, see the LICENSE.txt file.