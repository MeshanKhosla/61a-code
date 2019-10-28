import visualize from "./visualize.js";
import { tableFormat } from "./utils.js";
import preexisting from "./default_tables.js";
import { stderr, exit } from "./sqlWorker.js";

let sql;
let db;

export function init() {
    sql = SQL;
    db = newDatabase();
}

function newDatabase() {
    const newDb = new sql.Database();
    try {
        newDb.exec(preexisting);
    } catch (err) {
        // pass
    }
    return newDb;
}

export default async function execute(command) {
    if (command.startsWith(".")) {
        if (command.split(" ").length > 1) {
            return [`${command.split(" ")[0]} takes no arguments, on the web interpreter.`];
        }
        // dotcommand
        if (command === ".quit" || command === ".exit") {
            exit("\nSQL web worker terminated.");
            return [];
        } else if (command === ".help") {
            return [
                ".exit                  Exit this program\n"
                + ".help                  Show this message\n"
                + ".quit                  Exit this program\n"
                // eslint-disable-next-line max-len
                // + ".open                  Close existing database and reopen file to be selected\n"
                // + ".read                  Execute SQL in file to be selected\n"
                + ".tables                List names of tables\n"
                + ".schema                Show all CREATE statements",
            ];
        } else if (command === ".tables") {
            const dbRet = db.exec("SELECT name as Tables FROM sqlite_master WHERE type = 'table';");
            return [tableFormat(dbRet[0])];
        } else if (command === ".schema") {
            const dbRet = db.exec("SELECT (sql || ';') as `CREATE Statements` FROM sqlite_master WHERE type = 'table';");
            return [tableFormat(dbRet[0])];
        } else {
            stderr(`The command ${command.split(" ")[0]} does not exist.\n`);
            return [];
        }
    }

    let dbRet;
    try {
        dbRet = db.exec(command);
    } catch (err) {
        stderr(`Error: ${err.message}\n`);
        return [];
    }

    let visualization;
    try {
        visualization = visualize(command, db);
    } catch (err) {
        console.log(err);
    }

    const out = [];

    for (const table of dbRet) {
        out.push(tableFormat(table));
    }

    if (visualization) {
        return { out, visualization };
    } else {
        return out;
    }
}
