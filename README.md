# speed_niqturbo
```
   14  apt full-upgrade
   15  apt -y install lsb-release apt-transport-https ca-certificates
   16  wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
   17  echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | tee
   18  /etc/apt/sources.list.d/php.list
   19  sudo apt update
   20  apt update
   21  apt -y install php7.4
   22  apt-get install php7.4-{bcmath,bz2,intl,gd,mbstring,mysql,zip}
```
