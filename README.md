Falco
=======

I made a Twitter client. Well, I've started a Twitter client. We shall see how far I take it.

[![Packages](https://david-dm.org/tivac/falco/status.png)](https://david-dm.org/tivac/falco/)
[![Dev Packages](https://david-dm.org/tivac/falco/dev-status.png)](https://david-dm.org/tivac/falco/)

![Client Screenshot](http://tivac.com/images/falco.png)

## Features ##

- [x] Auths against Twitter
- [x] Shows your home timeline
- [x] Shows your mentions timeline
- [x] Shows your saved lists
- [x] Shows your saved searches
- [x] Retweet tweets
- [ ] Compose tweets
- [ ] Doesn't look like a programmer designed it
- [ ] Isn't full of [Issues](https://github.com/tivac/falco/issues?state=open)

## Install ##

1. `git clone git://github.com/tivac/falco.git`
1. `npm i`
1. `npm i -g dullard`
1. `dullard`

## Develop ##

1. Fork, clone locally
1. `npm i`
1. `npm i -g dullard`
1. Create a Twitter App
1. Copy `/config/default.js` to `/config/development.js` & add your consumer key/secret
1. `dullard yui-configger compile-templates launch` to build required files & launch app
    
    `dullard debug` will build required files & launch the app with the developer tools open.

All build steps run through Grunt.

## License ##

```
Copyright (c) 2013 Patrick Cavit

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

Also available in LICENSE.txt
