  
#sudo kill `sudo lsof -t -i:3000`
fuser -k -n tcp 3000
