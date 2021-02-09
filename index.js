#!/usr/bin/env node

const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const inquirer = require("inquirer");
const clui = require("clui");
const util = require("lodash/util");

clear();

console.log(
  chalk.cyanBright(
    figlet.textSync("Meditation", { horizontalLayout: "fitted" })
  )
);

function askTimer() {
  const questions = [
    {
      name: "minutes",
      type: "list",
      default: 29,
      choices: util.range(1, 121),
      message: "Select meditation length:",
    },
    {
      name: "bell",
      type: "list",
      default: "middle",
      choices: util.range(1, 21).concat("middle"),
      message: "Select interval timer:",
    },
  ];
  return inquirer.prompt(questions);
}

var ProgressBar = require("progress");

function format_time(seconds) {
  var date = new Date(0);
  date.setSeconds(seconds);
  var timeString = date.toISOString().substr(11, 8);
  return timeString;
}

const run = async () => {
  const results = await askTimer();
  console.log();

  var now = new Date();
  var finish = new Date(now.setMinutes(now.getMinutes() + results.minutes));

  var bar = new ProgressBar(`:my_time  :bar  Finish: ${finish.toTimeString().slice(0,5)}`, {
    complete: "=",
    head: ">",
    incomplete: " ",
    width: 60,
    total: results.minutes * 60,
  });

  var timer = setInterval(function () {
    bar.tick({ 
      my_time: format_time(bar.curr),
      finish: finish
    });
    if (bar.complete) {
      clearInterval(timer);
    }
  }, 1000);

  //   console.log(thisProgressBar.update(1,2));
};

run();
