#!/usr/bin/env node

const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const inquirer = require("inquirer");
const clui = require("clui");
const util = require("lodash/util");
const player = require("play-sound")((opts = {}));
const ProgressBar = require("progress");

function format_time(seconds) {
  var date = new Date(0);
  date.setSeconds(seconds);
  var timeString = date.toISOString().substr(11, 8);
  return timeString;
}

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
      default: 0,
      choices: util.range(1, 121),
      message: "Select meditation length (min.):",
    },
    {
      name: "interval",
      type: "list",
      default: "None",
      choices: util.range(1, 31).concat("None", "Middle"),
      message: "Select interval timer (min.):",
    },
  ];
  return inquirer.prompt(questions);
}

function setBar(results, finish) {
  return new ProgressBar(
    `:my_time  :bar  Finish: ${finish.toTimeString().slice(0, 5)}`,
    {
      complete: "=",
      head: ">",
      incomplete: " ",
      width: 60,
      total: results.minutes * 60,
    }
  );
}

function setTimer(bar, finish, interval) {
  setInterval(function () {
    bar.tick({
      my_time: format_time(bar.curr),
      finish: finish,
    });

    if (bar.complete) {
      clearInterval(this);
      player.play("bell1.mp3", function (err) {
        if (err) throw err;
      });
    }

    if (interval && bar.curr > 0 && !bar.complete) {
      if (bar.curr % interval == 0) {
        player.play("bell2.mp3", function (err) {
          if (err) throw err;
        });
      }
    }
  }, 1000);
}

async function run() {
  const results = await askTimer();

  console.log();
  player.play("bell1.mp3", function (err) {
    if (err) throw err;
  });

  var now = new Date();
  var finish = new Date(now.setMinutes(now.getMinutes() + results.minutes));

  var interval;

  switch (results.interval) {
    case "None":
      interval = null;
      break;
    case "Middle":
      interval = (results.minutes / 2) * 60;
      break;
    default:
      interval = results.interval * 60;
      break;
  }

  var bar = setBar(results, finish);
  var timer = setTimer(bar, finish, interval);
}

run();
