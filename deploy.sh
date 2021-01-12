npm run build


tar.exe cvzf build.tar dist
scp build.tar root@167.99.39.94:/mysites/digitz-fe

ssh root@167.99.39.94 -C 'cd /mysites/digitz-fe && tar -zxvf build.tar && rm -rf app-prev && mv app app-prev && mv dist app && rm build.tar'

rm -rf dist
rm build.tar