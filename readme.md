# Mysql Control Plane

Mysql control plane ile mysql sunucularınızın kontrolünü yaparsınız. UI veya rest apisi ile token oluşturup istek göndererek yönetebilirsiniz.



## İşlemler
- Toplu veritabanı ekleme güncelleme işlemler listeleme vb.
- Veritabanı kullanıcı yönetimi, kullanıcı ekleme listeleme, günceleme, sql çalıştırma, yetki vb.


## Kurulum NodeJS

> **Install NodeJS Dependencies**

`npm i`

>  **Run In Production**

`npx tsc && node dist/cli/cli.js start-http-server`


## Kurulum Docker
> **Docker imaj indirme**

`docker pull hasirciogli/mysql-control-plane`


> **Docker proje başlatma**

`docker run -d --name=mysql-control-plane --restart=always -d hasirciogli/mysql-control-plane`