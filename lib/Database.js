const fs = require('fs');

class Database {
    registerThread() {
        setInterval(() => {
            //this.log("Interval runned")
            this.save();
        }, 25000);
    }
    constructor(filename) {
        if (Database.instance) {
            return Database.instance;
        }
        this.filename = filename;
        this.data = {};
        this.load();
        Database.instance = this;

        // Uygulama kapatıldığında veritabanını kaydet
        process.on('exit', () => {
            this.save();
        });

        // Kapatma işlemi bekleniyor
        process.on('SIGINT', () => {
            clog('Uygulama kapatılıyor...', "LOCAL DB");
            process.exit(0);
        });

        this.registerThread();
    }

    load() {
        try {
            const data = fs.readFileSync(this.filename);
            this.data = JSON.parse(data);
            clog('Veritabanı yüklendi.', "LOCAL DB");
        } catch (err) {
            console.error('Veritabanı yüklenirken hata oluştu:', err);
        }
    }

    save() {
        try {
            const jsonData = JSON.stringify(this.data);
            fs.writeFileSync(this.filename, jsonData);
            clog('Veritabanı kaydedildi.', "LOCAL DB");
        } catch (err) {
            console.error('Veritabanı kaydedilirken hata oluştu:', err);
        }
    }

    addUser(user) {
        if (!this.data.users) {
            this.data.users = [];
        }
        this.data.users.push(user);
        this.save();
    }

    getUsers() {
        return this.data.users || [];
    }
}

const db = new Database(__dirname + '/../data/Database.json');

module.exports = db;