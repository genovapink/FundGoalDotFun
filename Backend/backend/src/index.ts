import { mongoConnect } from "./packages/mongodb";
import { runServer } from "./server";

mongoConnect().then(runServer).catch(console.error);
