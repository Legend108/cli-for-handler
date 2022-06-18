const child_process = require("node:child_process");
const path = require("path");
const fs = require("fs");
const inquirer = require("inquirer");
const chalk = require("chalk");
const config = require("../config");

let jsonCommandsTemplate = {
  commands: "/commands",
  events: "/events",
  root: process.cwd(),
};

module.exports = async () => {
  const valueInq = await inquirer.prompt([
    {
      type: "string",
      name: "text",
      message: "Project Name: ",
    },
  ]);

  const valueInq2 = await inquirer.prompt([
    {
      type: "string",
      name: "token",
      message: "Bot Token: ",
    },
  ]);

  const valueInq3 = await inquirer.prompt([
    {
      type: "string",
      name: "clientID",
      message: "Client ID: ",
    },
  ]);

  const input = valueInq.text;
  const token = valueInq2.token;
  const clientID = valueInq3.clientID;

  if (typeof input !== "string" || input.length == 0) {
    return console.log("Invalid project name");
  }

  if (typeof token !== "string" || token.length == 0) {
    return console.log("Invalid token");
  }

  if (typeof clientID !== "string" || clientID.length == 0) {
    return console.log("Invalid client ID");
  }

  child_process.exec("git --version", (err, out) => {
    if (err) {
      return console.error(chalk.bgRed("\n" + error));
    } else if (out) {
      console.log(
        chalk.bgGreen("\nFound git, version", out.replace("git version", ""))
      );
    }
  });

  const processToExec = "git clone " + config.gitRepo + " " + input;

  child_process.exec(processToExec, (err, out) => {
    if (err) {
      console.error(chalk.bgRed("An error occured while cloning repo: ", err));
    } else {
      console.log(
        chalk.bgGreen("Cloning git repo into " + input + " completed")
      );

      nextStep(input, token, clientID);
    }
  });
};

function nextStep(input, token, clientID) {
  try {
    const appConfigPath = path.join(process.cwd(), input, "config", "index.js");
    const appConfig = require(appConfigPath);

    // Was kind of in a hurry, will fix this soon.
    fs.writeFileSync(
      appConfigPath,
      `
module.exports = {
    commands: "/commands",
    events: "/events",
    root: process.cwd(),
    token: "${token}",
    clientID: "${clientID}"
}`
    );

    console.log(chalk.bgGreen("\nSuccesfully updated config file."));

    console.log(
      chalk.blue("\nType cd " + input + " && npm install to install packages")
    );

    console.log(chalk.blue("\nnpm run start to get started!"));

    console.log(chalk.blue("\nHappy coding!"));
  } catch (error) {
    console.error(error);
    console.error(
      chalk.bgRed("Oops, an unknown error occured while updating config file")
    );
  }
}
