#!/bin/sh
#START
rm -r ./prd
mkdir ./prd
old=33
# 在這個迴圈填入要產生的診所id，要用空白隔開，(33不能動，不然就抓不到id，33是公司的id)
for clinicId in 33 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64
do
    sed -i "s/clinicId:$old,/clinicId:$clinicId,/g" ./src/components/Shift.vue
    npm run build
    old=$clinicId
    mv "./dist" "./prd/${old}"
done
#END
sed -i "s/clinicId:$old,/clinicId:33,/g" ./src/components/Shift.vue