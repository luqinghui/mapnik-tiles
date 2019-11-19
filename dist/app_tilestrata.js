const path = require("path");

const tilestrata = require("tilestrata");
const disk = require("tilestrata-disk");
const mapnik = require("tilestrata-mapnik");


const strata = tilestrata();

strata
  .layer("points")
  .route("*.png")
  .use(disk.cache({ dir: "./cache/tiles/points" }))
  .use(
    mapnik({
      pathname: path.join(__dirname, "point.xml")
    })
  );

strata.listen(process.env.PORT || 8099);
