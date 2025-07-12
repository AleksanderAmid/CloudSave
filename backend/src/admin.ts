#!/usr/bin/env ts-node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import db, { runMigrations } from "./db";
import { hashPassword } from "./utils/auth";

runMigrations();

const argv = yargs(hideBin(process.argv))
  .command("list", "List all users")
  .command("add <username> <quota>", "Add new user", (y) =>
    y.positional("username", { type: "string" }).positional("quota", { type: "number" })
  )
  .command("quota <id> <quota>", "Set quota for user id", (y) =>
    y.positional("id", { type: "number" }).positional("quota", { type: "number" })
  )
  .command("reset-password <id>", "Reset password for user id", (y) =>
    y.positional("id", { type: "number" })
  )
  .demandCommand()
  .help().argv as any;

const cmd = argv._[0];

switch (cmd) {
  case "list": {
    const users = db.prepare("SELECT id, username, quota_mb, used_mb, role, status FROM users").all();
    console.table(users);
    break;
  }
  case "add": {
    const { username, quota } = argv;
    db.prepare("INSERT INTO users (username, quota_mb, role) VALUES (?, ?, 'user')").run(username, quota);
    console.log("User added");
    break;
  }
  case "quota": {
    const { id, quota } = argv;
    db.prepare("UPDATE users SET quota_mb = ? WHERE id = ?").run(quota, id);
    console.log("Quota updated");
    break;
  }
  case "reset-password": {
    const { id } = argv;
    db.prepare("UPDATE users SET password_hash = NULL WHERE id = ?").run(id);
    console.log("Password reset. User must set a new password on next login.");
    break;
  }
  default:
    console.error("Unknown command");
} 