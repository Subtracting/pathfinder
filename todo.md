## To Do
- route generator
- hoogtemeters
- route gelopen, en tijd


## Commands
```
docker run -t -v c:/docker:/data osrm/osrm-backend osrm-extract -p /opt/foot.lua /data/netherlands-latest.osm.pbf

docker run -t -v c:/docker:/data osrm/osrm-backend osrm-partition /data/netherlands-latest.osrm
docker run -t -v c:/docker:/data osrm/osrm-backend osrm-customize /data/netherlands-latest.osrm

docker run --name osrm -t -i -p 5000:5000 -v c:/docker:/data osrm/osrm-backend osrm-routed --algorithm mld /data/netherlands-latest.osrm

```