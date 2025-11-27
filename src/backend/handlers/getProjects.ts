import fs from "node:fs";
import { PROGRAMS_PATH } from "../../constants/Global";
import getProgram from "../utils/getProgram";

export default function getProjects() {
	return Promise.all(fs.readdirSync(PROGRAMS_PATH).map(getProgram));
}
