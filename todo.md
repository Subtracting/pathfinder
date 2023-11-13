## To Do


- route generator
- make script to start everything - docker, server, backend
- hoogtemeters
- route gelopen, en tijd en gevoel (smileys)
- route markers (show routes toggle)



## Commands
```
docker run -t -v c:/docker:/data osrm/osrm-backend osrm-extract -p /opt/foot.lua /data/netherlands-latest.osm.pbf

docker run -t -v c:/docker:/data osrm/osrm-backend osrm-partition /data/netherlands-latest.osrm
docker run -t -v c:/docker:/data osrm/osrm-backend osrm-customize /data/netherlands-latest.osrm

docker run --name osrm -t -i -p 5000:5000 -v c:/docker:/data osrm/osrm-backend osrm-routed --algorithm mld /data/netherlands-latest.osrm

docker start osrm

mongosh
```