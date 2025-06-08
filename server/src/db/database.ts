import { DataSource } from "typeorm";
import { Sleep } from "../entities/Sleep";
import path from "path";

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: path.join(__dirname, "../../data/database.sqlite"),
    entities: [Sleep],
    synchronize: true,
    logging: true,
}); 