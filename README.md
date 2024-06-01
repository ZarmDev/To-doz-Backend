# To-doz-Backend
NOTE: This is all experimental, I am just having fun so if you actually
deploy this be careful.
EVEN MORE IMPORTANT: To-doz-React does not currently support adding
databases, so even if you deploy it, it won't help you.
# Different servers
There is two ways to deploy this but the only way that works now is
the "Setup - Normal" way.
# Credits
The code uses a significant portion of the "API Design" course code from Frontendmasters
https://github.com/Hendrixer/api-design-v4-course

I only modified it to add some changes.
# Setup - Normal
Add the env variables:
Please make the SUPER_SECRET_TOKEN very long and random
```
ORIGIN_SITE="https://zarmdev.github.io/To-doz-React/"
SUPER_SECRET_TOKEN="putanyvalueyouwant"
```
Don't change user.ts

Deploy the server normally.

# Deployment
You can deploy this on Microsoft Azure App Services (Only 1 hour a day), Vercel (maybe? I think it doesn't work), Netlify (Need verification), Heroku (Requires card verification)

# About the Experimental way (JWT tokens)
This is meant for deploying a "production" database where there is
multiple users, but obviously there are many flaws in it.
Problems I found:
- I don't know how to do security very well
- Might be slow
- Doesn't have error handling - so will crash in many cases
- Passwords can be brute forced

# Setup - JWT tokens (Experimental, still working on it)
Add the env variables: (I kinda have no idea what I'm doing)
```
ORIGIN_SITE="https://zarmdev.github.io/To-doz-React/"
JWT_TOKEN="putanylongvalueyouwant"
```
Uncomment // import db from '../server' in user.ts and comment the line
below it

When you deploy your server, make sure it runs npm run startExperimental
If you can't get it to do that, you can also switch up the commands to
have npm run start do the startExperimental command

# Other Notes
Don't try to change your server from secure server to JWT tokens,
it will probably break it.
