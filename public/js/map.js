 

        const map = new maplibregl.Map({
         container: 'map',
         style: `https://api.maptiler.com/maps/streets/style.json?key=${window.MAP_TOKEN}`,
         center:window.coordinates,
         zoom: 2
  });


const popup = new maplibregl.Popup({ offset: 25 })
  .setHTML(`<h4>${window.locationText}</h4><p>Exact Location will be provided after booking</p>`)
  ; 

// Add marker with popup
const marker = new maplibregl.Marker({ color: "red" })
  .setLngLat(window.coordinates)
  .setPopup(popup) 
  .addTo(map);

