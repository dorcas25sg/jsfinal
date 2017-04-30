# jsfinal
Final Project for CPLN-692 / MUSA-611 JavaScript Programming for Planners and Designers

### How to run D3 (Javascript) locally from your computer

In general, you can use any standard text editor to write Javascript code. You only have to open it with your browser to run the code. For example, to run the [circle-example.html](https://github.com/MUSA-620-Fall-2017/d3/blob/master/circle-example.html) file in this repo, you only have to download it and open it in Chrome.

The only issue with running Javascript locally is when the Javascript needs to load an external file. For example, the animated taxi pickup map needs to load nyctaxipickups.geojson. For security reasons, Javascript cannot load files directly from your hard drive. Here are two ways of getting around this issue.

**Solution 1**: Download a [Javascript IDE](http://ourcodeworld.com/articles/read/200/top-7-best-free-web-development-ide-for-javascript-html-and-css) and run your Javascript code from there.

**Solution 2**: Start up a local server manually
- Save the nyc-taxi-pickups.html and nyctaxipickups.geojson files to the same folder on your computer.
- From the command line, navigate to that directory and enter "python -m SimpleHTTPServer 8000"
- Now you will be able to run the file by typing this into your browser: http://localhost:8000/nyc-taxi-pickups.html
