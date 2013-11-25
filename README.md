Falco
=======

I made a Twitter client. Well, I've started a Twitter client. We shall see how far I take it.

[![Packages](https://david-dm.org/tivac/falco/status.png)](https://david-dm.org/tivac/falco/)
[![Dev Packages](https://david-dm.org/tivac/falco/dev-status.png)](https://david-dm.org/tivac/falco/)


## Features ##

* It auths against Twitter
* It shows some timelines
* It streams updates to timelines
* It's pretty ugly still

## Install ##

1. `git clone git://github.com/tivac/falco.git`
2. `npm i`
3. `grunt`

## Develop ##

1. Fork, clone locally
1. `npm i`
1. Create a Twitter App
1. Copy `/config/default.js` to `/config/development.js` & add your consumer key/secret
1. `grunt yui template` to build required files
1. `grunt` will launch the app, use `grunt debug` if you want to open the developer tools.

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
