Comparating
===========

Better rating through comparison

## Setup

Install Meteor:

    $ curl https://install.meteor.com | /bin/sh

Clone the app's source code:

    $ git clone https://github.com/xavieralexandre/comparating.git comparating_app_directory

Configure the app locally:

    $ cd comparating_app_directory
    $ npm install -g meteorite
    $ mrt add router

Run the app locally:

    $ meteor

## Deployment

Deploy it on meteor.com free hosting

    $ meteor deploy comparating.meteor.com
    
## Dataset change

To modify items to be rated, edit the hardcoded array defined in server/fixtures.js file, then reset the project's database:

    $ meteor reset
