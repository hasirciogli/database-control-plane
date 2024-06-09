import fs from "fs";
import path from "path";

interface User {
  username: string;
  password: string;
}

interface DatabaseData {
  users?: User[];
  [key: string]: any; // Diğer alanlar için
}

class Database {
  private static instance: Database;
  public data: DatabaseData = {};
  private filename: string;

  private constructor(filename: string) {
    this.filename = filename;
    this.load();
    this.registerThread();

    this.handleExit();
  }

  public static getInstance(filename: string): Database {
    if (!Database.instance) {
      Database.instance = new Database(filename);
    }
    return Database.instance;
  }

  public load(): void {
    const filePath = path.join(__dirname, "../../data", this.filename);
    try {
      if (!fs.existsSync(filePath)) {
        // Dosya yoksa boş bir JSON dosyası oluştur
        fs.writeFileSync(filePath, "{}", "utf-8");
        clog("Database file created.", "LOCAL DB");
      }
      const fileData = fs.readFileSync(filePath, "utf-8");
      Object.assign(this.data, JSON.parse(fileData));
      clog("Database loaded.", "LOCAL DB");
    } catch (err) {
      clog("Error loading database:" + err, "LOCAL DB");
    }
  }

  public save(): void {
    const filePath = path.join(__dirname, "../../data", this.filename);
    try {
      const jsonData = JSON.stringify(this.data, null, 2);
      fs.writeFileSync(filePath, jsonData, "utf-8");
      clog("Database saved.", "LOCAL DB");
    } catch (err) {
      clog("Error saving database:" + err, "LOCAL DB");
    }
  }

  private registerThread(): void {
    setInterval(() => {
      this.save();
    }, 25000);
  }

  public addUser(user: User): void {
    if (!this.data.users) {
      this.data.users = [];
    }

    // check if user exists via username
    if (this.data.users.find((u) => u.username === user.username)) {
      clog("User already exists.", "LOCAL DB");
      return;
    }

    this.data.users.push(user);
    this.save();
  }

  public getUsers(): User[] {
    return this.data.users || [];
  }

  // Uygulama kapatıldığında veritabanını kaydet
  private handleExit(): void {
    process.on("exit", () => {
      this.save();
    });
    // Kapatma işlemi bekleniyor
    process.on("SIGINT", () => {
      clog("Exiting...", "LOCAL DB");
      process.exit(0);
    });
  }
}

export const PlaneDB = Database.getInstance("Database.json");

export default Database;
