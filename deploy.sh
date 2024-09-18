#// windows tar.exe cvzf build.tar dist
npm run build

tar cvzf build.tar dist
scp build.tar root@139.59.133.159:/var/www/q-project/front-end

ssh root@139.59.133.159 -C 'cd /var/www/q-project/front-end && tar -zxvf build.tar && rm -rf app-prev && mv app app-prev && mv dist app && rm build.tar'

rm -rf dist
rm build.tar