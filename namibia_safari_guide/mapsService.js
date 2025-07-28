export const loadGoogleMaps = () => {
  return new Promise((resolve) => {
    if (window.google) return resolve();

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    document.head.appendChild(script);
  });
};

export const calculateDistance = (origin, destination) => {
  return new Promise((resolve) => {
    const service = new window.google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: "DRIVING",
      },
      (response) => {
        if (response.rows[0].elements[0].status === "OK") {
          resolve(response.rows[0].elements[0]);
        } else {
          resolve(null);
        }
      },
    );
  });
};
