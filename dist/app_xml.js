const path = require("path");

const Koa = require("koa");
const router = require("koa-router")();

const mapnik = require("mapnik");
const Mercator = require("@mapbox/sphericalmercator");

if (mapnik.register_default_input_plugins)
  mapnik.register_default_input_plugins();

const PORT = process.env.PORT;

const WIDTH = 256;
const HEIGHT = 256;

const PROJ3857 = "+init=epsg:3857";
const PROJ4326 = "+init=epsg:4326";

const app = new Koa();

const TMS_SCHEME = false;

async function renderImage(map, x, y, zoom) {
  return new Promise((resolve, reject) => {
    map.load(path.join(__dirname, "point.xml"), { strict: true }, function(
      err,
      map
    ) {
      if (err) {
        console.log(err);
        reject(err);
      }

      // xyz to bbox
      const bbox = new Mercator().bbox(x, y, zoom, false, "900913");

      map.extent = bbox;

      // render image
      let im = new mapnik.Image(map.width, map.height);

      map.render(im, function(err, im) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          let img = im.encodeSync("png");
          resolve(img);
        }
      });
    });
  });
}

router.get("/tiles/:z/:x/:y.png", async (ctx, next) => {
  // parse xyz
  let zoom = parseInt(ctx.params.z, 10),
    x = parseInt(ctx.params.x, 10),
    y = parseInt(ctx.params.y, 10);

  if (TMS_SCHEME) y = y = Math.pow(2, z) - 1 - y;

  // mapnik
  let map = new mapnik.Map(WIDTH, HEIGHT, PROJ3857);

  map.bufferSize = 64;

  await renderImage(map, x, y, zoom)
    .then(function(value) {
      ctx.type = "png";
      ctx.body = value;
    })
    .catch(function(err) {
      ctx.type = "json";
      ctx.body = { err };
    });
});

app.use(router.routes());

app.listen(PORT);
console.log(`"app started at port ${PORT}...`);
