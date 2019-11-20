const path = require("path");

const tilestrata = require("tilestrata");
const disk = require("tilestrata-disk");
const mapnik = require("tilestrata-mapnik");

const strata = tilestrata({
  balancer: {
    host: "10.211.55.8:8098"
  }
});

strata
  .layer("points")
  .route("tile.png")
  .use(disk.cache({ dir: path.join(__dirname, "cache/tiles/points/") }))
  .use(
    mapnik({
      pathname: path.join(__dirname, "point.xml")
    })
  );

strata.listen(process.env.port || 8099);
