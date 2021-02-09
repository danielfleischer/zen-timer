const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const inquirer = require("inquirer");
const util = require('lodash/util');

clear();

console.log(
  chalk.yellow(figlet.textSync("Meditation", { horizontalLayout: "fitted" }))
);

function askTimer() {
  const questions = [
    {
      name: "minutes",
      type: "list",
      default: 29,
      choices: util.range(1,121),
      message: "Select meditation length:",
    },
    {
        name: "bell",
        type: "list",
        default: "middle",
        choices: util.range(1,21).concat("middle"),
        message: "Select interval timer:",
      }
  ];
  return inquirer.prompt(questions);
}

const run = async () => {
  const results = await askTimer();
  console.log(results)
};

run();
