#!/usr/bin/env node

const request = require('request');
const parseXML = require('xml2js').parseString;
const chalk = require('chalk');
const readline = require('readline');
const fs = require('fs');
const opn = require('opn');
const config = require('./config.json');

const option = process.argv[2];

const help = `

 ${chalk.yellow.bold('---------------BITnet Help---------------')}

 ${chalk.bold('Command')}\t\t${chalk.bold('Function')}

 bitnet help\t\tview all bitnet commands
 bitnet config\t\tsave login credentials
 bitnet login\t\tlogin to cyberoam
 bitnet li\t\tshort for 'bitnet login'
 bitnet logout\t\tlogout from cyberaom
 bitnet lo\t\tshort for 'bitnet logout'
`;

switch (option) {

    case 'li':
    case 'login':
        login();
        break;

    case 'lo':
    case 'logout':
        logout();
        break;
    
    case 'config':
        configFunc();
        break;
    
    case 'help': 
        console.log(help);
        break;
    
    default: 
        console.log(chalk.red.bold('\n\t\tInvalid command!\n'));
        console.log(chalk.yellow.bold(`Run 'bitnet help' to see the list of available commands.\n`));
        break;
}


function login() {
    if (config.username && config.password) {
        request.post({
            url: config.loginURL,
            rejectUnauthorized : false,
            form: {
                mode: '191',
                password: config.password,
                username: config.username,
                a: '1519891235551',
                producttype: '0'
            }
        }, (err, res, body) => {
            if (err) {
                console.log(chalk.red.bold(`\nAn error occured. Please check your network connection.\n`));
            } else {
                parseXML(res.body, (err, data) => {
                    if(data.requestresponse.status[0] === 'LIVE') {
                        console.log(chalk.green.bold(`\n\t${ data.requestresponse.message[0] }.\n`));
                        if (config.siteURLs.length) {
                            config.siteURLs.forEach(site => {
                                opn(site, { wait: false });
                            });
                        }
                    } else {
                        console.log(chalk.red.bold(`\n\t${ data.requestresponse.message[0] }.\n`));
                        console.log(chalk.yellow.bold(`Try resetting your credentials with 'bitnet config'.\n`));
                    }
                });
            }
        })
    } else {
        console.log(chalk.red.bold('\n\t\tUsername or password not found!\n'));
        console.log(chalk.yellow.bold(`Please save your credentials by running 'bitnet config' to login.\n`));
    }
}

function logout() {
    if(config.username && config.password) {
        request.post({
            url: config.logoutURL,
            rejectUnauthorized : false,
            form: {
                mode: '193',
                username: config.username,
                a: '1519891235551',
                producttype: '0'
            }
        }, (err, res, body) => {
            if (err) {
                console.log(chalk.red.bold(`\nAn error occured. Please check your network connection.\n`));
            } else {
                parseXML(res.body, (err, data) => {
                    if(data.requestresponse.status[0] === 'LOGIN') {
                        console.log(chalk.green.bold(`\n\t${data.requestresponse.message[0]}.\n`));
                    } else {
                        console.log(chalk.red.bold(`\n\t${data.requestresponse.message[0]}.\n`));
                        console.log(chalk.yellow.bold(`Try resetting your credentials with 'bitnet config'.\n`));
                    }
                });
            }
        });
    } else {
        console.log(chalk.red.bold('\n\t\tUsername or password not found!\n'));
        console.log(chalk.yellow.bold(`Please save your credentials by running 'bitnet config' to login.\n`));
    }
}


function configFunc() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.stdoutMuted = true;

    rl._writeToOutput = function _writeToOutput(stringToWrite) {
        if (!rl.stdoutMuted)
          rl.output.write("*");
        else
          rl.output.write(stringToWrite);
    };

    rl.question('Enter cyberoam username: ', (username) => {
        config.username = username;
        rl.query = 'Enter password: ';
        rl.setPrompt('Enter Password: ');
        rl.prompt(true);
        rl.stdoutMuted = false;
        rl.on('line', (password) => {
            config.password = password;
            rl.stdoutMuted = true;
            rl.question('Enter default website URLs seperated by space (example - https://facebook.com https://google.com): ', (sites) => {
                config.siteURLs = [];
                const sitesArray = sites.split(' ');
                sitesArray.forEach(site => {
                    config.siteURLs.push(site);
                });
                fs.writeFile(__dirname + '/config.json', JSON.stringify(config, null, 4), 'utf8', (err) => {
                    if (err) {
                        console.log('\n' + err);
                        console.log(chalk.red.bold('\n\tError saving details. Please check permissions.\n'));
                    } else {
                        console.log(chalk.green.bold(`\n\t\tDetails saved successfully!\n`));
                        console.log(chalk.yellow.bold(`Run 'bitnet login' or 'bitnet li' to log into cyberoam.\n`));
                    }
                    rl.close();
                });
            })
        });
    });
} 

