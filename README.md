# Discord Role Trial

A small and minimal discord bot to create trial roles with invites.

## What ...?

The bot creates invite links and basically connects them to a role. If a user joins your server over a trial invite link, he will get the specified role assigned.
If you want to stop the trial for all users with that role, the bot will remove those roles over a command


### Prerequisites

This bot was created using node.js, if you don't know node: [Install node.js!](https://nodejs.org/en/, "Install Node.js")


## Getting Started

1. Clone the repository
2. [Create a Discord bot](https://discordapp.com/developers/applications/ "Discord's Developer page") and also add it to your server!
3. Insert your Bot Token into config.json 
4. ```npm install```
5. ```npm start```
6. Create a role (Or use an existing one which doesn't get auto-assigned when joining the server)
7. ```$createTrial role_name```
8. Join over the new invite link
9. The user now got the specified role!
10. ```$stopTrial trial_id``` if you want to remove the trial roles
### Commands


Create a trial with given rolename. The role must already exist, the invitelink will be unique and generated

```$createTrial role_name```


Print all active trials

```$showTrials```


Will stop the trial and remove the specified role from **every** user

```$stopTrial trial_id```


## Contributing

Contributing is more than welcome! 
1. Fork the repository
2. Create a new branch 
3. Implement/fix whatever you want
4. Make sure to use Eslint!
5. Open a pull request:)

## Planned additions:
+ Save trials to a file
+ Only let specific roles / channels use this command
+ Auto Stop the Trial after a specified time
+ Error handling / Logging
+ Only delete the role of users who joined over the invite link
## Authors

* **Jonas Scholz** - [Code42Cate](https://github.com/Code42Cate)

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used:D
* [Discord Invite Tracking](https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/coding-guides/tracking-used-invites.md)